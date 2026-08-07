#!/usr/bin/env python3
"""Estrae le offerte del mercato libero dall'XML del Portale Offerte e le
mappa sullo schema en.offers. Mapping ricavato dalla struttura reale del file
del 06/08/2026, non dalle ipotesi dello script originale."""
import xml.etree.ElementTree as ET
import json, sys
from collections import Counter

NS = "{http://www.acquirenteunico.it/schemas/SII_AU/OffertaRetail/01}"
def T(t): return t.replace(NS, "")
def g(el, path):
    """Legge un percorso tipo 'DettaglioOfferta/NOME_OFFERTA'."""
    cur = el
    for p in path.split("/"):
        cur = cur.find(NS + p)
        if cur is None: return None
    return (cur.text or "").strip() or None

# Tabelle di codifica ARERA/SII ricavate dai dati e dalla semantica dei campi
TIPO_OFFERTA = {"01": "fixed", "02": "indexed", "03": "flat", "04": "altro"}
TIPO_CLIENTE = {"01": "domestic", "02": "business", "03": "condominio"}
# L'indice NON dipende dal codice IDX_PREZZO_ENERGIA ma dalla commodity:
# verificato sulle 61 offerte in comune col DB, ele→PUN (idx 12, 01) e
# gas→PSV (idx 14, 03, 15) senza eccezioni. Se IDX manca, l'offerta è a
# prezzo fisso e l'indice resta nullo.
UM_KWH, UM_ANNO = "03", "01"
MA_QUOTA_FISSA = "01"
# Il valore €/kWh (spread sull'indice per le indicizzate, prezzo per le fisse)
# non sta sempre nella stessa macroarea: 04 = materia prima, 02 = spread,
# 06 = prezzo componente energia. Verificato che 152 offerte fisse usano solo
# la 06: escluderla lasciava senza prezzo il 60% delle offerte a prezzo fisso.
MA_SPREAD = ("04", "02", "06")

def estrai(path, commodity):
    root = ET.parse(path).getroot()
    out = []
    for o in root:
        cod = g(o, "IdentificativiOfferta/COD_OFFERTA")
        piva = g(o, "IdentificativiOfferta/PIVA_UTENTE")
        tipo_off = g(o, "DettaglioOfferta/TIPO_OFFERTA")
        tipo_cli = g(o, "DettaglioOfferta/TIPO_CLIENTE")
        nome = g(o, "DettaglioOfferta/NOME_OFFERTA")
        durata = g(o, "DettaglioOfferta/DURATA")
        idx = g(o, "RiferimentiPrezzoEnergia/IDX_PREZZO_ENERGIA")

        fisso = TIPO_OFFERTA.get(tipo_off) == "fixed"
        kwh = None; fee = 0.0; prezzi_fascia = {}
        for comp in o.findall(NS + "ComponenteImpresa"):
            macro = (comp.findtext(NS + "MACROAREA") or "").strip()
            for iv in comp.findall(NS + "IntervalloPrezzi"):
                prezzo = iv.findtext(NS + "PREZZO")
                um = (iv.findtext(NS + "UNITA_MISURA") or "").strip()
                fascia = (iv.findtext(NS + "FASCIA_COMPONENTE") or "").strip()
                if prezzo is None: continue
                try: val = float(prezzo)
                except ValueError: continue
                if macro in MA_SPREAD and um == UM_KWH:
                    if kwh is None or fascia in ("", "01"): kwh = val
                    if fascia in ("01", "02", "03"): prezzi_fascia[fascia] = val
                elif macro == MA_QUOTA_FISSA and um == UM_ANNO:
                    fee += val
        # Su un'offerta a prezzo fisso il valore €/kWh è il prezzo, non uno
        # spread sull'indice: lo spread resta nullo. Su un'offerta indicizzata
        # priva di componente €/kWh lo spread è zero, non ignoto: è la
        # convenzione già usata dai dati in `en.offers`.
        spread = None if fisso else (kwh if kwh is not None else 0.0)

        out.append({
            "arera_offer_code": cod,
            "piva": piva,
            "commodity": commodity,
            "customer_type": TIPO_CLIENTE.get(tipo_cli, "domestic"),
            "name": nome,
            "price_type": TIPO_OFFERTA.get(tipo_off, "indexed"),
            "index_name": (None if (fisso or not idx) else ("PUN" if commodity == "ele" else "PSV")),
            "spread_eur": spread,
            # Sulle fisse monorarie il prezzo va replicato su TUTTE le fasce:
            # en.compute_proposals stima f1*0.35 + f2*0.31 + f3*0.34 quando la
            # bolletta non ha fasce, e una fascia nulla renderebbe NULL il
            # costo, facendo fallire l'inserimento della proposta (bug del
            # refresh 06/08, corretto con fix-offerte-fisse-fasce-20260807.sql).
            "price_f0": kwh if (fisso and not prezzi_fascia) else None,
            "price_f1": prezzi_fascia.get("01") if fisso else None,
            "price_f2": (prezzi_fascia.get("02") or prezzi_fascia.get("01")) if fisso else None,
            "price_f3": (prezzi_fascia.get("03") or prezzi_fascia.get("01")) if fisso else None,
            "fixed_fee_year": round(fee, 2),
            "duration_months": int(durata) if durata and durata.lstrip("-").isdigit() else None,
            "validity_start": g(o, "ValiditaOfferta/DATA_INIZIO"),
            "validity_end": g(o, "ValiditaOfferta/DATA_FINE"),
        })
    return out

if __name__ == "__main__":
    base = "/private/tmp/claude-501/-Users-giacomo/b1d0bed8-8d68-4610-bf18-ffd4a18d0042/scratchpad/arera_raw"
    tutte = estrai(f"{base}/ml_offerte_e_xml.xml", "ele") + estrai(f"{base}/ml_offerte_g_xml.xml", "gas")
    print("estratte:", len(tutte))
    print("per commodity:", Counter(t["commodity"] for t in tutte))
    print("per tipo cliente:", Counter(t["customer_type"] for t in tutte))
    print("per tipo prezzo:", Counter(t["price_type"] for t in tutte))
    json.dump(tutte, open("/private/tmp/claude-501/-Users-giacomo/b1d0bed8-8d68-4610-bf18-ffd4a18d0042/scratchpad/offerte_arera.json", "w"), ensure_ascii=False)
