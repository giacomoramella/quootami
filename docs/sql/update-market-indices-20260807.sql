-- Indici dal CSV prezzi storici del Portale Offerte — mese 202606
-- PUN 0.132505 EUR/kWh · PSV 0.504194 EUR/Smc
begin;
update en.market_indices set value = 0.132505, as_of = '2026-06-30' where name = 'PUN';
update en.market_indices set value = 0.504194, as_of = '2026-06-30' where name = 'PSV';
commit;
