# Ricostruzione del DB "Luce" su Supabase Quootami — guida + prompt per Claude

Questo documento spiega cosa va ricostruito sul Supabase di Quootami, da dove
vengono i dati, come sono collegati i vari script, e contiene i prompt pronti
da incollare a una sessione Claude che abbia accesso al Supabase di Quootami
(MCP connesso al progetto `quootami`, org `iulktthjkzvmevzoqhww`).

Il codice sorgente di tutti gli script è già su
`github.com/giacomoramella/quootami`, cartella `supabase/` (vedi `EN-MIGRATION.md`
nella root del repo). Qui sotto trovi anche i file di seed dati già pronti,
in `supabase/seed/`, e lo script per la fonte originaria ARERA in
`supabase/scripts/`.

## 1. Da dove vengono i dati

Tutto il progetto "Luce" (comparatore bollette) vive oggi su un Supabase
diverso, di proprietà di armandocesa: progetto **novacrm-eu**
(`xargkgrqgbcpmxtrfjkz`, org `armandocesa's Org`). Lì esiste uno schema
Postgres chiamato `energy` con:

- `energy.suppliers` — 92 fornitori luce/gas (nome, gruppo, tipo, contatti, stato partnership)
- `energy.offers` — 170 offerte tariffarie collegate ai fornitori (prezzi fissi/indicizzati, quote fisse, durata)
- `energy.market_indices` — 2 indici di mercato (PUN per la luce, PSV per il gas) usati per le offerte indicizzate
- `energy.bills`, `energy.proposals` — dati generati dagli utenti (bollette caricate, preventivi calcolati): questi NON vanno copiati, si rigenerano da soli quando i clienti usano il nuovo sito
- funzioni RPC (`energy_quote_public`, `energy_public_lead`, `energy_analyze_and_crm`, ecc.) e 2 Edge Function (`energy-lead`, `bill-extract-public`)

Per la migrazione ho fatto una copia 1:1 di struttura e dati di
`suppliers`/`offers`/`market_indices` nel nuovo schema `en` (stesso identico
contenuto, solo i nomi tabelle/funzioni con prefisso `en` come richiesto), MA
ho **riscritto le funzioni** per eliminare la dipendenza dallo schema `crm`
(che esiste solo su novacrm-eu e non deve essere ricreato su Quootami): il
lead del cliente (nome/email/telefono) viene salvato direttamente sulla riga
`en.bills` invece che su un CRM esterno.

A monte di novacrm-eu, la fonte primaria dei dati è comunque il **Portale
Offerte ARERA/Acquirente Unico** (`ilportaleofferte.it`), dove ogni venditore
di energia è obbligato per legge a caricare le proprie offerte attive: vedi
il Prompt 2bis più sotto e lo script `supabase/scripts/fetch_arera_opendata.py`
per rigenerare i dati direttamente da lì invece che da novacrm-eu.

I file di seed con i dati reali già esportati da novacrm-eu (pronti da
eseguire con `insert into ...`) sono in `supabase/seed/`:
`en-seed-suppliers.sql` (92 righe), `en-seed-offers-1.sql` … `en-seed-offers-4.sql`
(170 righe totali), `en-seed-market-indices.sql` (2 righe). Sono uno snapshot
del 14/07/2026: le offerte cambiano nel tempo, quindi se passano settimane
prima di eseguirli conviene rigenerarli con la query del Prompt 2 o con lo
script ARERA del Prompt 2bis, invece di usare il file statico.

## 2. I diversi script e come girano insieme

Il flusso end-to-end, una volta completata la migrazione, è:

1. L'utente apre **`en.confronta.html`** (pagina statica HTML/JS, nessun
   framework, nessuna build) e inserisce i dati della bolletta a mano oppure
   carica una foto/PDF.
2. Se carica un file, il browser chiama l'Edge Function
   **`en-bill-extract`**, che manda l'immagine a Claude (Anthropic API,
   vision) con un prompt che estrae consumo, prezzo unitario, fornitore
   attuale ecc. e li rimanda al browser come JSON.
