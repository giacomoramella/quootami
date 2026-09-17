-- ================================================================
-- Quootami — irrobustimento delle policy su `leads`
-- Data: 17 settembre 2026
-- Dove: Supabase → SQL Editor → Run
-- ================================================================
-- Contesto
-- --------
-- La chiave `anon` è pubblica per progettazione: chiunque può
-- estrarla dal bundle JavaScript del sito. Quello che protegge i
-- dati non è la chiave, sono le policy. Oggi ce ne sono due più
-- larghe del necessario.
--
-- 1) "Anon can attach documents to own lead"
--    Permette a un anonimo di fare UPDATE su QUALSIASI lead creato
--    negli ultimi 5 minuti — non solo sul proprio, e non solo sulla
--    colonna `documenti`. Chi ha la chiave anon può sovrascrivere
--    email e telefono di una richiesta appena arrivata.
--    Serve ancora? No: il form carica i file su Storage e manda i
--    percorsi via Web3Forms, non fa mai UPDATE. La policy è morta.
--
-- 2) "Anyone can insert leads"
--    Permette l'INSERT diretto in tabella. Anche questa non serve:
--    il form passa dalla funzione `insert_lead`, che è SECURITY
--    DEFINER e quindi scavalca le RLS per conto suo. Togliendola,
--    l'unica strada per scrivere in `leads` resta la funzione.
-- ================================================================

-- [1] Via la UPDATE anonima: non è usata e apre più di quanto chiuda.
drop policy if exists "Anon can attach documents to own lead" on public.leads;

-- [2] Via l'INSERT diretta: si passa solo da insert_lead().
drop policy if exists "Anyone can insert leads" on public.leads;

-- [3] Cintura: niente UPDATE/DELETE per anon nemmeno a livello di grant.
revoke update, delete on public.leads from anon;

-- ================================================================
-- VERIFICA (attesa: solo le policy volute, nessuna su update/delete)
-- ================================================================
-- select policyname, cmd, roles
--   from pg_policies
--  where schemaname = 'public' and tablename = 'leads';
--
-- Poi, dal sito: invia un preventivo di prova e controlla che la
-- riga arrivi in `leads` e la mail Web3Forms pure. Se entrambe
-- arrivano, la stretta non ha rotto nulla.
-- ================================================================

-- ================================================================
-- RESTA APERTO (non si chiude da SQL)
-- ================================================================
-- Il bucket `documenti-lead` accetta upload anonimi: chiunque abbia
-- la chiave anon può caricarci file da 10 MB senza creare un lead.
-- I file non sono leggibili da fuori (nessuna policy SELECT), quindi
-- non è una fuga di dati: è un costo di storage che qualcuno potrebbe
-- gonfiare. La chiusura vera è una route server-side che rilascia
-- signed upload URL una per lead. Da fare se e quando compare abuso.
-- ================================================================
