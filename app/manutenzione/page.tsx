import { redirect } from 'next/navigation';

/**
 * Residuo della prima versione della pausa, quando la pagina di cortesia era
 * una route React servita per riscrittura.
 *
 * Ora la cortesia la serve `proxy.ts` direttamente, con status 503: una pagina
 * dell'App Router non può scegliere il proprio status HTTP, e il 503 è l'unica
 * parte che conta per non perdere il posizionamento.
 *
 * Il file resta solo per non lasciare in giro un indirizzo orfano: a sito in
 * pausa qui non ci si arriva (il proxy intercetta ogni percorso), a sito aperto
 * `/manutenzione` rimanda alla home invece di mostrare una pagina che
 * annuncerebbe un fermo inesistente. Si può cancellare quando fa comodo:
 *   rm -r app/manutenzione
 */
export default function ManutenzionePage() {
  redirect('/');
}
