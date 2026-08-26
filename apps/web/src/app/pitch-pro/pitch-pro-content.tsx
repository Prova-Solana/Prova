'use client';

import { Fragment } from 'react';
import { useI18n } from '@/components/i18n-provider';

const TOTAL = 7;

/** Parses `[label](url)` markdown-style links inside a string into clickable spans. */
function linkify(text: string) {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    nodes.push(
      <a
        key={i++}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {m[1]}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return nodes;
}

const content = {
  EN: {
    cover: {
      eyebrow: 'Pitch · Deck · Prova',
      title: 'Prova',
      tagline: '"A verifiable record of every AI agent action on Solana."',
      footnote:
        'Every number in this deck is verified live against theprova.xyz, github.com/Prova-Solana/Prova, and the public npm registry.',
    },
    slides: [
      {
        n: 2,
        title: 'The problem',
        body: [
          'Autonomous AI agents already execute real actions — payments, trades, API calls, decisions — without leaving a verifiable trail of what happened, when, and under which agent\'s signature. Application logs can be edited. An on-chain receipt cannot.',
        ],
      },
      {
        n: 3,
        title: 'The solution',
        body: [
          'Prova wraps every action an AI agent takes in an immutable cryptographic receipt, sealed on-chain on Solana. Every attestation carries the agent\'s own native Ed25519 signature — it\'s the agent signing its own action, Prova sealing it in a verifiable, permanent way.',
          'Architecture (verified against the public repo, the production site, and the devnet program): a purpose-built, proprietary Anchor program running on devnet (G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1), native Ed25519 verification. Every receipt is anchored as an on-chain event (emit!), not a PDA account — a deliberate design to keep cost low at scale. Indexed via Helius WebSocket → Postgres → REST API → forensic Explorer. Supports up to 100 attestations per batch in a single transaction.',
        ],
      },
      {
        n: 4,
        title: 'Why Solana',
        body: [
          'Sub-second finality and sub-cent cost per receipt make it viable to seal every action an agent takes, not just the critical ones. On any chain with multi-second finality or high fees, real-time attestation stops being economical.',
        ],
      },
      {
        n: 5,
        title: 'Evidence it exists today',
        meta: 'The block that carries the most weight in a technical review',
        bullets: [
          '4 packages published, Apache 2.0, verifiable right now on npm: [prova-agent-sdk v0.1.7](https://www.npmjs.com/package/prova-agent-sdk), [prova-agent-kit v0.1.5](https://www.npmjs.com/package/prova-agent-kit) (adapter for [Solana Agent Kit v2](https://github.com/sendaifun/solana-agent-kit) — 1.7k stars, 60+ on-chain actions, Prova instruments it rather than competing with it), [prova-mcp-server v0.1.0](https://www.npmjs.com/package/prova-mcp-server), [prova-plugin-eliza v0.1.2](https://www.npmjs.com/package/prova-plugin-eliza).',
          '[Public repo](https://github.com/Prova-Solana/Prova), actively maintained, [last commit Aug 26, 2026](https://github.com/Prova-Solana/Prova/commits/main).',
          'Ecosystem contribution, not just consumption: [PR #4960 open against otter-sec/anchor](https://github.com/otter-sec/anchor/pull/4960) (the Anchor framework) — a real dependency-bug fix (heck/edition2024) found through our own production use of the library, pending review.',
          'Validated pilot with [wasiai.io](https://wasiai.io) (AI agent marketplace): Fernando (founder) validated the technical fit of the pilot and confirmed he\'ll pick it up when he resumes marketplace development — not a live integration yet. Technical proposal and dedicated page already live at [theprova.xyz/wasiai](https://www.theprova.xyz/wasiai).',
          'David Rivas (early design partner) integrated prova-agent-kit into a real Solana Agent Kit v2 agent running local models, and wrote it directly into his repo\'s README (Aug 24, 2026, in Spanish): "integra el SDK de Prova como servicio de atestación totalmente funcional en la red devnet de Solana" — translation: "integrates Prova\'s SDK as a fully functional attestation service on Solana\'s devnet." Source, re-verified live: [github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md](https://github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md).',
          'Traction in numbers, with an honest label: ~[117,054 attestations and 38 active agents](https://prova-api.fly.dev/api/v1/stats) — self-reported, corroborated by on-chain activity via direct RPC (getSignaturesForAddress against [the devnet program](https://explorer.solana.com/address/G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1?cluster=devnet), bypassing public explorers that block automated fetches). The query confirms real, sustained activity of ~1 tx/minute since before July 2026, consistent with the order of magnitude of the figure — not an exact transaction-by-transaction match. Always presented with this label, never as "verified" without qualification.',
        ],
      },
      {
        n: 6,
        title: 'Business model',
        body: [
          'Software-only SaaS, zero financial language (no fees/yield/APY): Free $0/mo (100 attestations), Builder $49/mo (10,000), Growth $499/mo (100,000), Enterprise custom (unlimited), plus pay-per-use at $0.01/query via x402 for the Explorer, no account or commitment required — the same agentic payment protocol already live in the Solana ecosystem via agentic.market.',
        ],
      },
      {
        n: 7,
        title: 'Ask / next step',
        body: [
          'Prova is seeking funding via Solana Foundation Grants or other programs across the Solana ecosystem to accelerate commercial validation and, eventually, the Mainnet migration — not just a green light, but concrete runway. It fits the product\'s real state: a technical MVP already live on Devnet, one design partner with real integration evidence (David Rivas) plus one validated pilot with an accepted design partner (wasiai.io), and a decision already made to wait for the first real LOI before moving Mainnet\'s timing — funding is what sustains that runway while that validation arrives.',
        ],
      },
    ],
    appendixLabel: 'Appendix — not part of the spoken pitch',
    transparency: {
      title: 'Transparency note — status of prior corrections',
      intro: 'Everything flagged as pending in earlier drafts of this document was resolved or correctly labeled by 2026-08-23:',
      items: [
        { label: 'SAS/PDA', text: '— fixed and deployed to production, re-verified live.' },
        { label: 'Attestation count', text: '— corroborated (not exactly verified) via direct RPC, correct label already incorporated in slide 05.' },
        { label: 'Design partner repo', text: '— resolved 2026-08-26. He added the line himself to his repo\'s README (commit f25c6cb, Aug 24) — now cited directly in slide 05, re-verified live against the source before publishing.' },
      ],
      closing: 'None of these invalidate the product — they\'re precision corrections, applied before anyone asked.',
    },
  },
  ES: {
    cover: {
      eyebrow: 'Pitch · Deck · Prova',
      title: 'Prova',
      tagline: '"A verifiable record of every AI agent action on Solana."',
      footnote:
        'Cada número en este deck está verificado en vivo contra theprova.xyz, github.com/Prova-Solana/Prova y el registro público de npm.',
    },
    slides: [
      {
        n: 2,
        title: 'El problema',
        body: [
          'Los agentes de IA autónomos ya ejecutan acciones reales — pagos, trades, llamadas a APIs, decisiones — sin dejar un rastro verificable de qué pasó, cuándo, y bajo la firma de qué agente. Los logs de aplicación se pueden editar. Un recibo on-chain no.',
        ],
      },
      {
        n: 3,
        title: 'La solución',
        body: [
          'Prova envuelve cada acción de un agente de IA en un recibo criptográfico inmutable, sellado on-chain en Solana. Cada atestación lleva la firma Ed25519 nativa del propio agente — es el agente firmando su propia acción, Prova sellándola de forma verificable y permanente.',
          'Arquitectura (verificada contra el repo público, el sitio en producción y el programa en devnet): programa Anchor propio, purpose-built, corriendo en devnet (G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1), verificación Ed25519 nativa. Cada recibo se ancla como evento on-chain (emit!), no como cuenta PDA — diseño deliberado para mantener el costo bajo a escala. Indexado vía Helius WebSocket → Postgres → API REST → Explorer forense. Soporta hasta 100 atestaciones por lote en una transacción.',
        ],
      },
      {
        n: 4,
        title: 'Por qué Solana',
        body: [
          'Finalidad sub-segundo y costo sub-centavo por recibo hacen viable sellar cada acción de un agente, no solo las críticas. En cualquier cadena con finalidad de varios segundos o costo alto, atestar en tiempo real deja de ser económico.',
        ],
      },
      {
        n: 5,
        title: 'Evidencia de que existe hoy',
        meta: 'El bloque que más pesa en una revisión técnica',
        bullets: [
          '4 SDKs publicados, Apache 2.0, verificables ahora mismo en npm: [prova-agent-sdk v0.1.7](https://www.npmjs.com/package/prova-agent-sdk), [prova-agent-kit v0.1.5](https://www.npmjs.com/package/prova-agent-kit) (adaptador de [Solana Agent Kit v2](https://github.com/sendaifun/solana-agent-kit) — 1.7k stars, 60+ acciones on-chain, Prova lo instrumenta en vez de competir con él), [prova-mcp-server v0.1.0](https://www.npmjs.com/package/prova-mcp-server), [prova-plugin-eliza v0.1.2](https://www.npmjs.com/package/prova-plugin-eliza).',
          '[Repo público](https://github.com/Prova-Solana/Prova) activo, [último commit 26-ago-2026](https://github.com/Prova-Solana/Prova/commits/main).',
          'Contribución al ecosistema, no solo consumo: [PR #4960 abierto contra otter-sec/anchor](https://github.com/otter-sec/anchor/pull/4960) (el framework Anchor) — fix real de un bug de dependencias (heck/edition2024) encontrado usando la librería en producción, pendiente de revisión.',
          'Piloto validado con [wasiai.io](https://wasiai.io) (marketplace de agentes): Fernando (fundador) validó el encaje técnico del piloto y confirmó que lo retoma cuando reactive el desarrollo del marketplace — todavía no es una integración en vivo. Propuesta técnica y página dedicada ya publicadas en [theprova.xyz/wasiai](https://www.theprova.xyz/wasiai).',
          'David Rivas (design partner temprano) integró prova-agent-kit en un agente real de Solana Agent Kit v2 con modelos locales, y lo dejó escrito directamente en el README de su repo (24-ago-2026): "integra el SDK de Prova como servicio de atestación totalmente funcional en la red devnet de Solana". Fuente, reverificada en vivo: [github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md](https://github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md).',
          'Tracción en números, con etiqueta honesta: ~[117,054 atestaciones y 38 agentes activos](https://prova-api.fly.dev/api/v1/stats) — autoreportado, corroborado por actividad on-chain vía RPC directo (getSignaturesForAddress contra [el programa en devnet](https://explorer.solana.com/address/G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1?cluster=devnet), sin pasar por exploradores públicos que bloquean fetch automatizado). La query confirma actividad real y sostenida de ~1 tx/minuto desde antes de julio de 2026, consistente con el orden de magnitud de la cifra — no un match exacto verificado transacción por transacción. Presentarla siempre con esta etiqueta, nunca como "verificado" sin más.',
        ],
      },
      {
        n: 6,
        title: 'Modelo de negocio',
        body: [
          'Software-only SaaS, cero lenguaje financiero (nada de fees/yield/APY): Free $0/mes (100 atestaciones), Builder $49/mes (10,000), Growth $499/mes (100,000), Enterprise a medida (ilimitado), más pay-per-use a $0.01/query vía x402 para el Explorer, sin cuenta ni compromiso — el mismo protocolo de pagos agénticos ya vivo en el ecosistema Solana vía agentic.market.',
        ],
      },
      {
        n: 7,
        title: 'Ask / siguiente paso',
        body: [
          'Prova busca financiamiento vía Solana Foundation Grants u otros programas del ecosistema Solana para acelerar validación comercial y, eventualmente, la migración a Mainnet — no solo un visto bueno, sino runway concreto. Encaja con el estado real del producto: MVP técnico ya vivo en Devnet, un design partner con evidencia de integración real (David Rivas) más un piloto validado con un design partner que ya aceptó (wasiai.io), y una decisión ya tomada de esperar a la primera LOI real antes de mover el timing de Mainnet — el financiamiento es lo que sostiene ese runway mientras esa validación llega.',
        ],
      },
    ],
    appendixLabel: 'Apéndice — no forma parte del pitch hablado',
    transparency: {
      title: 'Nota de transparencia — estado de las correcciones previas',
      intro: 'Todo lo marcado como pendiente en versiones anteriores de este documento ya se resolvió o etiquetó correctamente hacia el 2026-08-23:',
      items: [
        { label: 'SAS/PDA', text: '— corregido y desplegado en producción, reverificado en vivo.' },
        { label: 'Conteo de atestaciones', text: '— corroborado (no verificado exacto) vía RPC directo, etiqueta correcta ya incorporada en la slide 05.' },
        { label: 'Repo del design partner', text: '— resuelto 2026-08-26. Él mismo agregó la línea al README de su repo (commit f25c6cb, 24-ago), ahora citada directamente en la slide 05, reverificada en vivo contra la fuente antes de publicarla.' },
      ],
      closing: 'Ninguna de estas invalida el producto — son correcciones de precisión, aplicadas antes de que alguien preguntara.',
    },
  },
} as const;

function SlideNumber({ n }: { n: number }) {
  return (
    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
      {String(n).padStart(2, '0')} <span className="text-border">/</span> {String(TOTAL).padStart(2, '0')}
    </p>
  );
}

export function PitchProContent() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div>
      {/* Slide 01 — cover */}
      <section className="flex min-h-screen flex-col justify-center border-b border-border px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <SlideNumber n={1} />
          <p className="mt-6 font-pixel text-[12px] uppercase tracking-wider text-primary">{t.cover.eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-none text-foreground sm:text-6xl lg:text-7xl">
            {t.cover.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{t.cover.tagline}</p>
          <p className="mt-10 max-w-xl text-xs leading-relaxed text-muted-foreground/70">{t.cover.footnote}</p>
        </div>
      </section>

      {/* Slides 02-07 */}
      {t.slides.map((s) => (
        <section
          key={s.n}
          className="flex min-h-screen flex-col justify-center border-b border-border px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-3xl">
            <SlideNumber n={s.n} />
            <h2 className="mt-6 font-display text-3xl uppercase leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {s.title}
            </h2>
            {'meta' in s && s.meta && (
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-primary">{s.meta}</p>
            )}
            {'body' in s && s.body && (
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {'bullets' in s && s.bullets && (
              <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {s.bullets.map((p, i) => (
                  <li key={i}>{linkify(p)}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      {/* Appendix — not part of the numbered deck */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.appendixLabel}</p>

          <div className="mt-8 border border-border bg-surface p-6">
            <p className="font-pixel text-[11px] uppercase tracking-wider text-foreground">{t.transparency.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.transparency.intro}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {t.transparency.items.map((it, i) => (
                <li key={i}>
                  <strong className="text-foreground">{it.label}</strong> {it.text}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.transparency.closing}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
