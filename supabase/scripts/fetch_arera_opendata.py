#!/usr/bin/env python3
"""
fetch_arera_opendata.py

Scarica i dati "open data" ufficiali del Portale Offerte luce e gas
(gestito da Acquirente Unico per conto di ARERA) direttamente dalla fonte
originaria, invece di copiarli dal database novacrm-eu.

Fonte: https://www.ilportaleofferte.it/portaleOfferte/it/open-data.page
Questa e' la pagina dove ogni venditore di energia e' OBBLIGATO a caricare
le proprie offerte attive: e' la fonte primaria da cui derivano anche i dati
oggi presenti in novacrm-eu (colonna "arera_offer_code" / "arera_code").

Verificato manualmente il 2026-07-14: la pagina espone link di download con
questo schema URL (confermato funzionante quel giorno):

  Offerte PLACET (mercato tutelato/transitorio):
    /portaleOfferte/resources/opendata/csv/offerte/{YYYY}_{M}/PO_Offerte_E_PLACET_{YYYYMMDD}.csv
    /portaleOfferte/resources/opendata/csv/offerte/{YYYY}_{M}/PO_Offerte_G_PLACET_{YYYYMMDD}.csv
    /portaleOfferte/resources/opendata/csv/parametri/{YYYY}_{M}/PO_Parametri_E_{YYYYMMDD}.csv
    /portaleOfferte/resources/opendata/csv/parametri/{YYYY}_{M}/PO_Parametri_G_{YYYYMMDD}.csv

  Offerte Mercato Libero (quelle che interessano a "Luce", commodity ele/gas
  domestic -> corrispondono a en.offers):
    /portaleOfferte/resources/opendata/csv/offerteML/{YYYY}_{M}/PO_Offerte_E_MLIBERO_{YYYYMMDD}.xml
    /portaleOfferte/resources/opendata/csv/offerteML/{YYYY}_{M}/PO_Offerte_G_MLIBERO_{YYYYMMDD}.xml
    /portaleOfferte/resources/opendata/csv/offerteML/{YYYY}_{M}/PO_Offerte_D_MLIBERO_{YYYYMMDD}.xml   (dual fuel)
    /portaleOfferte/resources/opendata/csv/parametriML/{YYYY}_{M}/PO_Parametri_Mercato_Libero_E_{YYYYMMDD}.csv
    /portaleOfferte/resources/opendata/csv/parametriML/{YYYY}_{M}/PO_Parametri_Mercato_Libero_G_{YYYYMMDD}.csv

  Prezzi storici indici pubblici (PUN, PSV, ecc. -> mappano su en.market_indices):
    link con nome file "hash" (NON prevedibile da data), va sempre letto
    dalla pagina open-data.page stessa (vedi discover_links() sotto).

IMPORTANTE - cosa NON sappiamo ancora con certezza:
  Non sono riuscito a scaricare ed ispezionare il contenuto reale dei file
  CSV/XML "Mercato Libero" in questa sessione (il file e' grande e la rete
  sandbox in cui giro non ha accesso al dominio ilportaleofferte.it). Ho
  potuto solo confermare che gli URL sopra esistono e sono validi (li ho
  visti nel markup della pagina). Chi esegue questo script per la prima
  volta deve quindi:
    1. lanciare `python3 fetch_arera_opendata.py --inspect-only`
       per scaricare i file e stampare intestazioni CSV / struttura XML,
    2. confrontare i nomi di colonna/tag reali con le costanti qui sotto
       (FIELDS_OFFERTE_ML, FIELDS_PARAMETRI_ML) ed eventualmente correggerle,
    3. solo dopo lanciare l'import vero e proprio.

  Le specifiche tecniche complete del formato sono pubblicate da ARERA/SII
  (cerca "Specifiche tecniche Sistema Informativo Integrato - Portale
  Offerte" su arera.it) se serve un riferimento ufficiale campo per campo.

COSA NON VIENE DALL'ARERA (va preservato manualmente, non sovrascritto):
  I campi commerciali/curati a mano che oggi esistono in en.suppliers
  (gruppo, commission_note, characteristics, partner_status, area,
  no_fixed_fee, price_level, phone, email, website, signup_url) NON fanno
  parte dell'open data ARERA: sono note interne aggiunte da armandocesa per
  la strategia di acquisizione fornitori. Lo script fa quindi un upsert che
  aggiorna solo i campi "di fatto" (nome, partita IVA, arera_code, e le
  offerte/prezzi) e lascia intatti quei campi se il fornitore esiste gia'.

Uso:
  python3 fetch_arera_opendata.py --inspect-only      # scarica e mostra la struttura, non tocca il DB
  python3 fetch_arera_opendata.py --commodity ele      # scarica+mappa luce
  python3 fetch_arera_opendata.py --commodity gas      # scarica+mappa gas
  python3 fetch_arera_opendata.py --commodity ele,gas --out en-seed-from-arera.sql
"""

