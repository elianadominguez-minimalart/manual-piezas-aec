import { RULES } from '../data'

export default function Header() {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto max-w-[1360px] px-4 pt-7 pb-6 sm:px-6">
        <div className="mb-3.5 inline-flex rounded-2xl bg-white px-3 py-1.5">
          <img src="./logo-arcor-en-casa.webp" alt="Arcor en Casa" width="107" height="56" className="block h-14 w-auto" />
        </div>
        <h1 className="mb-1.5 font-display text-[clamp(24px,3.2vw,36px)] leading-tight font-bold text-balance">
          Manual de piezas · <span className="text-brand-yellow">Arcor en Casa</span>
        </h1>
        <p className="max-w-[62ch] text-white/90">
          Elegí qué estás armando y vas a ver solo las piezas que tenés que entregar, separadas por desktop y mobile, y dónde va cada una en el sitio.
        </p>

        <div className="mt-4.5 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px]" aria-label="Reglas para todas las piezas">
          {RULES.short.map(([k, v]) => (
            <div key={k} className="rounded-lg bg-white/12 px-3 py-1.5">
              <b className="mr-1.5 font-semibold text-brand-yellow">{k}</b>
              {v}
            </div>
          ))}
          <details className="basis-full">
            <summary className="w-max cursor-pointer font-medium underline underline-offset-3">Ver todas las reglas</summary>
            <ul className="mt-2 list-disc columns-[280px] gap-x-8 pl-4.5 text-white/90">
              {RULES.all.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </header>
  )
}
