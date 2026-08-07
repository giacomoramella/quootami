-- Fix 07/08/2026 — offerte a prezzo fisso con la sola fascia F1 valorizzata.
--
-- Il refresh del 06/08 ha caricato le offerte fisse monorarie con il prezzo in
-- price_f1 e f2/f3 nulli. La funzione en.compute_proposals, quando la bolletta
-- non ha fasce, calcola f1*0.35 + f2*0.31 + f3*0.34: con f2/f3 nulli il costo
-- diventa NULL e l'insert in en.proposals viola il NOT NULL su
-- annual_cost_offer → OGNI lead falliva con "Errore interno".
--
-- Convenzione già usata dal catalogo storico (es. DOLOMITI FISSO: 0.119 su
-- tutte e tre le fasce): il prezzo monorario si replica su F2 e F3.
-- Idempotente.

update en.offers
   set price_f2 = coalesce(price_f2, price_f1),
       price_f3 = coalesce(price_f3, price_f1)
 where price_type = 'fixed'
   and price_f1 is not null
   and (price_f2 is null or price_f3 is null);
