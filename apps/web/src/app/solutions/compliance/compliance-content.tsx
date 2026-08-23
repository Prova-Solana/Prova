'use client';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { CheckCircle } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Solutions',
    title: 'For Compliance Officers',
    desc: "Autonomous AI agents present unprecedented regulatory risks. Prova helps your compliance teams instantly satisfy EU AI Act transparency requirements and internal controls.",
    benefits: [
      'Instant EU AI Act Article 12 (Record-Keeping) fulfillment',
      'Immutable Machine Payment Protocol (MPP) integration records',
      'Compliant with Solana Foundation Code of Conduct (May 2026)',
      'Export cryptographically-sealed PDF compliance reports',
      'Enforce MetaComp KYA (Know Your Agent) policies programmatically',
    ],
    getStarted: 'Read Documentation',
    viewPricing: 'Contact Sales'
  },
  ES: {
    tag: 'Soluciones',
    title: 'Para Oficiales de Cumplimiento',
    desc: 'Los agentes autónomos de IA presentan riesgos regulatorios sin precedentes. Prova ayuda a tus equipos de cumplimiento a satisfacer instantáneamente los requisitos del EU AI Act y controles internos.',
    benefits: [
      'Cumplimiento instantáneo del Artículo 12 del EU AI Act (Registro)',
      'Registros inmutables de integración con el Machine Payment Protocol (MPP)',
      'Cumple con el Código de Conducta de la Solana Foundation (Mayo 2026)',
      'Exporta reportes de cumplimiento en PDF sellados criptográficamente',
      'Aplica políticas MetaComp KYA (Know Your Agent) programáticamente',
    ],
    getStarted: 'Leer Documentación',
    viewPricing: 'Contactar Ventas'
  },
};

export function ComplianceContent() {
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
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.desc}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div aria-hidden className="hidden lg:block" />
          <div>
            <div className="space-y-3">
              {t.benefits.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">{b}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button asChild className="font-mono uppercase tracking-wider"><Link href="/developers/docs">{t.getStarted}</Link></Button>
              <Button variant="outline" asChild className="font-mono uppercase tracking-wider"><Link href="/contact">{t.viewPricing}</Link></Button>
            </div>
            
            <div className="mt-8 border border-border p-4 text-xs text-muted-foreground">
              <p>
                <strong>Note:</strong> Prova operates in full accordance with the Solana.org Developer Guidelines and the Solana Foundation Code of Conduct updated as of May 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
