'use client';

import { Fragment } from 'react';
import { Info } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const TOTAL = 9;

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
      eyebrow: 'Pitch draft · Solana Latam Labs / WayLearn',
      title: 'Prova',
      tagline: '"A verifiable record of every AI agent action on Solana."',
      meta: 'M6 Pitch Aug 28, 2026 · M7 Demo Day Aug 31, 2026',
      footnote:
        'Every number in this deck is verified live against theprova.xyz, github.com/Prova-Solana/Prova, and the public npm registry — see landscape/PROVA-DEEP-DIVE.md for the exact source of each figure. Factual content unchanged since the 2026-08-23 correction (site at v0.2.4/v0.2.5, no SAS, no PDAs). Complete save for one item: David Rivas\'s quote (see slide 05), pending his reply to a Discord DM sent 2026-08-23.',
    },
    slides: [
      {
        n: 2,
        title: 'The problem',
        meta: '10-15 sec',
        body: [
          'Autonomous AI agents already execute real actions — payments, trades, API calls, decisions — without leaving a verifiable trail of what happened, when, and under which agent\'s signature. Application logs can be edited. An on-chain receipt cannot.',
        ],
      },
      {
        n: 3,
        title: 'The solution',
        meta: '20-30 sec',
        body: [
          'Prova wraps every action an AI agent takes in an immutable cryptographic receipt, sealed on-chain on Solana. Every attestation carries the agent\'s own native Ed25519 signature — it\'s the agent signing its own action, Prova sealing it in a verifiable, permanent way.',
          'Architecture (verified against the public repo, the production site, and the devnet program): a purpose-built, proprietary Anchor program running on devnet (G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1), native Ed25519 verification. Every receipt is anchored as an on-chain event (emit!), not a PDA account — a deliberate design to keep cost low at scale. Indexed via Helius WebSocket → Postgres → REST API → forensic Explorer. Supports up to 100 attestations per batch in a single transaction.',
        ],
      },
      {
        n: 4,
        title: 'Why Solana',
        meta: '10 sec',
        body: [
          'Sub-second finality and sub-cent cost per receipt make it viable to seal every action an agent takes, not just the critical ones. On any chain with multi-second finality or high fees, real-time attestation stops being economical.',
        ],
      },
      {
        n: 5,
        title: 'Evidence it exists today',
        meta: '30-40 sec — the block that carries the most weight in a technical demo day',
        bullets: [
          '4 packages published, Apache 2.0, verifiable right now on npm: [prova-agent-sdk v0.1.7](https://www.npmjs.com/package/prova-agent-sdk), [prova-agent-kit v0.1.5](https://www.npmjs.com/package/prova-agent-kit) (adapter for [Solana Agent Kit v2](https://github.com/sendaifun/solana-agent-kit) — 1.7k stars, 60+ on-chain actions, Prova instruments it rather than competing with it), [prova-mcp-server v0.1.0](https://www.npmjs.com/package/prova-mcp-server), [prova-plugin-eliza v0.1.2](https://www.npmjs.com/package/prova-plugin-eliza).',
          '[Public repo](https://github.com/Prova-Solana/Prova), actively maintained, [last commit Aug 18, 2026](https://github.com/Prova-Solana/Prova/commits/main).',
          'Real, production integration with [wasiai.io](https://wasiai.io) (AI agent marketplace): "wasiai proves who an agent is and how good it is. Prova proves what it actually did — action by action, tamper-proof."',
        ],
        pendingQuote: true,
        pendingTitle: '⏳ Pending — David Rivas\'s quote',
        pendingBody:
          'Reserved space for David Rivas\'s direct quote (WayLearn mentor, integrated prova-agent-kit into a real Solana Agent Kit v2 agent running local models — repo [github.com/DvdRivas/Solana-Agent-wProva](https://github.com/DvdRivas/Solana-Agent-wProva)). Requested via Discord DM on 2026-08-23; inserted here verbatim once it arrives, no paraphrasing.',
        afterPending: [
          'Traction in numbers, with an honest label: ~[111,821 attestations and 38 active agents](https://prova-api.fly.dev/api/v1/stats) — self-reported, corroborated by on-chain activity via direct RPC (getSignaturesForAddress against [the devnet program](https://explorer.solana.com/address/G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1?cluster=devnet), bypassing public explorers that block automated fetches). The query confirms real, sustained activity of ~1 tx/minute since before July 2026, consistent with the order of magnitude of the figure — not an exact transaction-by-transaction match. Always presented with this label, never as "verified" without qualification.',
        ],
      },
      {
        n: 6,
        title: 'Business model',
        meta: '10-15 sec',
        body: [
          'Software-only SaaS, zero financial language (no fees/yield/APY): Free $0/mo (100 attestations), Builder $49/mo (10,000), Growth $499/mo (100,000), Enterprise custom (unlimited), plus pay-per-use at $0.01/query via x402 for the Explorer, no account or commitment required — the same agentic payment protocol already live in the Solana ecosystem via agentic.market.',
        ],
      },
      {
        n: 7,
        title: 'Integrity as practice, not as talk',
        meta: '10 sec',
        body: [
          'Two public corrections already applied before this pitch, not after someone questioned them: complete removal of a self-issued audit badge ("JARGUS", Aug 18, 2026) and correction of inaccurate technical copy on the site (SAS → own Anchor program; PDA → on-chain event; fixed and deployed Aug 23, 2026, pnpm ship, public changelog v0.2.4/v0.2.5).',
        ],
      },
      {
        n: 8,
        title: 'Path to Solana Foundation',
        meta: '10-15 sec',
        body: [
          'The program\'s goal isn\'t mainnet by the close — it\'s arriving at Demo Day with product, SDKs, and evidence ready to formally present to Solana Foundation afterward. 4 of 5 milestones delivered on time (M1-M4), M5 one day late — M6/M7 is reached with real product running on devnet, not a roadmap promise.',
        ],
      },
      {
        n: 9,
        title: 'Ask / next step',
        body: [
          'Prova is asking for funding via Solana Foundation Grants to accelerate commercial validation and, eventually, the Mainnet migration — not just a green light, but concrete runway. It fits the product\'s real state: a technical MVP already live on Devnet since before the program, 2 design partners with real integration evidence, and a decision already made to wait for the first real LOI before moving Mainnet\'s timing — the grant is what sustains that runway while that validation arrives.',
        ],
      },
    ],
    appendixLabel: 'Appendix — not part of the spoken pitch',
    research: {
      title: 'Format research note — read before using this structure',
      intro:
        'Live search, 2026-08-23, for an official template or evaluation criteria for this specific program\'s closing pitch, or its two closest references:',
      items: [
        'WayLearn / Solana Latam Labs: no public material found — no site, no template, no indexed evaluation criteria. Consistent with being a small/regional cohort program without a strong public web presence — not evidence that one doesn\'t exist, only that there\'s nothing to cite as an official source.',
        'Solana Foundation (solana.org/grants-funding, reviewed live): covers grant types and grant evaluation criteria ("Public Good", "Open Source"), but contains no pitch or demo day guidance.',
        'Colosseum (colosseum.com/copilot and colosseum.com/accelerator, reviewed live): the accelerator confirms program format (8 weeks, 2 in San Francisco, $250K investment) and mentions "Demo Day presentations" as part of the program, but doesn\'t publish structure, time limit, or judging criteria.',
      ],
      conclusion:
        'Conclusion: none of the three publishes a specific template. What does appear consistently in general research on Solana demo days (Solana Incubator, previous cohorts) is a typical time limit of 2 to 4 minutes per pitch, and the standard problem → solution → traction evidence → model → ask structure, which is also the generic pattern for any accelerator demo day (not Solana-specific). This is used above explicitly marked as a general format inference, not a confirmed requirement of WayLearn/Solana Latam Labs, Solana Foundation, or Colosseum. If the program does have its own template that isn\'t indexed (for example, shared only within the cohort), replace this structure with that one as soon as it\'s obtained — don\'t assume the one above is correct by default.',
    },
    transparency: {
      title: 'Transparency note — status of prior corrections',
      intro: 'Everything flagged as pending in earlier drafts of this document was resolved or correctly labeled by 2026-08-23:',
      items: [
        { label: 'SAS/PDA', text: '— fixed and deployed to production, re-verified live by this session. Full detail in landscape/PROVA-DEEP-DIVE.md.' },
        { label: 'Attestation count', text: '— corroborated (not exactly verified) via direct RPC, correct label already incorporated in slide 05.' },
        { label: 'Rivas\'s repo', text: '— integration confirmed genuine via gh api, still not citable on its own without a README line or written quote from David. Already requested directly (Discord DM, 2026-08-23), one of the two options — pending his reply, doesn\'t depend on any session in this portfolio to resolve.' },
      ],
      closing: 'None of the three invalidates the product — they\'re precision corrections, exactly the kind of check already applied once with the JARGUS badge.',
    },
  },
  ES: {
    cover: {
      eyebrow: 'Pitch draft · Solana Latam Labs / WayLearn',
      title: 'Prova',
      tagline: '"A verifiable record of every AI agent action on Solana."',
      meta: 'M6 Pitch 28-ago-2026 · M7 Demo Day 31-ago-2026',
      footnote:
        'Cada número en este deck está verificado en vivo contra theprova.xyz, github.com/Prova-Solana/Prova y el registro público de npm — ver landscape/PROVA-DEEP-DIVE.md para la fuente exacta de cada dato. Contenido factual sin cambios desde la corrección del 2026-08-23 (sitio en v0.2.4/v0.2.5, sin SAS, sin PDAs). Completo salvo un solo punto: la cita de David Rivas (ver slide 05), pendiente de su respuesta a Discord DM del 2026-08-23.',
    },
    slides: [
      {
        n: 2,
        title: 'El problema',
        meta: '10-15 seg',
        body: [
          'Los agentes de IA autónomos ya ejecutan acciones reales — pagos, trades, llamadas a APIs, decisiones — sin dejar un rastro verificable de qué pasó, cuándo, y bajo la firma de qué agente. Los logs de aplicación se pueden editar. Un recibo on-chain no.',
        ],
      },
      {
        n: 3,
        title: 'La solución',
        meta: '20-30 seg',
        body: [
          'Prova envuelve cada acción de un agente de IA en un recibo criptográfico inmutable, sellado on-chain en Solana. Cada atestación lleva la firma Ed25519 nativa del propio agente — es el agente firmando su propia acción, Prova sellándola de forma verificable y permanente.',
          'Arquitectura (verificada contra el repo público, el sitio en producción y el programa en devnet): programa Anchor propio, purpose-built, corriendo en devnet (G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1), verificación Ed25519 nativa. Cada recibo se ancla como evento on-chain (emit!), no como cuenta PDA — diseño deliberado para mantener el costo bajo a escala. Indexado vía Helius WebSocket → Postgres → API REST → Explorer forense. Soporta hasta 100 atestaciones por lote en una transacción.',
        ],
      },
      {
        n: 4,
        title: 'Por qué Solana',
        meta: '10 seg',
        body: [
          'Finalidad sub-segundo y costo sub-centavo por recibo hacen viable sellar cada acción de un agente, no solo las críticas. En cualquier cadena con finalidad de varios segundos o costo alto, atestar en tiempo real deja de ser económico.',
        ],
      },
      {
        n: 5,
        title: 'Evidencia de que existe hoy',
        meta: '30-40 seg — el bloque que más pesa en un demo day técnico',
        bullets: [
          '4 SDKs publicados, Apache 2.0, verificables ahora mismo en npm: [prova-agent-sdk v0.1.7](https://www.npmjs.com/package/prova-agent-sdk), [prova-agent-kit v0.1.5](https://www.npmjs.com/package/prova-agent-kit) (adaptador de [Solana Agent Kit v2](https://github.com/sendaifun/solana-agent-kit) — 1.7k stars, 60+ acciones on-chain, Prova lo instrumenta en vez de competir con él), [prova-mcp-server v0.1.0](https://www.npmjs.com/package/prova-mcp-server), [prova-plugin-eliza v0.1.2](https://www.npmjs.com/package/prova-plugin-eliza).',
          '[Repo público](https://github.com/Prova-Solana/Prova) activo, [último commit 18-ago-2026](https://github.com/Prova-Solana/Prova/commits/main).',
          'Integración real y en producción con [wasiai.io](https://wasiai.io) (marketplace de agentes): "wasiai proves who an agent is and how good it is. Prova proves what it actually did — action by action, tamper-proof."',
        ],
        pendingQuote: true,
        pendingTitle: '⏳ Pendiente — cita de David Rivas',
        pendingBody:
          'Espacio reservado para la cita directa de David Rivas (mentor WayLearn, integró prova-agent-kit en un agente real de Solana Agent Kit v2 con modelos locales — repo [github.com/DvdRivas/Solana-Agent-wProva](https://github.com/DvdRivas/Solana-Agent-wProva)). Pedida por Discord DM el 2026-08-23; se inserta aquí tal cual llegue, sin parafrasear.',
        afterPending: [
          'Tracción en números, con etiqueta honesta: ~[111,821 atestaciones y 38 agentes activos](https://prova-api.fly.dev/api/v1/stats) — autoreportado, corroborado por actividad on-chain vía RPC directo (getSignaturesForAddress contra [el programa en devnet](https://explorer.solana.com/address/G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1?cluster=devnet), sin pasar por exploradores públicos que bloquean fetch automatizado). La query confirma actividad real y sostenida de ~1 tx/minuto desde antes de julio de 2026, consistente con el orden de magnitud de la cifra — no un match exacto verificado transacción por transacción. Presentarla siempre con esta etiqueta, nunca como "verificado" sin más.',
        ],
      },
      {
        n: 6,
        title: 'Modelo de negocio',
        meta: '10-15 seg',
        body: [
          'Software-only SaaS, cero lenguaje financiero (nada de fees/yield/APY): Free $0/mes (100 atestaciones), Builder $49/mes (10,000), Growth $499/mes (100,000), Enterprise a medida (ilimitado), más pay-per-use a $0.01/query vía x402 para el Explorer, sin cuenta ni compromiso — el mismo protocolo de pagos agénticos ya vivo en el ecosistema Solana vía agentic.market.',
        ],
      },
      {
        n: 7,
        title: 'Integridad como práctica, no como discurso',
        meta: '10 seg',
        body: [
          'Dos correcciones públicas ya aplicadas antes de este pitch, no después de que alguien las cuestionara: remoción completa de un badge de auditoría autoemitido ("JARGUS", 18-ago-2026) y corrección de descripción técnica imprecisa en el sitio (SAS → programa Anchor propio; PDA → evento on-chain; corregido y desplegado 23-ago-2026, pnpm ship, changelog público v0.2.4/v0.2.5).',
        ],
      },
      {
        n: 8,
        title: 'Camino a Solana Foundation',
        meta: '10-15 seg',
        body: [
          'El objetivo del programa no es mainnet para el cierre — es llegar al Demo Day con producto, SDKs y evidencia listos para presentarse formalmente a Solana Foundation después. 4 de 5 milestones entregados a tiempo (M1-M4), M5 con un día de retraso — se llega a M6/M7 con producto real corriendo en devnet, no una promesa de roadmap.',
        ],
      },
      {
        n: 9,
        title: 'Ask / siguiente paso',
        body: [
          'Prova pide financiamiento vía Solana Foundation Grants para acelerar validación comercial y, eventualmente, la migración a Mainnet — no un simple visto bueno, sino runway concreto. Encaja con el estado real del producto: MVP técnico ya vivo en Devnet desde antes del programa, 2 design partners con evidencia de integración real, y una decisión ya tomada de esperar a la primera LOI real antes de mover el timing de Mainnet — el grant es lo que sostiene ese runway mientras esa validación llega.',
        ],
      },
    ],
    appendixLabel: 'Apéndice — no forma parte del pitch hablado',
    research: {
      title: 'Nota de investigación sobre el formato — leer antes de usar esta estructura',
      intro:
        'Búsqueda en vivo, 2026-08-23, de un template o criterio de evaluación oficial para el pitch de cierre de este programa específico o de sus dos referentes más cercanos:',
      items: [
        'WayLearn / Solana Latam Labs: no se encontró ningún material público — ni sitio, ni template, ni criterio de evaluación indexado. Consistente con ser un programa de cohorte pequeña/regional sin presencia web pública fuerte — no es evidencia de que no exista, solo de que no hay nada que citar como fuente oficial.',
        'Solana Foundation (solana.org/grants-funding, revisado en vivo): cubre tipos de grant y criterio de evaluación de grants ("Public Good", "Open Source"), pero no contiene ninguna guía de pitch o demo day.',
        'Colosseum (colosseum.com/copilot y colosseum.com/accelerator, revisados en vivo): el accelerator confirma formato de programa (8 semanas, 2 en San Francisco, $250K de inversión) y menciona "Demo Day presentations" como parte del programa, pero sin publicar estructura, límite de tiempo, ni criterio de jueces.',
      ],
      conclusion:
        'Conclusión: ninguno de los tres publica un template específico. Lo que sí aparece de forma consistente en búsqueda general sobre demo days de Solana (Solana Incubator, cohortes previas) es un límite de tiempo típico de 2 a 4 minutos por pitch, y la estructura estándar de problema → solución → evidencia de tracción → modelo → ask, que también es el patrón genérico de cualquier demo day de aceleradora (no específico de Solana). Esto se usa arriba marcado explícitamente como inferencia de formato general, no como requisito confirmado de WayLearn/Solana Latam Labs, Solana Foundation, ni Colosseum. Si el programa sí tiene un template propio que no está indexado (por ejemplo, compartido solo dentro del cohort), reemplazar esta estructura por ese en cuanto se consiga, no asumir que la de arriba es la correcta por default.',
    },
    transparency: {
      title: 'Nota de transparencia — estado de las correcciones previas',
      intro: 'Todo lo marcado como pendiente en versiones anteriores de este borrador ya se resolvió o etiquetó correctamente hacia el 2026-08-23:',
      items: [
        { label: 'SAS/PDA', text: '— corregido y desplegado en producción, reverificado en vivo por esta sesión. Detalle completo en landscape/PROVA-DEEP-DIVE.md.' },
        { label: 'Conteo de atestaciones', text: '— corroborado (no verificado exacto) vía RPC directo, etiqueta correcta ya incorporada en la slide 05.' },
        { label: 'Repo de Rivas', text: '— integración confirmada genuina vía gh api, sigue sin ser citable por sí solo sin una línea de README o cita escrita de David. Ya se le pidió directo (Discord DM, 2026-08-23) una de las dos opciones — pendiente de su respuesta, no depende de ninguna sesión de este portafolio resolverlo.' },
      ],
      closing: 'Ninguna de las tres invalida el producto — son correcciones de precisión, exactamente el tipo de chequeo que ya se aplicó una vez con el badge JARGUS.',
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

export function PitchContent() {
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
          <p className="mt-10 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t.cover.meta}</p>
          <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted-foreground/70">{t.cover.footnote}</p>
        </div>
      </section>

      {/* Slides 02-09 */}
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
            {'pendingQuote' in s && s.pendingQuote && (
              <div className="mt-6 border border-dashed border-muted-foreground/40 bg-muted/5 p-5">
                <p className="font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">{s.pendingTitle}</p>
                <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground/70">{linkify(s.pendingBody)}</p>
              </div>
            )}
            {'afterPending' in s && s.afterPending && (
              <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {s.afterPending.map((p, i) => (
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

          <div className="mt-6 flex gap-3 border border-primary/40 bg-primary/5 p-4 text-primary">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-medium">{t.research.title}</p>
              <p className="mt-2">{t.research.intro}</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {t.research.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
              <p className="mt-2">{t.research.conclusion}</p>
            </div>
          </div>

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
