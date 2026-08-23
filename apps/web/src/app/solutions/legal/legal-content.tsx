'use client';
import Link from 'next/link';
import { Button } from '@prova/ui';
import { CheckCircle } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Solutions',
    title: 'For Legal Professionals',
    desc: "When AI agents execute transactions, traditional logs are hearsay. Prova's on-chain attestations provide court-admissible, cryptographically sealed evidence.",
    benefits: [
      'Meet FRE 901 standards for court admissibility natively',
      'Defend against agent-liability claims with immutable data',
      'Reduce expert witness reliance in technology disputes',
      'Prove exactly what the model decided and when',
      'Transparent conflict resolution for Machine Payment Protocol',
    ],
    getStarted: 'Read Architecture',
    viewPricing: 'Contact Us'
  },
  ES: {
    tag: 'Soluciones',
    title: 'Para Profesionales Legales',
    desc: 'Cuando los agentes de IA ejecutan transacciones, los logs tradicionales son evidencia de oídas. Las atestaciones on-chain de Prova proveen evidencia admisible en tribunales, sellada criptográficamente.',
    benefits: [
      'Cumple nativamente los estándares FRE 901 para admisibilidad en cortes',
      'Defensa contra demandas de responsabilidad de agentes con datos inmutables',
      'Reduce la dependencia de peritos informáticos en disputas tecnológicas',
      'Demuestra exactamente qué decidió el modelo y cuándo',
      'Resolución de conflictos transparente para el Machine Payment Protocol',
    ],
    getStarted: 'Leer Arquitectura',
    viewPricing: 'Contáctanos'
  },
};

export function LegalContent() {
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
              <Button asChild className="font-mono uppercase tracking-wider"><Link href="/product">{t.getStarted}</Link></Button>
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