3. Il browser chiama la RPC **`en_quote_public(p)`** (via PostgREST, con la
   chiave `anon`) per mostrare subito un confronto con i fornitori mascherati
   ("Fornitore 1", "Fornitore 2"...). Questa funzione legge solo
   `en.offers`/`en.suppliers`/`en.market_indices`, non scrive nulla.
2. Quando l'utente vuole sbloccare i risultati inserisce nome/email/telefono
   e acconsente al trattamento dati: il browser chiama l'Edge Function
   **`en-lead`** con `action=submit`. Questa funzione:
   - applica un rate limit (RPC `en_rate_hit`, per IP/email/globale),
   - chiama la RPC **`en_public_lead(p)`**, che salva la bolletta+lead su
     `en.bills` e calcola le proposte (`en.compute_proposals`, scrittura su
     `en.proposals`),
   - crea un token di verifica email (RPC `en_verification_create`),
   - manda una mail di conferma via Resend con un link tipo
     `.../functions/v1/en-lead?action=verify&token=...`.
3. Quando l'utente clicca il link nella mail, il browser chiama
   **`en-lead?action=verify`** (GET): questa conferma il token (RPC
   `en_verification_confirm`), manda una seconda mail di conferma, e
   reindirizza l'utente a `en.confronta.html?verified=<token>`.
4. La pagina, vedendo il parametro `verified`, chiama **`en-lead?action=results`**
   (POST col token) per ottenere le offerte in chiaro (RPC
   `en_verification_results`) e mostrarle con nome fornitore vero, link di
   attivazione, ecc.

Tutte le funzioni RPC sono `SECURITY DEFINER` e girano con permessi elevati
(bypassano la Row Level Security), quindi le tabelle `en.*` restano protette
da RLS per accessi diretti, e l'unico modo di leggere/scrivere è passare dalle
funzioni pubbliche o dalla `service_role` (usata solo dalle Edge Function, mai
esposta al browser).

## 3. Prompt da dare a Claude (in ordine, uno alla volta)

Da usare in una sessione Claude che abbia il connettore Supabase collegato al
progetto Quootami (org `iulktthjkzvmevzoqhww`, progetto `quootami`) con ruolo
sufficiente per eseguire SQL e deployare Edge Function — non con il solo
accesso in lettura che ho io ora. Se possibile, dai a Claude accesso anche al
progetto `novacrm-eu` (`xargkgrqgbcpmxtrfjkz`) per il Prompt 2, così può
rigenerare dati aggiornati invece di usare lo snapshot statico.

---

### Prompt 1 — Creare lo schema

```
Ho un file supabase/en-schema.sql nel repo github.com/giacomoramella/quootami
(branch main). Leggilo ed eseguilo per intero sul progetto Supabase
"quootami" (org iulktthjkzvmevzoqhww) usando lo strumento MCP Supabase
(execute_sql o apply_migration). Crea lo schema "en" con tutte le tabelle
(suppliers, offers, market_indices, bills, proposals, rate_limits,
email_verifications), la vista en.proposal_details, e tutte le funzioni
(en.compute_proposals, en_quote, en_quote_public, en_rate_hit,
en_analyze_and_lead, en_public_lead, en_verification_create,
en_verification_confirm, en_verification_results). Al termine mostrami
list_tables per lo schema en per confermare che sia tutto a posto, e
controlla con get_advisors che non ci siano warning di sicurezza (RLS
mancante ecc.).
```

---

### Prompt 2 — Popolare fornitori, offerte e indici (da novacrm-eu)

Se hai accesso anche al progetto novacrm-eu (consigliato, dati sempre
aggiornati):

```
Hai accesso sia al progetto Supabase "novacrm-eu" (xargkgrqgbcpmxtrfjkz) sia
al progetto "quootami" (nell'org iulktthjkzvmevzoqhww). Esporta i dati da
novacrm-eu, schema energy, tabelle suppliers, offers, market_indices, e
inseriscili nelle tabelle corrispondenti en.suppliers, en.offers,
en.market_indices del progetto quootami, mantenendo gli stessi id (uuid) così
che offers.supplier_id continui a puntare al supplier giusto. Usa una query
tipo: seleziona da energy.suppliers/energy.offers/energy.market_indices su
novacrm-eu, genera statement "insert into en.X (...) values (...)" con
format()/%L per l'escaping corretto, e eseguili sul progetto quootami. Fallo
a lotti se il risultato è troppo grande per una singola chiamata (energy.offers
ha 170 righe, energy.suppliers 92). Alla fine conta le righe in en.suppliers,
en.offers, en.market_indices su quootami e verifica che combacino con i
conteggi su novacrm-eu.
```

