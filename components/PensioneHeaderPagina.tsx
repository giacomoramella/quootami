/**
 * Header breve condiviso dalle sottopagine previdenza (guida, schema, glossario).
 * La sub-nav (montata dal layout) dà già lo spazio sopra: qui si parte con poco
 * padding-top.
 */
export function PensioneHeaderPagina({ eyebrow, titolo, accent, sottotitolo }: {
  eyebrow: string; titolo: string; accent: string; sottotitolo: string;
}) {
  return (
    <section className="relative overflow-hidden pt-8 pb-4 sm:pt-10 px-5 sm:px-8">
      <div aria-hidden className="blob-yellow top-[-320px] left-[-220px] w-[640px] h-[640px]" />
      <div className="container-content relative text-center">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-4 font-sans font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.06] text-ink">
          {titolo} <span className="hl">{accent}</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-ink-muted max-w-prose-wide mx-auto">
          {sottotitolo}
        </p>
      </div>
    </section>
  );
}
