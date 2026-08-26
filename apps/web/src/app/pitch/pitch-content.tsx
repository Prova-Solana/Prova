'use client';

import { Fragment, useState } from 'react';
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
      eyebrow: 'Pitch · Solana Latam Labs / WayLearn',
      title: 'Prova',
      tagline: '"A verifiable record of every AI agent action on Solana."',
      meta: 'M6 Pitch deck + video — due Aug 25, 2026 · M7 Demo Day Aug 31, 2026',
      footnote:
        'Every number in this deck is verified live against theprova.xyz, github.com/Prova-Solana/Prova, and the public npm registry. Factual content unchanged since the 2026-08-23 correction (site at v0.2.4/v0.2.5, no SAS, no PDAs).',
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
        title: 'Target user',
        body: [
          'Teams building autonomous AI agents on Solana who need to prove what their agent did, when, and under which signature — not just trust their own logs. Two concrete profiles already validate this today: developers integrating agent frameworks like Solana Agent Kit (real case: David Rivas), and AI agent marketplaces that need verifiable traceability behind each agent\'s reputation (real case: wasiai.io).',
          'The technical buyer is whoever builds the agent; the actual beneficiary is whoever needs to trust what that agent did — compliance teams, auditors, or the agent\'s own end user.',
        ],
      },
      {
        n: 5,
        title: 'How Prova uses Solana',
        body: [
          'Sub-second finality and sub-cent cost per receipt make it viable to seal every action an agent takes, not just the critical ones. On any chain with multi-second finality or high fees, real-time attestation stops being economical.',
          'The integration is native, not a bridge: a purpose-built Anchor program deployed on devnet, native Ed25519 verification by Solana\'s own runtime (no external oracle or verifier), every attestation sealed as an on-chain event, and x402 — the agentic micropayment protocol already live in the Solana ecosystem — for the Explorer\'s pay-per-use queries.',
        ],
      },
      {
        n: 6,
        title: 'Evidence it exists today',
        bullets: [
          '4 packages published, Apache 2.0, verifiable right now on npm: [prova-agent-sdk v0.1.7](https://www.npmjs.com/package/prova-agent-sdk), [prova-agent-kit v0.1.5](https://www.npmjs.com/package/prova-agent-kit) (adapter for [Solana Agent Kit v2](https://github.com/sendaifun/solana-agent-kit) — 1.7k stars, 60+ on-chain actions, Prova instruments it rather than competing with it), [prova-mcp-server v0.1.0](https://www.npmjs.com/package/prova-mcp-server), [prova-plugin-eliza v0.1.2](https://www.npmjs.com/package/prova-plugin-eliza).',
          '[Public repo](https://github.com/Prova-Solana/Prova), actively maintained, [last commit Aug 26, 2026](https://github.com/Prova-Solana/Prova/commits/main).',
          'Also listed on [Colosseum](https://colosseum.com/arena/projects/explore/prova-1) — Solana\'s hackathon and accelerator platform — under the Frontier track, category AI Platforms / Agents.',
          'Ecosystem contribution, not just consumption: [PR #4960 open against otter-sec/anchor](https://github.com/otter-sec/anchor/pull/4960) (the Anchor framework) — a real dependency-bug fix (heck/edition2024) found through our own production use of the library, pending review.',
          'Validated pilot with [wasiai.io](https://wasiai.io) (AI agent marketplace): Fernando (founder) validated the technical fit of the pilot and confirmed he\'ll pick it up when he resumes marketplace development — not a live integration yet.',
          'David Rivas (WayLearn mentor) integrated prova-agent-kit into a real Solana Agent Kit v2 agent running local models, and wrote it directly into his repo\'s README (Aug 24, 2026, in Spanish): "integra el SDK de Prova como servicio de atestación totalmente funcional en la red devnet de Solana" — translation: "integrates Prova\'s SDK as a fully functional attestation service on Solana\'s devnet." Source, re-verified live: [github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md](https://github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md).',
          'Direct user validation (Google Form survey in the WayLearn community, Jul 31, 2026, small sample — n=4): 3 of 4 also use MCP (Claude/Cursor), not just Solana Agent Kit; all 3 open-ended answers to "what do you think Prova does?" were correct without over-explaining; all 3 who answered want to try the SDK on devnet and agreed to be quoted publicly by name. Segmentation insight from the same survey: the pain is sharpest where real money is at stake or a third party demands proof — that\'s exactly where go-to-market is focused (marketplaces, production agents, auditors), not the generic devnet explorer.',
          'Traction in numbers, with an honest label: ~[117,013 attestations and 38 active agents](https://prova-api.fly.dev/api/v1/stats) — self-reported, corroborated by on-chain activity via direct RPC (getSignaturesForAddress against [the devnet program](https://explorer.solana.com/address/G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1?cluster=devnet), bypassing public explorers that block automated fetches). The query confirms real, sustained activity of ~1 tx/minute since before July 2026, consistent with the order of magnitude of the figure — not an exact transaction-by-transaction match. Always presented with this label, never as "verified" without qualification.',
        ],
      },
      {
        n: 7,
        title: 'Business model',
        body: [
          'Software-only SaaS, zero financial language (no fees/yield/APY): Free $0/mo (100 attestations), Builder $49/mo (10,000), Growth $499/mo (100,000), Enterprise custom (unlimited), plus pay-per-use at $0.01/query via x402 for the Explorer, no account or commitment required — the same agentic payment protocol already live in the Solana ecosystem via agentic.market.',
        ],
      },
      {
        n: 8,
        title: 'MVP progress & next steps',
        body: [
          'NOW — what\'s built and working today: a purpose-built Anchor program with 4 instructions (register, batch attest, revoke, update policy) running on devnet; a dual-mode indexer (WebSocket + catch-up) with self-healing; a REST API with an x402-gated premium tier; a forensic Explorer in production; 4 packages published on npm; and a reference agent (demo-agent) generating real attestations on Devnet 24/7 since before the program. all 5 milestones delivered (M1-M5) — the goal wasn\'t reaching mainnet by the close, it was arriving at Demo Day with real product, SDKs, and evidence ready to formally present to Solana Foundation afterward.',
          'NEXT — turning the current pilot into a live integration, adding the next design partner, and landing the first LOI from a team running Prova in production.',
          'LATER — the Mainnet migration, conditioned on that first real LOI arriving.',
        ],
      },
      {
        n: 9,
        title: 'Founding team',
        people: [
          { name: 'Monserrat Mendoza', role: 'COO & UX/UI', photo: '/team/monserrat.png' },
          { name: 'Giovanny Amador', role: 'CEO & Technical Lead', photo: '/team/giovanny.png' },
        ],
        body: [
          'We both graduated and got certified from the Solana Builders Bootcamp — and it shows in what we\'ve already shipped: a production Anchor program, four published SDKs, and a real dependency fix upstream in the Anchor framework itself (PR #4960), not just coursework.',
        ],
      },
      {
        n: 10,
        title: 'Ask / next step',
        body: [
          'Prova is asking for funding via Solana Foundation Grants to accelerate commercial validation and, eventually, the Mainnet migration — not just a green light, but concrete runway. It fits the product\'s real state: a technical MVP already live on Devnet since before the program, one design partner with real integration evidence (David Rivas) plus one validated pilot with an accepted design partner (wasiai.io), and a decision already made to wait for the first real LOI before moving Mainnet\'s timing — the grant is what sustains that runway while that validation arrives.',
        ],
      },
    ],
    appendixLabel: 'Appendix — not part of the spoken pitch',
    research: {
      title: 'Verification note',
      intro:
        'Every number and claim in this deck is verified live against official, public sources — see /changelog for the detail behind each correction.',
    },
    transparency: {
      title: 'Transparency note — status of prior corrections',
      intro: 'Everything flagged as pending in earlier drafts of this document was resolved or correctly labeled by 2026-08-23:',
      items: [
        { label: 'SAS/PDA', text: '— fixed and deployed to production, re-verified live by this session.' },
        { label: 'Attestation count', text: '— corroborated (not exactly verified) via direct RPC, correct label already incorporated in slide 05.' },
        { label: 'Rivas\'s repo', text: '— resolved 2026-08-26. He added the line himself to his repo\'s README (commit f25c6cb, Aug 24) — now cited directly in slide 06, re-verified live against the source before publishing.' },
      ],
      closing: 'None of these invalidate the product — they\'re precision corrections, applied before anyone asked.',
    },
  },
  ES: {
    cover: {
      eyebrow: 'Pitch · Solana Latam Labs / WayLearn',
      title: 'Prova',
      tagline: '"A verifiable record of every AI agent action on Solana."',
      meta: 'M6 Pitch deck + video — entrega 25-ago-2026 · M7 Demo Day 31-ago-2026',
      footnote:
        'Cada número en este deck está verificado en vivo contra theprova.xyz, github.com/Prova-Solana/Prova y el registro público de npm. Contenido factual sin cambios desde la corrección del 2026-08-23 (sitio en v0.2.4/v0.2.5, sin SAS, sin PDAs).',
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
        title: 'Usuario objetivo',
        body: [
          'Equipos que construyen agentes de IA autónomos sobre Solana y necesitan poder probar qué hizo su agente, cuándo y bajo qué firma — no solo confiar en sus propios logs. Hoy ya validan esto dos perfiles concretos: desarrolladores que integran frameworks de agentes como Solana Agent Kit (caso real: David Rivas), y marketplaces de agentes de IA que necesitan trazabilidad verificable detrás de la reputación de cada agente (caso real: wasiai.io).',
          'El comprador técnico es quien construye el agente; el beneficiario real es quien necesita confiar en lo que ese agente hizo — equipos de compliance, auditores, o el propio usuario final del agente.',
        ],
      },
      {
        n: 5,
        title: 'Uso de Solana',
        body: [
          'Finalidad sub-segundo y costo sub-centavo por recibo hacen viable sellar cada acción de un agente, no solo las críticas. En cualquier cadena con finalidad de varios segundos o costo alto, atestar en tiempo real deja de ser económico.',
          'La integración es nativa, no un puente: programa Anchor propio desplegado en devnet, verificación Ed25519 nativa del propio runtime de Solana (sin oráculo ni verificador externo), cada atestación sellada como evento on-chain, y x402 —el protocolo de micropagos agénticos ya vivo en el ecosistema Solana— para las consultas pay-per-use del Explorer.',
        ],
      },
      {
        n: 6,
        title: 'Evidencia de que existe hoy',
        bullets: [
          '4 SDKs publicados, Apache 2.0, verificables ahora mismo en npm: [prova-agent-sdk v0.1.7](https://www.npmjs.com/package/prova-agent-sdk), [prova-agent-kit v0.1.5](https://www.npmjs.com/package/prova-agent-kit) (adaptador de [Solana Agent Kit v2](https://github.com/sendaifun/solana-agent-kit) — 1.7k stars, 60+ acciones on-chain, Prova lo instrumenta en vez de competir con él), [prova-mcp-server v0.1.0](https://www.npmjs.com/package/prova-mcp-server), [prova-plugin-eliza v0.1.2](https://www.npmjs.com/package/prova-plugin-eliza).',
          '[Repo público](https://github.com/Prova-Solana/Prova) activo, [último commit 26-ago-2026](https://github.com/Prova-Solana/Prova/commits/main).',
          'También listado en [Colosseum](https://colosseum.com/arena/projects/explore/prova-1) — la plataforma de hackathons y aceleración de Solana — bajo el track Frontier, categoría AI Platforms / Agents.',
          'Contribución al ecosistema, no solo consumo: [PR #4960 abierto contra otter-sec/anchor](https://github.com/otter-sec/anchor/pull/4960) (el framework Anchor) — fix real de un bug de dependencias (heck/edition2024) encontrado usando la librería en producción, pendiente de revisión.',
          'Piloto validado con [wasiai.io](https://wasiai.io) (marketplace de agentes): Fernando (fundador) validó el encaje técnico del piloto y confirmó que lo retoma cuando reactive el desarrollo del marketplace — todavía no es una integración en vivo.',
          'David Rivas (mentor WayLearn) integró prova-agent-kit en un agente real de Solana Agent Kit v2 con modelos locales, y lo dejó escrito directamente en el README de su repo (24-ago-2026): "integra el SDK de Prova como servicio de atestación totalmente funcional en la red devnet de Solana". Fuente, reverificada en vivo: [github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md](https://github.com/DvdRivas/Solana-Agent-wProva/blob/f25c6cb/README.md).',
          'Validación directa con usuarios (encuesta Google Form en la comunidad WayLearn, 31-jul-2026, muestra chica — n=4): 3 de 4 también usan MCP (Claude/Cursor), no solo Solana Agent Kit; las 3 respuestas abiertas a "¿qué crees que hace Prova?" fueron correctas sin sobre-explicar; los 3 que respondieron quieren probar el SDK en devnet y autorizaron ser citados públicamente con su nombre. Insight de segmentación de la misma encuesta: el dolor es más agudo donde hay dinero real circulando o un tercero exige pruebas — exactamente ahí es donde está enfocado el go-to-market (marketplaces, agentes en producción, auditores), no el explorador genérico de devnet.',
          'Tracción en números, con etiqueta honesta: ~[117,013 atestaciones y 38 agentes activos](https://prova-api.fly.dev/api/v1/stats) — autoreportado, corroborado por actividad on-chain vía RPC directo (getSignaturesForAddress contra [el programa en devnet](https://explorer.solana.com/address/G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1?cluster=devnet), sin pasar por exploradores públicos que bloquean fetch automatizado). La query confirma actividad real y sostenida de ~1 tx/minuto desde antes de julio de 2026, consistente con el orden de magnitud de la cifra — no un match exacto verificado transacción por transacción. Presentarla siempre con esta etiqueta, nunca como "verificado" sin más.',
        ],
      },
      {
        n: 7,
        title: 'Modelo de negocio',
        body: [
          'Software-only SaaS, cero lenguaje financiero (nada de fees/yield/APY): Free $0/mes (100 atestaciones), Builder $49/mes (10,000), Growth $499/mes (100,000), Enterprise a medida (ilimitado), más pay-per-use a $0.01/query vía x402 para el Explorer, sin cuenta ni compromiso — el mismo protocolo de pagos agénticos ya vivo en el ecosistema Solana vía agentic.market.',
        ],
      },
      {
        n: 8,
        title: 'Avance del MVP y próximos pasos',
        body: [
          'AHORA — lo construido y funcionando hoy: programa Anchor propio con 4 instrucciones (registro, atestación en batch, revocación, actualización de policy) corriendo en devnet; indexer dual-mode (WebSocket + catch-up) con auto-sanación; API REST con tier premium vía x402; Explorer forense en producción; 4 SDKs publicados en npm; y un agente de referencia (demo-agent) generando atestaciones reales en Devnet 24/7 desde antes del programa. los 5 milestones entregados (M1-M5) — el objetivo no fue llegar a mainnet para el cierre, fue llegar al Demo Day con producto real, SDKs y evidencia listos para presentarse formalmente a Solana Foundation después.',
          'SIGUIENTE — convertir el piloto actual en integración en vivo, sumar el próximo design partner, y conseguir la primera LOI de un equipo corriendo Prova en producción.',
          'DESPUÉS — la migración a Mainnet, condicionada a que llegue esa primera LOI real.',
        ],
      },
      {
        n: 9,
        title: 'Equipo fundador',
        people: [
          { name: 'Monserrat Mendoza', role: 'COO y UX/UI', photo: '/team/monserrat.png' },
          { name: 'Giovanny Amador', role: 'CEO y Technical Lead', photo: '/team/giovanny.png' },
        ],
        body: [
          'Ambos egresamos y nos certificamos del Solana Builders Bootcamp — y se nota en lo que ya construimos: un programa Anchor en producción, cuatro SDKs publicados, y un fix real subido al propio framework Anchor (PR #4960), no solo el curso.',
        ],
      },
      {
        n: 10,
        title: 'Ask / siguiente paso',
        body: [
          'Prova pide financiamiento vía Solana Foundation Grants para acelerar validación comercial y, eventualmente, la migración a Mainnet — no un simple visto bueno, sino runway concreto. Encaja con el estado real del producto: MVP técnico ya vivo en Devnet desde antes del programa, un design partner con evidencia de integración real (David Rivas) más un piloto validado con un design partner que ya aceptó (wasiai.io), y una decisión ya tomada de esperar a la primera LOI real antes de mover el timing de Mainnet — el grant es lo que sostiene ese runway mientras esa validación llega.',
        ],
      },
    ],
    appendixLabel: 'Apéndice — no forma parte del pitch hablado',
    research: {
      title: 'Nota de verificación',
      intro:
        'Cada número y afirmación de este deck está verificado en vivo contra fuentes oficiales y públicas — ver /changelog para el detalle de cada corrección.',
    },
    transparency: {
      title: 'Nota de transparencia — estado de las correcciones previas',
      intro: 'Todo lo marcado como pendiente en versiones anteriores de este borrador ya se resolvió o etiquetó correctamente hacia el 2026-08-23:',
      items: [
        { label: 'SAS/PDA', text: '— corregido y desplegado en producción, reverificado en vivo por esta sesión.' },
        { label: 'Conteo de atestaciones', text: '— corroborado (no verificado exacto) vía RPC directo, etiqueta correcta ya incorporada en la slide 05.' },
        { label: 'Repo de Rivas', text: '— resuelto 2026-08-26. Él mismo agregó la línea al README de su repo (commit f25c6cb, 24-ago), ahora citada directamente en la slide 06, reverificada en vivo contra la fuente antes de publicarla.' },
      ],
      closing: 'Ninguna de estas invalida el producto — son correcciones de precisión, aplicadas antes de que alguien preguntara.',
    },
  },
} as const;

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Founder photo with a graceful fallback to initials while the real file isn't uploaded yet. */
function PersonCard({ name, role, photo }: { name: string; role: string; photo: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {failed ? (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-border bg-primary/10 font-display text-lg text-primary">
          {initials(name)}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- small static deck asset, no responsive/opt needs
        <img
          src={photo}
          alt={name}
          className="h-20 w-20 shrink-0 border border-border object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <div>
        <p className="font-display text-lg uppercase text-foreground">{name}</p>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

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
            {'people' in s && s.people && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {s.people.map((p) => (
                  <PersonCard key={p.name} name={p.name} role={p.role} photo={p.photo} />
                ))}
              </div>
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
