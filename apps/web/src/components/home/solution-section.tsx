'use client';
import { Shield, Lock, CheckCircle2, Network } from 'lucide-react';
import { useI18n } from '../i18n-provider';

const content = {
  EN: {
    sectionTitle: 'The Standard',
    headline: ['Forensic finality', 'for the Machine', 'Economy.'],
    description: 'Prova issues cryptographic behavior attestations via its own purpose-built Anchor program with native Ed25519 verification. You get an enterprise-grade forensic trail designed to satisfy regulators, survive audits, and secure the Agentic Internet.',
    features: [
      {
        icon: Shield,
        title: 'Cryptographically signed by the autonomous agent',
        description: 'Every attestation carries an Ed25519 signature from the agent key. No shared secrets. Zero impersonation risk.',
      },
      {
        icon: Lock,
        title: 'Immutable state finality on Solana',
        description: 'Once anchored to Solana, the receipt cannot be altered, deleted, or backdated. A permanent source of truth.',
      },
      {
        icon: CheckCircle2,
        title: 'Decentralized verification standard',
        description: 'Enterprise counterparties, compliance officers, and legal teams verify any attestation directly on-chain, trustlessly.',
      },
      {
        icon: Network,
        title: 'Native MCP integration for Claude & Cursor',
        description: 'Provide your LLMs with cryptographic context. Ask "what did agent X execute last week?" and ingest verified on-chain evidence directly.',
      },
    ],
    lines: '9 lines',
    footer: 'Sub-second confirmation · MPP compliant · Zero-ops architecture'
  },
  ES: {
    sectionTitle: 'El Estándar',
    headline: ['Finalidad forense', 'para la Economía', 'de Máquinas.'],
    description: 'Prova emite atestaciones de comportamiento criptográficas vía su propio programa Anchor con verificación Ed25519 nativa. Obtienes un rastro forense de grado empresarial diseñado para satisfacer a reguladores, sobrevivir auditorías y asegurar el Internet de Agentes.',
    features: [
      {
        icon: Shield,
        title: 'Firmado criptográficamente por el agente autónomo',
        description: 'Cada atestación lleva una firma Ed25519 de la clave del agente. Sin secretos compartidos. Riesgo de suplantación nulo.',
      },
      {
        icon: Lock,
        title: 'Finalidad de estado inmutable en Solana',
        description: 'Una vez anclado a Solana, el recibo no puede ser alterado, borrado ni fechado con retroactividad. Una fuente de verdad permanente.',
      },
      {
        icon: CheckCircle2,
        title: 'Estándar de verificación descentralizada',
        description: 'Contrapartes empresariales, oficiales de cumplimiento y equipos legales verifican cualquier atestación directamente on-chain.',
      },
      {
        icon: Network,
        title: 'Integración nativa MCP para Claude y Cursor',
        description: 'Provee a tus LLMs con contexto criptográfico. Pregunta "¿qué ejecutó el Agente X la semana pasada?" e ingiere evidencia verificada directamente.',
      },
    ],
    lines: '9 líneas',
    footer: 'Confirmación en sub-segundos · Compatible con MPP · Arquitectura Zero-ops'
  },
};

const CODE = `import { ProvaClient, AttestationBuilder } from 'prova-agent-sdk';

const client = new ProvaClient({ rpcUrl, agentKeypair });

const receipt = await client.attest(
  AttestationBuilder.transaction(txSignature, {
    operation: 'swap',
    amountUsd: 500,
  })
);

console.log('Attested:', receipt.id);
// → att_4Kf9...x2pQ — on-chain event, globally verifiable`;

export function SolutionSection() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="min-w-0">
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.sectionTitle}</p>
            <h2 className="mt-3 font-display text-2xl uppercase leading-none text-foreground sm:text-4xl lg:text-5xl">
              <span className="block">{t.headline[0]}</span>
              <span className="block">{t.headline[1]}</span>
              <span className="inline-block bg-primary px-2 text-primary-foreground">{t.headline[2]}</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.description}
            </p>

            <div className="mt-10 space-y-7 border-t border-border pt-8">
              {t.features.map((f) => (
                <div key={f.title} className="grid grid-cols-[auto_1fr] gap-5">
                  <f.icon className="mt-1 h-4 w-4 text-primary" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-foreground">{f.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">attest.ts</span>
                <span className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.lines}</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-foreground/90">
                <code>{CODE}</code>
              </pre>
            </div>
            <p className="mt-4 font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
              {t.footer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