Se invece NON hai accesso a novacrm-eu, usa lo snapshot già pronto:

```
Nel repo github.com/giacomoramella/quootami, cartella supabase/seed/, trovi
i file en-seed-suppliers.sql, en-seed-offers-1.sql, en-seed-offers-2.sql,
en-seed-offers-3.sql, en-seed-offers-4.sql, en-seed-market-indices.sql: sono
insert SQL già pronti (92 fornitori, 170 offerte, 2 indici), snapshot del
14/07/2026. Eseguili in questo ordine sul progetto Supabase "quootami" (org
iulktthjkzvmevzoqhww) con lo strumento MCP Supabase, poi verifica i conteggi
righe in en.suppliers (attesi 92), en.offers (attesi 170), en.market_indices
(attesi 2).
```

---

### Prompt 2bis — Popolare offerte dalla fonte ufficiale ARERA (invece che da novacrm-eu)

I dati che oggi sono in novacrm-eu (e nel file di seed) sono a loro volta
originati da una fonte pubblica ufficiale: il **Portale Offerte luce e gas**
(`ilportaleofferte.it`), gestito da Acquirente Unico per conto di ARERA. È lì
che ogni venditore di energia è obbligato per legge a caricare le proprie
offerte attive — è la fonte primaria, non novacrm-eu.

Ho verificato il 14/07/2026 che la pagina
`https://www.ilportaleofferte.it/portaleOfferte/it/open-data.page` espone
link di download diretti (CSV per il mercato tutelato/PLACET, XML+CSV per il
Mercato Libero, CSV per gli indici storici PUN/PSV) aggiornati
quotidianamente. **Non sono riuscito a scaricare il contenuto dei file XML/CSV
del Mercato Libero in questa sessione** (la mia rete sandbox non raggiunge
quel dominio), quindi non ho potuto confermare i nomi esatti delle colonne:
ho preparato uno script scheletro, `supabase/scripts/fetch_arera_opendata.py`,
che scarica i file veri e ne stampa la struttura reale (`--inspect-only`)
prima di generare qualunque SQL, proprio per evitare di inventare un mapping
sbagliato.

Importante: l'open data ARERA contiene solo i dati "di fatto" (nome
fornitore, partita IVA, codice offerta, prezzi, validità). NON contiene i
campi commerciali che oggi sono curati a mano in `en.suppliers`
(`partner_status`, `commission_note`, `characteristics`, `area`,
`price_level`, `phone`, `email`, `website`, `signup_url`): un refresh da
ARERA deve fare un **upsert** che aggiorna solo prezzi/offerte e lascia
intatti questi campi per i fornitori già presenti.

```
Nella cartella supabase/scripts (o allegata a questa conversazione) trovi
fetch_arera_opendata.py: uno script Python che scarica i file open data
ufficiali del Portale Offerte ARERA
(ilportaleofferte.it/portaleOfferte/it/open-data.page) — offerte Mercato
Libero elettrico e gas (XML) con i relativi parametri economici (CSV) — e
serve come base per rigenerare en.offers/en.suppliers da fonte primaria
invece che copiandoli da novacrm-eu. Prima cosa da fare: installa "requests"
(pip install requests) ed esegui
`python3 fetch_arera_opendata.py --inspect-only`. Questo scarica i file veri
e stampa la struttura reale delle colonne CSV e dei tag XML: confrontala con
le costanti FIELDS_OFFERTE_ML_GUESS e FIELDS_PARAMETRI_ML_GUESS in cima al
file (sono un'ipotesi basata sulle convenzioni SII standard, non ancora
verificata su un file reale) e correggile se necessario. Poi completa le
funzioni map_to_en_offers()/map_to_en_suppliers() nello script per generare
insert SQL su en.suppliers/en.offers del progetto Supabase "quootami": usa
un upsert (insert ... on conflict (id o su una chiave naturale tipo
arera_offer_code) do update) che aggiorni solo i campi prezzo/validità/nome
e NON tocchi i campi commerciali curati a mano (partner_status,
commission_note, characteristics, area, price_level, phone, email, website,
signup_url) se il fornitore esiste già. Filtra solo le offerte
customer_type=domestic e commodity ele/gas (ignora business/dual fuel per
ora, il sito "Luce" oggi copre solo quello). Alla fine confrontami il numero
di offerte importate con quelle attualmente in en.offers e segnalami
eventuali fornitori nuovi non ancora presenti in en.suppliers.
```

