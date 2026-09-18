# Archivio — verticale luce e gas

Il verticale luce e gas è **archiviato dal 07/09/2026**: online il sito espone
solo **assicurazioni e previdenza**. Il codice non è stato cancellato, perché il
verticale verrà ripreso più avanti.

## Cosa c'è qui

### Codice archiviato che era online (da riattivare così com'è)

| File | Posizione originale |
|---|---|
| `app-luce/page.tsx` | `app/luce/page.tsx` — rotta `/luce` |
| `components/ComparatoreLuce.tsx` | comparatore offerte (Supabase + edge function `en-lead`) |
| `components/LuceGuida.tsx` | sezione redazionale della pagina |

### Codice nuovo, mai stato online (aggiunto il 07/09/2026)

Il verticale **non riparte dal comparatore**: riparte da una landing di lista
d'attesa. Finché non c'è almeno un mandato firmato, mostrare un confronto prezzi
sarebbe una comparazione finta — pratica commerciale scorretta, e il modo più
rapido di bruciarsi con i fornitori con cui si sta trattando.

| File | Destinazione alla riattivazione |
|---|---|
| `app-luce-e-gas/page.tsx` | `app/luce-e-gas/page.tsx` — landing lista d'attesa |
| `components/ListaAttesaLuceGas.tsx` | `components/` — form con i tre consensi separati |
| `supabase/en-waitlist.sql` | da applicare al progetto `ivcdwizhkdubjxxrukbs` |

Specifica completa: `docs/LANDING-LUCE-E-GAS.md`.
Stato delle trattative con i fornitori: `docs/OUTREACH-FORNITORI-2026-09.md`.

La cartella `archivio/` è esclusa in `tsconfig.json`: i file non vengono
type-checkati né inclusi nel build, quindi non finiscono online in nessuna forma.

Restano invece al loro posto, perché non sono raggiungibili dal sito:

- `supabase/functions/en-bill-extract` e `supabase/functions/en-lead`
- `docs/ATTIVAZIONE-LUCE.md`, `docs/TARGET-FORNITORI-FASE1.md`,
  `docs/PROSSIMI-PASSI-PARTNERSHIP-FORNITORI.md`, `docs/EN-MIGRATION.md`

## Come riattivare il verticale

**In due tempi.** Prima la landing (passi A), che serve subito: le mail ai
fornitori sono partite il 07/09/2026 e chi le riceve apre il sito, e Awin valuta
il sito del publisher prima di approvare la candidatura. Poi il comparatore
(passi 1-9), solo a mandato firmato.

### A — landing di lista d'attesa (fattibile adesso)

1. Applicare `archivio/luce-e-gas/supabase/en-waitlist.sql` su Supabase.
2. `git mv archivio/luce-e-gas/components/ListaAttesaLuceGas.tsx components/`
3. `git mv archivio/luce-e-gas/app-luce-e-gas/page.tsx app/luce-e-gas/page.tsx`
4. In `next.config.js`: puntare il redirect `/luce` su `/luce-e-gas`.
5. Rimettere la voce in `Nav.tsx`, `app/sitemap.ts` e `app/mappa-sito/page.tsx`.
6. Togliere `"archivio"` da `exclude` in `tsconfig.json` **oppure** verificare
   che i due file spostati compilino (`npm run build`).

### B — comparatore completo (solo dopo il primo mandato firmato)

1. `git mv archivio/luce-e-gas/app-luce/page.tsx app/luce/page.tsx`
2. `git mv archivio/luce-e-gas/components/*.tsx components/`
3. In `next.config.js`: togliere il redirect `/luce → /` e ripuntare
   `/luce.html` su `/luce`.
4. In `app/page.tsx`: rimettere la card energia — servono l'accento `navy` in
   `AreaCard` e l'icona `BoltIcon`, rimossi nel commit di archiviazione e
   recuperabili con `git show`.
5. In `app/page.tsx`, blocco «Non solo assicurazioni»: rimettere il richiamo
   alle forniture di luce e gas.
6. `app/privacy/page.tsx` — **già fatto, non toccare.** Dal 07/09/2026
   l'informativa (versione 2.0) copre già il verticale luce e gas: perimetro
   fuori RUI/IVASS (§ 2), dati del modulo energia (§ 3), base giuridica del
   confronto tariffe e consenso distinto alla comunicazione ai fornitori (§ 4),
   i tre consensi separati (§ 5), i fornitori come titolari autonomi (§ 8).
   La compliance precede la raccolta, non la segue.
   Alla riattivazione restano da fare solo due cose:
   - rimettere **Anthropic** fra i responsabili esterni (§ 7) e nei
     trasferimenti extra-UE (§ 9) **se e solo se** torna in uso l'estrazione
     dati da bolletta (`supabase/functions/en-bill-extract`);
   - creare la pagina pubblica con l'elenco dei fornitori partner, richiamata
     dalla § 8 (per ora l'elenco è dichiarato disponibile solo su richiesta).
   Se modifichi finalità, destinatari o consensi, **incrementa
   `INFORMATIVA_VERSIONE`** in cima al file: ogni contatto viene salvato con la
   versione vigente al momento dell'invio (art. 7.1 GDPR).
7. Rimettere `/luce` in `app/sitemap.ts`, in `Nav.tsx` e in
   `app/mappa-sito/page.tsx`.
8. Rimettere la categoria `casa-energia` in `config/guide.ts`.
9. Togliere `"archivio"` da `exclude` in `tsconfig.json`.

## Requisiti privacy del modulo energia

Quando il form torna online, ogni invio deve salvare — oltre ai dati del
contatto — la **prova del consenso**: timestamp, IP, user-agent, i tre consensi
come booleani **distinti** (mai uno cumulativo) e l'identificativo di versione
dell'informativa e dei testi di consenso vigenti in quel momento.

Senza questi campi il contatto non è trasferibile a un fornitore: il primo che
firma chiede come dimostri il consenso, e "la casella era spuntata" non basta.
Va costruito subito, con dieci contatti, non dopo, con duemila.
