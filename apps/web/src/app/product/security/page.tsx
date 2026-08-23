'use client';

import { ShieldCheck } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Security',
    title: 'Security Model',
    desc: 'Prova was designed with STRIDE analysis from day one. Every threat vector has a mitigating control.',
    strideLabel: 'STRIDE',
    auditLabel: 'Audit',
    auditTitle: 'Audit Status',
    auditDesc: 'External security audit by Otter Security / Halborn is planned pre-mainnet. Bug bounty program will launch at mainnet.',
    reportLabel: 'To report a security issue:',
    threats: [
      { t: 'Spoofing', m: 'Ed25519 signature verification on-chain — every attestation must be signed by the agent key.' },
      { t: 'Tampering', m: 'Immutable Solana accounts — no update instruction exists for attestation accounts.' },
      { t: 'Repudiation', m: 'Cryptographic signature linked to agent PDA — agent cannot deny issuance.' },
      { t: 'Information Disclosure', m: 'Privacy mode via Vanish Core opt-in — payload hash is public but content is encrypted.' },
      { t: 'Denial of Service', m: 'Fee-based prioritization — spam is economically bounded by SOL fees.' },
      { t: 'Elevation of Privilege', m: 'Authority checks in every instruction — no admin backdoors in program code.' },
    ],
  },
  ES: {
    tag: 'Seguridad',
    title: 'Modelo de Seguridad',
    desc: 'Prova fue diseñado con análisis STRIDE desde el primer día. Cada vector de amenaza tiene un control de mitigación.',
    strideLabel: 'STRIDE',
    auditLabel: 'Auditoría',
    auditTitle: 'Estado de Auditoría',
    auditDesc: 'Se planea una auditoría de seguridad externa por Otter Security / Halborn antes de mainnet. El programa de bug bounty se lanzará en mainnet.',
    reportLabel: 'Para reportar un problema de seguridad:',
    threats: [
      { t: 'Suplantación (Spoofing)', m: 'Verificación de firma Ed25519 on-chain — cada atestación debe estar firmada por la clave del agente.' },
      { t: 'Manipulación (Tampering)', m: 'Cuentas de Solana inmutables — no existe instrucción de actualización para cuentas de atestación.' },
      { t: 'Repudio', m: 'Firma criptográfica vinculada al PDA del agente — el agente no puede negar la emisión.' },
      { t: 'Divulgación de info', m: 'Modo de privacidad vía Vanish Core — el hash del payload es público pero el contenido está cifrado.' },
      { t: 'Denegación de servicio', m: 'Priorización por tarifas — el spam está limitado económicamente por las comisiones de SOL.' },
      { t: 'Elevación de privilegios', m: 'Verificación de autoridad en cada instrucción — sin puertas traseras de admin en el código del programa.' },
    ],
  },
};

export default function SecurityPage() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
          </div>
          <div>
            <ShieldCheck className="mb-4 h-10 w-10 text-primary" strokeWidth={1.5} />
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.strideLabel}</p>
          </div>
          <div className="space-y-px border border-border">
            {t.threats.map((th) => (
              <div key={th.t} className="border-b border-border bg-surface px-5 py-4 last:border-b-0">
                <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">{th.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{th.m}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.auditLabel}</p>
          </div>
          <div className="border border-border bg-surface p-6">
            <p className="font-display text-base uppercase text-foreground">{t.auditTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t.auditDesc}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {t.reportLabel}{' '}
              <a href="mailto:xvaiosx7@gmail.com" className="font-mono text-primary hover:text-foreground">
                xvaiosx7@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