---

### Prompt 3 — Deployare le Edge Function e i secret

```
Nel repo github.com/giacomoramella/quootami trovi
supabase/functions/en-lead/index.ts e
supabase/functions/en-bill-extract/index.ts. Deployale entrambe sul progetto
Supabase "quootami" (org iulktthjkzvmevzoqhww) con verify_jwt disattivato
(sono endpoint pubblici chiamati dal browser senza login). Prima di
deployare en-lead, sostituisci nel codice i tre TODO: LANDING (URL definitivo
della pagina, es. https://<dominio-quootami>/en.confronta.html), FROM
(mittente email, es. "Quootami Energia <energia@<dominio-verificato>>") e
SITE (nome/brand da mostrare nelle email). Poi imposta questi secret sul
progetto: RESEND_API_KEY (chiave API Resend per invio email transazionali),
ANTHROPIC_API_KEY (per l'OCR delle bollette in en-bill-extract), LANDING_URL
e FROM_EMAIL (stessi valori messi nel codice, così restano configurabili
senza un nuovo deploy). Conferma con list_edge_functions che entrambe le
funzioni siano attive.
```

---

### Prompt 4 — Collegare il frontend al nuovo backend

```
Nel repo github.com/giacomoramella/quootami c'è il file en.confronta.html,
oggi ancora puntato al backend Supabase di novacrm-eu. Modificalo così: (1)
sostituisci la costante SUPABASE_URL con l'URL del progetto "quootami" (usa
get_project_url) e SUPABASE_ANON_KEY con la chiave anon di quel progetto
(usa get_publishable_keys); (2) rinomina ogni chiamata RPC/funzione da
energy_quote_public a en_quote_public, da
"/functions/v1/energy-lead" a "/functions/v1/en-lead", e da
"/functions/v1/bill-extract-public" a "/functions/v1/en-bill-extract" (cerca
questi tre nomi nel file, sono usati in più punti nel JavaScript inline).
Non toccare nient'altro (grafica, testi, struttura). Committa la modifica sul
branch main con un messaggio tipo "Cutover en.confronta.html sul backend
Quootami".
```

---

### Prompt 5 — Verifica end-to-end

```
Testa il flusso completo del comparatore su en.confronta.html dopo il deploy
Vercel: 1) apri la pagina e inserisci manualmente dati di una bolletta luce di
prova (consumo 2700 kWh/anno, prezzo unitario attuale 0.14 EUR/kWh, nessuna
quota fissa) e verifica che compaiano proposte con fornitori mascherati e un
risparmio stimato; 2) invia il lead con una email di test e conferma che
arrivi la mail di conferma da Resend (controlla anche i log della funzione
en-lead con get_logs se non arriva); 3) clicca il link di verifica e conferma
che la pagina mostri le offerte in chiaro con nomi fornitore reali; 4)
controlla get_advisors sul progetto quootami per assicurarti che non ci siano
problemi di sicurezza aperti (RLS, funzioni senza search_path fisso, ecc.).
Riportami cosa hai trovato.
```

---

## 4. Nota sui file di seed e sullo script ARERA

Tutti i file citati sopra (`supabase/seed/en-seed-*.sql`,
`supabase/scripts/fetch_arera_opendata.py`) sono nel repo
`github.com/giacomoramella/quootami`, branch `main`.
