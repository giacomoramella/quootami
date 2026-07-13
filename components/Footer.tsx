import Link from 'next/link';
import { OPERATORE, getDisclaimerHTML, getCopyrightText } from '@/config/operatore';
import { CookiePrefsButton } from '@/components/CookieConsent';

export function Footer() {
  const { contatti, collaboratore } = OPERATORE;

  return (
    <footer className="bg-brand-navy text-white/80 rounded-t-[2.5rem] mt-8 relative overflow-hidden">
      {/* Bagliore decorativo */}
      <div
        aria-hidden
        className="absolute top-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-brand-yellow/[0.06] blur-[100px] pointer-events-none"
      />
      <div className="container-content px-5 sm:px-8 md:px-12 lg:px-16 pt-20 pb-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link
              href="/"
              className="font-sans font-bold text-xl text-white tracking-tight inline-flex items-baseline"
            >
              <span className="lowercase">quootami</span>
              <span className="ml-1 w-2 h-2 rounded-full bg-brand-yellow translate-y-[-0.05em]" />
            </Link>
            <p className="mt-4 text-sm text-white/50">Iscritto RUI sez. {collaboratore.rui_sezione}</p>
            <p className="inline-block mt-1 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm tracking-wide">
              n. {collaboratore.rui_numero}
            </p>
            <p className="mt-4 text-sm">
              📞 <a href={`tel:${contatti.telefono_tel}`} className="hover:text-brand-yellow transition-colors">{contatti.telefono_display}</a>
            </p>
            <p className="mt-2 text-sm">
              ✉️ <a href={`mailto:${contatti.email}`} className="hover:text-brand-yellow transition-colors">{contatti.email}</a>
            </p>
          </div>

          {/* Polizze privati */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Privati</h5>
            <ul className="space-y-2.5 list-none">
              <li><Link href="/polizza-auto" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Polizza Auto</Link></li>
              <li><Link href="/polizza-casa" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Polizza Casa</Link></li>
              <li><Link href="/salute" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Salute &amp; Vita</Link></li>
              <li><Link href="/cyber" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Polizza Cyber</Link></li>
              <li><Link href="/polizza-animali" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Polizza Animali</Link></li>
              <li><Link href="/piano-pensione" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Fondo Pensione</Link></li>
            </ul>
          </div>

          {/* Imprese */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Imprese</h5>
            <ul className="space-y-2.5 list-none">
              <li><Link href="/rc" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">RC Professionale</Link></li>
              <li><Link href="/rc#catastrofale" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Catastrofale PMI</Link></li>
              <li><Link href="/cyber" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Cyber Business</Link></li>
            </ul>
          </div>

          {/* Informative */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Informative</h5>
            <ul className="space-y-2.5 list-none">
              <li><Link href="/privacy" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Cookie Policy</Link></li>
              <li><CookiePrefsButton /></li>
              <li><Link href="/trasparenza" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Trasparenza</Link></li>
              <li><Link href="/chi-siamo" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Chi siamo</Link></li>
              <li><Link href="/contatti" className="text-sm text-white/55 hover:text-brand-yellow transition-colors">Contatti</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer legale IVASS */}
        <div
          className="pt-6 pb-4 text-xs text-white/40 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getDisclaimerHTML() }}
        />

        {/* Copyright */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-white/30">{getCopyrightText()}</p>
        </div>
      </div>
    </footer>
  );
}
