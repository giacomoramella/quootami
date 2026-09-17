'use client';

/**
 * Campo trappola (honeypot) — invisibile a chi usa il sito.
 *
 * Non si usa `display:none` né `hidden`: i bot più accorti saltano i campi
 * nascosti così. Lo si sposta fuori dallo schermo, lo si toglie dal giro
 * del tab e lo si nasconde agli screen reader, che è il modo corretto di
 * renderlo invisibile senza renderlo evidente.
 */
export function CampoTrappola({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-9999px',
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      <label htmlFor={id}>Lascia questo campo vuoto</label>
      <input
        id={id}
        name={id}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
