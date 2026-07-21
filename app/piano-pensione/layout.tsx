import { PensioneSubNav } from '@/components/PensioneSubNav';

/**
 * Layout dell'area previdenza: aggiunge la sub-nav condivisa a tutte le pagine
 * sotto /piano-pensione. Nav e Footer restano nel layout root: qui si aggiunge
 * solo la barra di sezione.
 */
export default function PianoPensioneLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PensioneSubNav />
      {children}
    </>
  );
}
