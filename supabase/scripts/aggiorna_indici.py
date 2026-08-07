#!/usr/bin/env python3
"""Aggiorna en.market_indices (PUN, PSV) dalla fonte primaria.

Il Portale Offerte pubblica nella pagina open-data un CSV "prezzi storici"
con le medie mensili (colonne: AnnoMese;PUN (/kWh);PSV (/Smc);...). Il nome
del file è un hash non prevedibile: va sempre scoperto dalla pagina.

Lo script scarica il CSV, prende l'ULTIMO mese pubblicato (in genere 1-2 mesi
indietro rispetto a oggi: sono medie mensili consolidate) e stampa l'UPDATE
da eseguire con:  supabase db query --linked --file <(python3 aggiorna_indici.py)
oppure salvandolo in docs/sql/.

Da eseguire a ogni refresh del catalogo offerte: gli indicizzati si prezzano
come indice + spread, un indice vecchio sposta tutti i confronti.
"""
import re
import sys
import calendar

import requests

BASE = "https://www.ilportaleofferte.it"
H = {"User-Agent": "Mozilla/5.0 (compatible; QuootamiEnergiaBot/1.0; +https://quootami.it)"}


def main() -> None:
    pg = requests.get(f"{BASE}/portaleOfferte/it/open-data.page", headers=H, timeout=30).text
    doc = re.findall(r'href="(/portaleOfferte/resources/cms/documents/[^"]+\.csv)"', pg)
    if not doc:
        sys.exit("CSV prezzi storici non trovato nella pagina open-data")
    csv = requests.get(BASE + doc[0], headers=H, timeout=60).content.decode("utf-8-sig", "ignore")
    righe = [r for r in csv.splitlines() if re.match(r"^\d{6};", r)]
    if not righe:
        sys.exit("nessuna riga dati nel CSV")
    ultima = righe[-1].split(";")
    anno_mese, pun, psv = ultima[0], ultima[1], ultima[2]
    anno, mese = int(anno_mese[:4]), int(anno_mese[4:6])
    fine_mese = f"{anno}-{mese:02d}-{calendar.monthrange(anno, mese)[1]:02d}"
    pun_v = pun.replace(",", ".")
    psv_v = psv.replace(",", ".")
    print(f"-- Indici dal CSV prezzi storici del Portale Offerte — mese {anno_mese}")
    print(f"-- PUN {pun_v} EUR/kWh · PSV {psv_v} EUR/Smc")
    print("begin;")
    print(f"update en.market_indices set value = {pun_v}, as_of = '{fine_mese}' where name = 'PUN';")
    print(f"update en.market_indices set value = {psv_v}, as_of = '{fine_mese}' where name = 'PSV';")
    print("commit;")


if __name__ == "__main__":
    main()