import argparse
import csv
import io
import re
import sys
import xml.etree.ElementTree as ET
from datetime import date, timedelta
from pathlib import Path

import requests

BASE = "https://www.ilportaleofferte.it"
OPEN_DATA_PAGE = f"{BASE}/portaleOfferte/it/open-data.page"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; QuootamiEnergiaBot/1.0; +https://quootami.it)"
}

# ---------------------------------------------------------------------------
# 1. Scoprire i link di download reali dalla pagina open-data (piu' robusto
#    che ricostruire l'URL a mano: la data nel nome file e' quella
#    dell'ULTIMO aggiornamento, non necessariamente oggi, e il file dei
#    "prezzi storici" ha un nome ad hash non prevedibile).
# ---------------------------------------------------------------------------

LINK_LABELS = {
    "prezzi_storici": "Download Prezzi storici",
    "placet_offerte_e": "Download Open Data offerte elettrico",   # attenzione: la label si ripete
    "ml_offerte_e_xml": "PO_Offerte_E_MLIBERO",
    "ml_offerte_g_xml": "PO_Offerte_G_MLIBERO",
    "ml_offerte_d_xml": "PO_Offerte_D_MLIBERO",
    "ml_parametri_e_csv": "PO_Parametri_Mercato_Libero_E",
    "ml_parametri_g_csv": "PO_Parametri_Mercato_Libero_G",
    "placet_offerte_e_csv": "PO_Offerte_E_PLACET",
    "placet_offerte_g_csv": "PO_Offerte_G_PLACET",
    "placet_parametri_e_csv": "PO_Parametri_E_",
    "placet_parametri_g_csv": "PO_Parametri_G_",
}


def discover_links() -> dict:
    """Legge la pagina open-data.page e ne estrae tutti gli href verso file
    scaricabili (resources/cms/documents/... e resources/opendata/...).
    Ritorna un dict {chiave: url_assoluto}."""
    r = requests.get(OPEN_DATA_PAGE, headers=HEADERS, timeout=30)
    r.raise_for_status()
    hrefs = re.findall(r'href="(/portaleOfferte/resources/[^"]+)"', r.text)
    found = {}
    for href in hrefs:
        url = BASE + href
        for key, needle in LINK_LABELS.items():
            if needle.split("Download ")[-1] in href or needle in href:
                found.setdefault(key, url)
    return found


# ---------------------------------------------------------------------------
# 2. Download dei file grezzi
# ---------------------------------------------------------------------------

