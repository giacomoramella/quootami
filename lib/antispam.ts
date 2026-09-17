'use client';

import { useRef, useState } from 'react';

/**
 * Quootami — anti-spam dei moduli pubblici
 * ============================================================
 * Due controlli, entrambi lato client e senza dipendenze esterne:
 *
 * 1. CAMPO TRAPPOLA (honeypot) — un input invisibile alla persona ma
 *    presente nel DOM. Un bot che compila "tutti i campi del form" lo
 *    riempie; chi usa il sito non lo vede nemmeno.
 *
 * 2. TEMPO MINIMO — un modulo con dati anagrafici, documenti e consenso
 *    non si compila in meno di tre secondi. Un invio più rapido non
 *    viene da una persona.
 *
 * Quando scatta uno dei due il modulo *finge* di aver inviato: il bot non
 * riceve un errore da cui capire come aggirare il controllo, e nessun
 * dato parte davvero verso Supabase o Web3Forms.
 *
 * Limite noto: questo protegge il modulo, non la chiave anon di Supabase.
 * Chi la estrae dal bundle può scrivere su `leads` senza passare di qui.
 * Per quello servono le policy lato database (vedi docs/sql/).
 * ============================================================
 */

const TEMPO_MINIMO_MS = 3000;

export function useAntispam() {
  const [trappola, setTrappola] = useState('');
  const apertoAlle = useRef(Date.now());

  /** true se l'invio ha tutta l'aria di essere automatico. */
  function invioSospetto(): boolean {
    if (trappola.trim() !== '') return true;
    return Date.now() - apertoAlle.current < TEMPO_MINIMO_MS;
  }

  return { trappola, setTrappola, invioSospetto };
}
