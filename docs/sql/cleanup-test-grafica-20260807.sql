-- Pulizia 07/08/2026 — rimuove il lead di prova del test grafico delle email (source='test-grafica-email'). Stessa prassi dei test
-- del 15/07: il database di produzione non tiene dati fittizi.

begin;

delete from en.proposals p
 using en.bills b
 where p.bill_id = b.id and b.source = 'test-grafica-email';

delete from en.email_verifications v
 using en.bills b
 where v.bill_id = b.id and b.source = 'test-grafica-email';

delete from en.bills where source = 'test-grafica-email';

commit;
