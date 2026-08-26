'use client';

import { Fragment } from 'react';
import { Info } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const TOTAL = 10;

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
      meta: 'M6 Pitch deck + video — due Aug 25, 2026 · M7 Demo Day Aug 31, 2026',
      footnote:
        'Every number in this deck is verified live against theprova.xyz, github.com/Prova-Solana/Prova, and the public npm registry — see landscape/PROVA-DEEP-DIVE.md for the exact source of each figure. Factual content unchanged since the 2026-08-23 correction (site at v0.2.4/v0.2.5, no SAS, no PDAs). Updated 2026-08-26: David Rivas\'s quote (slide 06) is no longer pending — confirmed directly in his repo\'s README, re-verified live before publishing.',
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
        title: 'Target user',
        meta: '10-15 sec',
        body: [
          'Teams building autonomous AI agents on Solana who need to prove what their agent did, when, and under which signature — not just trust their own logs. Two concrete profiles already validate this today: developers integrating agent frameworks like Solana Agent Kit (real case: David Rivas), and AI agent marketplaces that need verifiable traceability behind each agent\'s reputation (real case: wasiai.io).',
          'The technical buyer is whoever builds the agent; the actual beneficiary is whoever needs to trust what that agent did — compliance teams, auditors, or the agent\'s own end user.',
        ],
      },
      {
        n: 5,
        title: 'How Prova uses Solana',
        meta: '10-15 sec',
        body: [
          'Sub-second finality and sub-cent cost per receipt make it viable to seal every action an agent takes, not just the critical ones. On any chain with multi-second finality or high fees, real-time attestation stops being economical.',
          'The integration is native, not a bridge: a purpose-built Anchor program deployed on devnet, native Ed25519 verification by Solana\'s own runtime (no external oracle or verifier), every attestation sealed as an on-chain event, and x402 — the agentic micropayment protocol already live in the Solana ecosystem — for the Explorer\'s pay-per-use queries.',
        ],
      },
      {
        n: 6,
        title: 'Evidence it exists today',
        meta: '30-40 sec — the block that carries the most weight in a technical demo day',
        bullets: [
          '4 packages published, Apache 2.0, verifiable right now on npm: [prova-agent-sdk v0.1.7](https://www.npmjs.com/package/prova-agent-sdk), [prova-agent-kit v0.1.5](https://www.npmjs.com/package/prova-agent-kit) (adapter for [Solana Agent Kit v2](https://github.com/sendaifun/solana-agent-kit) — 1.7k stars, 60+ on-chain actions, Prova instruments it rather than competing with it), [prova-mcp-server v0.1.0](https://www.npmjs.com/package/prova-mcp-server), [prova-plugin-eliza v0.1.2](https://www.npmjs.com/package/prova-plugin-eliza).',
          '[Public repo](https://github.com/Prova-Solana/Prova), actively maintained, [last commit Aug 18, 2026](https://github.com/Prova-Solana/Prova/commits/main).',
          'Ecosystem contribution, not just consumption: [PR #4960 open against otter-sec/anchor](https://github.com/otter-sec/anchor/pull/4960) (the Anchor framework) — a real dependency-bug fix (heck/edition2024) found through our own production use of the library, pending review.',
          'Validated pilot with [wasiai.io](https://wasiai.io) (AI agent marketplace): Fernando (founder) validated the technical fit of the pilot and confirmed he\'ll pick it up when he resumes marketplace development — not a live integration yet.',
          'David Rivas (WayLearn mentor) integrated prova-agent-kit into a real Solana Agent Kit v2 agent running local models, and wrote it directly into his repo\'s README (Aug 24, 2026, in Spanish): "integra el SDK de Prova como servicio de atestación totalmente funcional en la red devnet de Solana" — translation: "integrates Prova\'s SDK as a fully functional attestation service on Solana\'s devnet." Source, re-verified live: [github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md](https://github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md).',
          'Traction in numbers, with an honest label: ~[111,821 attestations and 38 active agents](https://prova-api.fly.dev/api/v1/stats) — self-reported, corroborated by on-chain activity via direct RPC (getSignaturesForAddress against [the devnet program](https://explorer.solana.com/address/G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1?cluster=devnet), bypassing public explorers that block automated fetches). The query confirms real, sustained activity of ~1 tx/minute since before July 2026, consistent with the order of magnitude of the figure — not an exact transaction-by-transaction match. Always presented with this label, never as "verified" without qualification.',
        ],
      },
      {
        n: 7,
        title: 'Business model',
        meta: '10-15 sec',
        body: [
          'Software-only SaaS, zero financial language (no fees/yield/APY): Free $0/mo (100 attestations), Builder $49/mo (10,000), Growth $499/mo (100,000), Enterprise custom (unlimited), plus pay-per-use at $0.01/query via x402 for the Explorer, no account or commitment required — the same agentic payment protocol already live in the Solana ecosystem via agentic.market.',
        ],
      },
      {
        n: 8,
        title: 'MVP progress & next steps',
        meta: '15-20 sec',
        body: [
          'What\'s built and working today: a purpose-built Anchor program with 4 instructions (register, batch attest, revoke, update policy) running on devnet; a dual-mode indexer (WebSocket + catch-up) with self-healing; a REST API with an x402-gated premium tier; a forensic Explorer in production; 4 packages published on npm; and a reference agent (demo-agent) generating real attestations on Devnet 24/7 since before the program.',
          'The program\'s goal wasn\'t reaching mainnet by the close — it was arriving at Demo Day with product, SDKs, and evidence ready to formally present to Solana Foundation afterward. 4 of 5 milestones delivered on time (M1-M4), M5 one day late — M6/M7 is reached with real product running on devnet, not a roadmap promise. Next technical step: the Mainnet migration, conditioned on the first real LOI.',
        ],
      },
      {
        n: 9,
        title: 'Founding team',
        meta: '10 sec',
        bullets: [
          'Giovanny Amador — CEO & Technical Lead.',
          'Monserrat Mendoza — COO & UX/UI.',
          'Both graduated and certified from the Solana Builders Bootcamp.',
        ],
      },
      {
        n: 10,
        title: 'Ask / next step',
        body: [
          'Prova is asking for funding via Solana Foundation Grants to accelerate commercial validation and, eventually, the Mainnet migration — not just a green light, but concrete runway. It fits the product\'s real state: a technical MVP already live on Devnet since before the program, one design partner with real integration evidence (David Rivas) plus one validated pilot with an accepted design partner (wasiai.io), and a decision already made to wait for the first real LOI before moving Mainnet\'s timing — the grant is what sustains that runway while that validation arrives.',
          'Beyond the grant, the concrete next steps are: turning the wasiai.io pilot into a live integration, adding the next design partner beyond Rivas and wasiai, and landing the first LOI from a team running Prova in production — that\'s what ultimately decides Mainnet\'s timing.',
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
        { label: 'Self-issued "JARGUS" badge', text: '— removed completely from the site (Aug 18, 2026), not renamed. Same standard applied below to the SAS/PDA fix.' },
        { label: 'SAS/PDA', text: '— fixed and deployed to production, re-verified live by this session. Full detail in landscape/PROVA-DEEP-DIVE.md.' },
        { label: 'Attestation count', text: '— corroborated (not exactly verified) via direct RPC, correct label already incorporated in slide 05.' },
        { label: 'Rivas\'s repo', text: '— resolved 2026-08-26. He added the line himself to his repo\'s README (commit f25c6cb, Aug 24) — now cited directly in slide 06, re-verified live against the source before publishing.' },
      ],
      closing: 'None of the three invalidates the product — they\'re precision corrections, exactly the kind of check already applied once with the JARGUS badge.',
    },
  },
  ES: {
    cover: {
      eyebrow: 'Pitch draft · Solana Latam Labs / WayLearn',
      title: 'Prova',
      tagline: '"A verifiable record of every AI agent action on Solana."',
      meta: 'M6 Pitch deck + video — entrega 25-ago-2026 · M7 Demo Day 31-ago-2026',
      footnote:
        'Cada número en este deck está verificado en vivo contra theprova.xyz, github.com/Prova-Solana/Prova y el registro público de npm — ver landscape/PROVA-DEEP-DIVE.md para la fuente exacta de cada dato. Contenido factual sin cambios desde la corrección del 2026-08-23 (sitio en v0.2.4/v0.2.5, sin SAS, sin PDAs). Actualizado 2026-08-26: la cita de David Rivas (slide 06) ya no está pendiente — confirmada directamente en el README de su repo, reverificada en vivo antes de publicarla.',
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
        title: 'Usuario objetivo',
        meta: '10-15 seg',
        body: [
          'Equipos que construyen agentes de IA autónomos sobre Solana y necesitan poder probar qué hizo su agente, cuándo y bajo qué firma — no solo confiar en sus propios logs. Hoy ya validan esto dos perfiles concretos: desarrolladores que integran frameworks de agentes como Solana Agent Kit (caso real: David Rivas), y marketplaces de agentes de IA que necesitan trazabilidad verificable detrás de la reputación de cada agente (caso real: wasiai.io).',
          'El comprador técnico es quien construye el agente; el beneficiario real es quien necesita confiar en lo que ese agente hizo — equipos de compliance, auditores, o el propio usuario final del agente.',
        ],
      },
      {
        n: 5,
        title: 'Uso de Solana',
        meta: '10-15 seg',
        body: [
          'Finalidad sub-segundo y costo sub-centavo por recibo hacen viable sellar cada acción de un agente, no solo las críticas. En cualquier cadena con finalidad de varios segundos o costo alto, atestar en tiempo real deja de ser económico.',
          'La integración es nativa, no un puente: programa Anchor propio desplegado en devnet, verificación Ed25519 nativa del propio runtime de Solana (sin oráculo ni verificador externo), cada atestación sellada como evento on-chain, y x402 —el protocolo de micropagos agénticos ya vivo en el ecosistema Solana— para las consultas pay-per-use del Explorer.',
        ],
      },
      {
        n: 6,
        title: 'Evidencia de que existe hoy',
        meta: '30-40 seg — el bloque que más pesa en un demo day técnico',
        bullets: [
          '4 SDKs publicados, Apache 2.0, verificables ahora mismo en npm: [prova-agent-sdk v0.1.7](https://www.npmjs.com/package/prova-agent-sdk), [prova-agent-kit v0.1.5](https://www.npmjs.com/package/prova-agent-kit) (adaptador de [Solana Agent Kit v2](https://github.com/sendaifun/solana-agent-kit) — 1.7k stars, 60+ acciones on-chain, Prova lo instrumenta en vez de competir con él), [prova-mcp-server v0.1.0](https://www.npmjs.com/package/prova-mcp-server), [prova-plugin-eliza v0.1.2](https://www.npmjs.com/package/prova-plugin-eliza).',
          '[Repo público](https://github.com/Prova-Solana/Prova) activo, [último commit 18-ago-2026](https://github.com/Prova-Solana/Prova/commits/main).',
          'Contribución al ecosistema, no solo consumo: [PR #4960 abierto contra otter-sec/anchor](https://github.com/otter-sec/anchor/pull/4960) (el framework Anchor) — fix real de un bug de dependencias (heck/edition2024) encontrado usando la librería en producción, pendiente de revisión.',
          'Piloto validado con [wasiai.io](https://wasiai.io) (marketplace de agentes): Fernando (fundador) validó el encaje técnico del piloto y confirmó que lo retoma cuando reactive el desarrollo del marketplace — todavía no es una integración en vivo.',
          'David Rivas (mentor WayLearn) integró prova-agent-kit en un agente real de Solana Agent Kit v2 con modelos locales, y lo dejó escrito directamente en el README de su repo (24-ago-2026): "integra el SDK de Prova como servicio de atestación totalmente funcional en la red devnet de Solana". Fuente, reverificada en vivo: [github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md](https://github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md).',
          'Tracción en números, con etiqueta honesta: ~[111,821 atestaciones y 38 agentes activos](https://prova-api.fly.dev/api/v1/stats) — autoreportado, corroborado por actividad on-chain vía RPC directo (getSignaturesForAddress contra [el programa en devnet](https://explorer.solana.com/address/G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1?cluster=devnet), sin pasar por exploradores públicos que bloquean fetch automatizado). La query confirma actividad real y sostenida de ~1 tx/minuto desde antes de julio de 2026, consistente con el orden de magnitud de la cifra — no un match exacto verificado transacción por transacción. Presentarla siempre con esta etiqueta, nunca como "verificado" sin más.',
        ],
      },
      {
        n: 7,
        title: 'Modelo de negocio',
        meta: '10-15 seg',
        body: [
          'Software-only SaaS, cero lenguaje financiero (nada de fees/yield/APY): Free $0/mes (100 atestaciones), Builder $49/mes (10,000), Growth $499/mes (100,000), Enterprise a medida (ilimitado), más pay-per-use a $0.01/query vía x402 para el Explorer, sin cuenta ni compromiso — el mismo protocolo de pagos agénticos ya vivo en el ecosistema Solana vía agentic.market.',
        ],
      },
      {
        n: 8,
        title: 'Avance del MVP y próximos pasos',
        meta: '15-20 seg',
        body: [
          'Lo construido y funcionando hoy: programa Anchor propio con 4 instrucciones (registro, atestación en batch, revocación, actualización de policy) corriendo en devnet; indexer dual-mode (WebSocket + catch-up) con auto-sanación; API REST con tier premium vía x402; Explorer forense en producción; 4 SDKs publicados en npm; y un agente de referencia (demo-agent) generando atestaciones reales en Devnet 24/7 desde antes del programa.',
          'El objetivo del programa no fue llegar a mainnet para el cierre, sino llegar al Demo Day con producto, SDKs y evidencia listos para presentarse formalmente a Solana Foundation después. 4 de 5 milestones entregados a tiempo (M1-M4), M5 con un día de retraso — M6/M7 se alcanza con producto real corriendo en devnet, no una promesa de roadmap. Próximo paso técnico: la migración a Mainnet, condicionada a la primera LOI real.',
        ],
      },
      {
        n: 9,
        title: 'Equipo fundador',
        meta: '10 seg',
        bullets: [
          'Giovanny Amador — CEO y Technical Lead.',
          'Monserrat Mendoza — COO y UX/UI.',
          'Ambos egresados y certificados del Solana Builders Bootcamp.',
        ],
      },
      {
        n: 10,
        title: 'Ask / siguiente paso',
        body: [
          'Prova pide financiamiento vía Solana Foundation Grants para acelerar validación comercial y, eventualmente, la migración a Mainnet — no un simple visto bueno, sino runway concreto. Encaja con el estado real del producto: MVP técnico ya vivo en Devnet desde antes del programa, un design partner con evidencia de integración real (David Rivas) más un piloto validado con un design partner que ya aceptó (wasiai.io), y una decisión ya tomada de esperar a la primera LOI real antes de mover el timing de Mainnet — el grant es lo que sostiene ese runway mientras esa validación llega.',
          'Más allá del grant, los próximos pasos concretos son: convertir el piloto con wasiai.io en integración en vivo, sumar el próximo design partner más allá de Rivas y wasiai, y conseguir la primera LOI de un equipo corriendo Prova en producción — eso es lo que termina de decidir el timing de Mainnet.',
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
        { label: 'Badge autoemitido "JARGUS"', text: '— eliminado por completo del sitio (18-ago-2026), no renombrado. Mismo estándar aplicado abajo en el fix de SAS/PDA.' },
        { label: 'SAS/PDA', text: '— corregido y desplegado en producción, reverificado en vivo por esta sesión. Detalle completo en landscape/PROVA-DEEP-DIVE.md.' },
        { label: 'Conteo de atestaciones', text: '— corroborado (no verificado exacto) vía RPC directo, etiqueta correcta ya incorporada en la slide 05.' },
        { label: 'Repo de Rivas', text: '— resuelto 2026-08-26. Él mismo agregó la línea al README de su repo (commit f25c6cb, 24-ago), ahora citada directamente en la slide 06, reverificada en vivo contra la fuente antes de publicarla.' },
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

      {/* Slides 02-10 */}
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