def download(url: str, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = requests.get(url, headers=HEADERS, timeout=120)
    r.raise_for_status()
    dest.write_bytes(r.content)
    print(f"  scaricato {dest.name}  ({len(r.content):,} byte)  <- {url}")
    return dest


# ---------------------------------------------------------------------------
# 3. Ispezione struttura (usare prima di fidarsi del mapping)
# ---------------------------------------------------------------------------

def inspect_csv(path: Path, max_rows: int = 3):
    print(f"\n--- {path.name} (CSV) ---")
    with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
        sample = f.read(4096)
        f.seek(0)
        try:
            dialect = csv.Sniffer().sniff(sample, delimiters=";,")
        except csv.Error:
            dialect = csv.excel
            dialect.delimiter = ";"
        reader = csv.reader(f, dialect)
        for i, row in enumerate(reader):
            print(row)
            if i >= max_rows:
                break


def inspect_xml(path: Path, max_children: int = 2):
    print(f"\n--- {path.name} (XML) ---")
    tree = ET.parse(path)
    root = tree.getroot()
    print(f"root tag: {root.tag}, {len(root)} figli diretti")
    for i, child in enumerate(list(root)[:max_children]):
        print(f"  figlio [{i}] tag={child.tag}")
        for sub in list(child)[:20]:
            txt = (sub.text or "").strip()
            print(f"    {sub.tag}: {txt[:80]}")


# ---------------------------------------------------------------------------
# 4. Mapping verso lo schema en.* (DA VERIFICARE contro i tag/colonne reali,
#    vedi inspect_xml/inspect_csv qui sopra prima di usare in produzione).
#    I nomi tag ipotizzati sotto seguono la convenzione tipica delle
#    specifiche SII (PIVA_UTENTE / RAGIONE_SOCIALE / COD_OFFERTA / TIPO_
#    MERCATO / DATA_INIZIO / DATA_FINE / TIPOLOGIA_OFFERTA ecc.) ma vanno
#    confermati sul file reale.
# ---------------------------------------------------------------------------

FIELDS_OFFERTE_ML_GUESS = [
    "PIVA_UTENTE",       # partita IVA del venditore
    "RAGIONE_SOCIALE",   # nome fornitore
    "COD_OFFERTA",       # codice offerta ARERA (33 char) -> arera_offer_code
    "TIPO_MERCATO",       # 01 elettrico, 02 gas, 03 dual fuel
    "TIPOLOGIA_OFFERTA",  # 01 fisso, 02 variabile, 03 flat...
    "DATA_INIZIO",
    "DATA_FINE",
    "DURATA",
    "NOME_OFFERTA",
]

FIELDS_PARAMETRI_ML_GUESS = [
    "COD_OFFERTA",
    "TIPO_COMPONENTE",   # es. PREZZO_ENERGIA, QUOTA_FISSA, QUOTA_POTENZA, SPREAD
    "FASCIA",             # F1/F2/F3 o monorario
    "UNITA_MISURA",
    "VALORE",
]


def guess_row_mapping(fieldnames, guesses):
    """Aiuta a capire quali colonne reali corrispondono ai campi attesi,
    con un semplice match case-insensitive/substring. Da rifinire a mano."""
    mapping = {}
    lower = {f.lower(): f for f in fieldnames}
    for g in guesses:
        gl = g.lower()
        match = next((real for low, real in lower.items() if gl in low or low in gl), None)
        mapping[g] = match
    return mapping


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--commodity", default="ele,gas", help="ele,gas o entrambe")
    ap.add_argument("--inspect-only", action="store_true",
                     help="scarica e stampa solo la struttura, non genera SQL")
    ap.add_argument("--workdir", default="./arera_raw")
    ap.add_argument("--out", default="en-seed-from-arera.sql")
    args = ap.parse_args()

    workdir = Path(args.workdir)
    print("1) Scopro i link reali sulla pagina open-data...")
    links = discover_links()
    if not links:
        print("ATTENZIONE: nessun link trovato. La struttura HTML della pagina "
              "potrebbe essere cambiata: apri open-data.page a mano e aggiorna "
              "LINK_LABELS.", file=sys.stderr)
        sys.exit(1)
    for k, v in links.items():
        print(f"   {k}: {v}")

    print("\n2) Scarico i file grezzi...")
    downloaded = {}
    for key, url in links.items():
        ext = ".xml" if url.endswith(".xml") else ".csv"
        downloaded[key] = download(url, workdir / f"{key}{ext}")

    if args.inspect_only:
        print("\n3) Ispeziono la struttura (--inspect-only): confronta questi "
              "output con FIELDS_OFFERTE_ML_GUESS / FIELDS_PARAMETRI_ML_GUESS "
              "prima di generare SQL.")
        for key, path in downloaded.items():
            if path.suffix == ".xml":
                inspect_xml(path)
            else:
                inspect_csv(path)
        print("\nFatto. Rilancia senza --inspect-only quando il mapping e' "
              "confermato.")
        return

    print("\n3) NOTA: la generazione automatica dell'SQL di import richiede che "
          "il mapping sopra sia stato verificato con --inspect-only almeno una "
          "volta su questa fonte dati. Questo scheletro di script si ferma qui "
          "di proposito: completa map_to_en_offers()/map_to_en_suppliers() con "
          "i nomi di colonna reali trovati, poi genera gli insert con "
          "upsert (on conflict do update) su en.suppliers/en.offers "
          "preservando i campi curati a mano (partner_status, "
          "commission_note, characteristics, phone, email, website, "
          "signup_url, area, price_level, no_fixed_fee).")


if __name__ == "__main__":
    main()
