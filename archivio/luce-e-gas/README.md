# Archivio — verticale luce e gas

Il verticale luce e gas è **archiviato dal 07/09/2026**: online il sito espone
solo **assicurazioni e previdenza**. Il codice non è stato cancellato, perché il
verticale verrà ripreso più avanti.

## Cosa c'è qui

| File | Posizione originale |
|---|---|
| `app-luce/page.tsx` | `app/luce/page.tsx` — rotta `/luce` |
| `components/ComparatoreLuce.tsx` | comparatore offerte (Supabase + edge function `en-lead`) |
| `components/LuceGuida.tsx` | sezione redazionale della pagina |

La cartella `archivio/` è esclusa in `tsconfig.json`: i file non vengono
type-checkati né inclusi nel build, quindi non finiscono online in nessuna forma.

Restano invece al loro posto, perché non sono raggiungibili dal sito:

- `supabase/functions/en-bill-extract` e `supabase/functions/en-lead`
- `docs/ATTIVAZIONE-LUCE.md`, `docs/TARGET-FORNITORI-FASE1.md`,
  `docs/PROSSIMI-PASSI-PARTNERSHIP-FORNITORI.md`, `docs/EN-MIGRATION.md`

## Come riattivare il verticale

1. `git mv archivio/luce-e-gas/app-luce/page.tsx app/luce/page.tsx`
2. `git mv archivio/luce-e-gas/components/*.tsx components/`
3. In `next.config.js`: togliere il redirect `/luce → /` e ripuntare
   `/luce.html` su `/luce`.
4. In `app/page.tsx`: rimettere la card energia — servono l'accento `navy` in
   `AreaCard` e l'icona `BoltIcon`, rimossi nel commit di archiviazione e
   recuperabili con `git show`.
5. In `app/page.tsx`, blocco «Non solo assicurazioni»: rimettere il richiamo
   alle forniture di luce e gas.
6. In `app/privacy/page.tsx`: rimettere la voce sul comparatore (dati di
   consumo + bolletta), la base giuridica del confronto tariffe e **Anthropic**
   fra i responsabili esterni e nei trasferimenti extra-UE.
7. Rimettere `/luce` in `app/sitemap.ts`, in `Nav.tsx` e in
   `app/mappa-sito/page.tsx`.
8. Rimettere la categoria `casa-energia` in `config/guide.ts`.
9. Togliere `"archivio"` da `exclude` in `tsconfig.json`.
