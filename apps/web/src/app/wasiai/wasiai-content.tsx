'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'Integration · wasiai',
    headline: ['Prova', '×', 'wasiai'],
    sub: 'Verifiable traceability for every agent in your marketplace.',
    desc: 'wasiai proves who an agent is and how good it is. Prova proves what it actually did — action by action, tamper-proof. The evidence layer that gives reputation real weight.',

    fitTag: 'The fit',
    fitTitle: 'Three layers of trust',
    layers: [
      { k: 'Identity', by: 'wasiai · ERC-8004', q: 'Who is the agent?' },
      { k: 'Reputation', by: 'wasiai · ERC-8004', q: 'How good is it?' },
      { k: 'Traceability', by: 'Prova', q: 'What did it do — provably?' },
    ],
    fitNote:
      'Reputation without verifiable evidence is opinion. Prova gives every reputation point an immutable receipt of what the agent really did — and a way to settle any dispute with proof, not trust.',

    howTag: 'How it works',
    howTitle: 'One hook. Every agent covered.',
    howSteps: [
      { n: '01', t: 'Wrap the invocation', d: 'wasiai already returns a receipt signature per call. Prova anchors it. Integrate once at the invoke / compose layer and every agent in the marketplace is covered.' },
      { n: '02', t: 'Only the hash goes on-chain', d: 'The full tool input/output stays off-chain with you. Prova seals a fingerprint (hash) on-chain — immutable and timestamped.' },
      { n: '03', t: 'Fire-and-forget', d: 'The attestation runs in the background. Your agent never waits on it.' },
      { n: '04', t: 'Retrieve by agent ID', d: 'Each agent registers once and gets an ID. Pull its full, ordered, immutable history anytime.' },
    ],

    codeTag: 'Pilot integration',
    codeTitle: 'Wrap @wasiai/sdk with prova-agent-sdk',
    codeNote: 'Node / TypeScript. Adapt to your backend — exact SDK signatures are in the developer docs linked below.',
    steps: [
      {
        step: '01',
        title: 'Install',
        code: `npm install prova-agent-sdk @wasiai/sdk`,
      },
      {
        step: '02',
        title: 'Initialize both clients',
        code: `import { ProvaClient } from 'prova-agent-sdk';
import { WasiAI } from '@wasiai/sdk';
import { Keypair } from '@solana/web3.js';

const wasi = new WasiAI({ apiKey: process.env.WASIAI_API_KEY });

// wasiai manages one Solana devnet keypair per agent — the end user never sees it
const prova = new ProvaClient({
  rpcUrl: process.env.SOLANA_RPC_URL,   // Helius devnet recommended
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});`,
      },
      {
        step: '03',
        title: 'Seal every invocation',
        code: `// Invoke the agent on wasiai, then anchor the receipt on Solana
export async function invokeWithProva(slug, input) {
  const res = await wasi.agents.invoke(slug, input);   // real call (Avalanche)

  const actionHash = await ProvaClient.hashAction(
    JSON.stringify({ slug, input, output: res.output,
                     receipt: res.metadata?.receiptSignature })
  );

  prova.attest({                    // fire-and-forget — never blocks the agent
    operatorKeypair,
    actionHash,
    actionType: 'ToolCall',
    privacyMode: true,              // Vanish: private data, public fingerprint
  }).catch((e) => console.warn('[prova] non-blocking attest failed:', e));

  return res;                       // user gets the response without waiting
}`,
      },
      {
        step: '04',
        title: 'Batch for high volume',
        code: `// One Solana tx → up to 100 receipts
await prova.batchAttest({
  operatorKeypair,
  attestations: calls.map((c) => ({
    actionHash: c.hash,
    actionType: 'ToolCall',
  })),
});`,
      },
    ],

    forTag: 'Forensics',
    forTitle: 'Prove what happened. Catch a lie.',
    forDesc:
      'The hash is a fingerprint of the action. The fingerprint lives on-chain — immutable, timestamped. To verify, re-hash the real data and compare.',
    forCode: `// Does the claimed data match the immutable on-chain fingerprint?
const expected = await ProvaClient.hashAction(JSON.stringify(claimedData));

const receipt = await fetch(
  \`https://prova-api.fly.dev/api/v1/attestations/\${pda}\`
).then((r) => r.json());

const authentic = receipt.actionHash === expected;
// true  → exactly what the agent did, untouched
// false → altered / someone is lying`,
    forLinks: 'Explore live receipts in the forensic explorer, or pull the full history via the API.',

    chainTag: 'Chains',
    chainTitle: 'Honest about where we run',
    chainDesc:
      'wasiai runs on Avalanche (EVM). Prova is Solana-native today. Same x402 standard, different chains — not drop-in interoperable yet. Here is the plan, without hype.',
    phases: [
      { k: 'Phase 1 · now', d: 'Prova anchors wasiai agent invocations to Solana devnet. Works today — hash-anchoring is chain-agnostic. The full forensic flow, live, at zero cost.' },
      { k: 'Phase 2 · co-built', d: 'Prova native on Avalanche / EVM — receipts on the same chain as wasiai — with wasiai as the first partner driving the design.' },
    ],

    notTag: 'Software-only',
    notTitle: 'What Prova does not touch',
    nots: [
      { t: 'No custody', d: 'Your deposits and Agent Keys stay yours. Prova never holds funds.' },
      { t: 'No revenue cut', d: 'Flat software licensing. Any x402 payment to Prova is for a verification query — never a slice of what your agents earn.' },
      { t: 'No state contract', d: 'Prova is the immutable history of actions, not a mutable balance or directory. Do not build the audit trail twice.' },
    ],

    linksTag: 'Everything you need',
    linksSdk: 'SDK · TypeScript',
    linksDocs: 'Developer docs',
    linksExplorer: 'Forensic explorer',
    linksApi: 'REST API',
    linksProgram: 'Devnet program (Solana)',
    linksRepo: 'Open-source repo',

    ctaTag: 'Next step',
    ctaTitle: 'Run the pilot',
    ctaDesc: 'A 30-minute pair session. We lead the Solana side — you do not need to learn Solana. One of your agents, attesting live in the explorer, at zero cost.',
    ctaBtn: 'Book the pilot call',
  },

  ES: {
    tag: 'Integración · wasiai',
    headline: ['Prova', '×', 'wasiai'],
    sub: 'Trazabilidad verificable para cada agente de tu marketplace.',
    desc: 'wasiai prueba quién es un agente y qué tan bueno es. Prova prueba qué hizo realmente — acción por acción, a prueba de manipulación. La capa de evidencia que le da peso real a la reputación.',

    fitTag: 'El encaje',
    fitTitle: 'Tres capas de confianza',
    layers: [
      { k: 'Identidad', by: 'wasiai · ERC-8004', q: '¿Quién es el agente?' },
      { k: 'Reputación', by: 'wasiai · ERC-8004', q: '¿Qué tan bueno es?' },
      { k: 'Trazabilidad', by: 'Prova', q: '¿Qué hizo — y probado?' },
    ],
    fitNote:
      'Reputación sin evidencia verificable es opinión. Prova le da a cada punto de reputación un recibo inmutable de lo que el agente realmente hizo — y una forma de resolver cualquier disputa con prueba, no con confianza.',

    howTag: 'Cómo funciona',
    howTitle: 'Un solo enganche. Todos los agentes cubiertos.',
    howSteps: [
      { n: '01', t: 'Envuelve la invocación', d: 'wasiai ya devuelve una firma de recibo por llamada. Prova la ancla. Integras una vez en la capa de invoke / compose y todos los agentes del marketplace quedan cubiertos.' },
      { n: '02', t: 'On-chain solo va el hash', d: 'El input/output completo de la tool se queda off-chain, contigo. Prova sella una huella (hash) on-chain — inmutable y con fecha y hora.' },
      { n: '03', t: 'Fire-and-forget', d: 'La atestación corre en segundo plano. Tu agente nunca la espera.' },
      { n: '04', t: 'Recupera por agent ID', d: 'Cada agente se registra una vez y obtiene un ID. Recuperas toda su historia inmutable y ordenada cuando quieras.' },
    ],

    codeTag: 'Integración del piloto',
    codeTitle: 'Envuelve @wasiai/sdk con prova-agent-sdk',
    codeNote: 'Node / TypeScript. Adáptalo a tu backend — las firmas exactas del SDK están en los docs enlazados abajo.',
    steps: [
      {
        step: '01',
        title: 'Instalar',
        code: `npm install prova-agent-sdk @wasiai/sdk`,
      },
      {
        step: '02',
        title: 'Inicializa ambos clientes',
        code: `import { ProvaClient } from 'prova-agent-sdk';
import { WasiAI } from '@wasiai/sdk';
import { Keypair } from '@solana/web3.js';

const wasi = new WasiAI({ apiKey: process.env.WASIAI_API_KEY });

// wasiai gestiona una llave devnet de Solana por agente — el usuario final no la ve
const prova = new ProvaClient({
  rpcUrl: process.env.SOLANA_RPC_URL,   // Helius devnet recomendado
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});`,
      },
      {
        step: '03',
        title: 'Sella cada invocación',
        code: `// Invoca el agente en wasiai y ancla el recibo en Solana
export async function invokeWithProva(slug, input) {
  const res = await wasi.agents.invoke(slug, input);   // llamada real (Avalanche)

  const actionHash = await ProvaClient.hashAction(
    JSON.stringify({ slug, input, output: res.output,
                     receipt: res.metadata?.receiptSignature })
  );

  prova.attest({                    // fire-and-forget — no bloquea al agente
    operatorKeypair,
    actionHash,
    actionType: 'ToolCall',
    privacyMode: true,              // Vanish: dato privado, huella pública
  }).catch((e) => console.warn('[prova] attest no-bloqueante falló:', e));

  return res;                       // el usuario recibe su respuesta sin esperar
}`,
      },
      {
        step: '04',
        title: 'Batching para alto volumen',
        code: `// Una tx de Solana → hasta 100 recibos
await prova.batchAttest({
  operatorKeypair,
  attestations: calls.map((c) => ({
    actionHash: c.hash,
    actionType: 'ToolCall',
  })),
});`,
      },
    ],

    forTag: 'Forense',
    forTitle: 'Prueba qué pasó. Atrapa una mentira.',
    forDesc:
      'El hash es la huella digital de la acción. La huella vive on-chain — inmutable, con timestamp. Para validar, recomputas la huella del dato real y comparas.',
    forCode: `// ¿El dato que se afirma coincide con la huella inmutable on-chain?
const expected = await ProvaClient.hashAction(JSON.stringify(claimedData));

const receipt = await fetch(
  \`https://prova-api.fly.dev/api/v1/attestations/\${pda}\`
).then((r) => r.json());

const authentic = receipt.actionHash === expected;
// true  → exactamente lo que el agente hizo, intacto
// false → alterado / alguien miente`,
    forLinks: 'Explora recibos en vivo en el explorer forense, o recupera la historia completa vía la API.',

    chainTag: 'Cadenas',
    chainTitle: 'Honestos sobre dónde corremos',
    chainDesc:
      'wasiai corre en Avalanche (EVM). Prova hoy es nativo de Solana. Mismo estándar x402, distinta cadena — todavía no interoperable drop-in. Este es el plan, sin humo.',
    phases: [
      { k: 'Fase 1 · ya', d: 'Prova ancla las invocaciones de agentes de wasiai en Solana devnet. Funciona hoy — el anclaje del hash es agnóstico de cadena. El flujo forense completo, en vivo, sin costo.' },
      { k: 'Fase 2 · co-construida', d: 'Prova nativo en Avalanche / EVM — recibos en la misma cadena que wasiai — con wasiai como el primer partner que dirige el diseño.' },
    ],

    notTag: 'Solo software',
    notTitle: 'Lo que Prova no toca',
    nots: [
      { t: 'Sin custodia', d: 'Tus depósitos y Agent Keys son tuyos. Prova nunca retiene fondos.' },
      { t: 'Sin % de ingresos', d: 'Licencia de software plana. Cualquier pago x402 a Prova es por una consulta de verificación — nunca una tajada de lo que ganan tus agentes.' },
      { t: 'Sin contrato de estado', d: 'Prova es la historia inmutable de acciones, no un saldo o directorio mutable. No construyas la auditoría dos veces.' },
    ],

    linksTag: 'Todo lo que necesitas',
    linksSdk: 'SDK · TypeScript',
    linksDocs: 'Docs de desarrollador',
    linksExplorer: 'Explorer forense',
    linksApi: 'API REST',
    linksProgram: 'Programa devnet (Solana)',
    linksRepo: 'Repo open-source',

    ctaTag: 'Siguiente paso',
    ctaTitle: 'Corramos el piloto',
    ctaDesc: 'Una sesión de 30 minutos en pair. Nosotros lideramos la parte de Solana — no necesitas aprender Solana. Uno de tus agentes, atestando en vivo en el explorer, sin costo.',
    ctaBtn: 'Agendar la call del piloto',
  },

  ZH: {
    tag: '集成 · wasiai',
    headline: ['Prova', '×', 'wasiai'],
    sub: '为你市场里的每个智能体提供可验证的可追溯性。',
    desc: 'wasiai 证明智能体是谁、有多好。Prova 证明它实际做了什么——逐个动作、防篡改。这是让声誉真正有分量的证据层。',

    fitTag: '契合点',
    fitTitle: '三层信任',
    layers: [
      { k: '身份', by: 'wasiai · ERC-8004', q: '智能体是谁？' },
      { k: '声誉', by: 'wasiai · ERC-8004', q: '它有多好？' },
      { k: '可追溯性', by: 'Prova', q: '它做了什么——可证明吗？' },
    ],
    fitNote:
      '没有可验证证据的声誉只是观点。Prova 为每一分声誉都提供一张关于智能体真实行为的不可篡改回执——用证据而非信任来解决任何争议。',

    howTag: '工作原理',
    howTitle: '一次接入，覆盖所有智能体。',
    howSteps: [
      { n: '01', t: '包装调用', d: 'wasiai 每次调用已返回一个回执签名。Prova 将其锚定。在 invoke / compose 层集成一次，市场里所有智能体都被覆盖。' },
      { n: '02', t: '链上只存哈希', d: '完整的工具输入/输出仍保存在你这边的链下。Prova 在链上封存一个指纹（哈希）——不可篡改、带时间戳。' },
      { n: '03', t: '发送即忘', d: '存证在后台运行。你的智能体永远不必等待。' },
      { n: '04', t: '按 agent ID 检索', d: '每个智能体注册一次并获得一个 ID。随时拉取其完整、有序、不可篡改的历史。' },
    ],

    codeTag: '试点集成',
    codeTitle: '用 prova-agent-sdk 包装 @wasiai/sdk',
    codeNote: 'Node / TypeScript。请适配你的后端——确切的 SDK 签名见下方开发者文档。',
    steps: [
      {
        step: '01',
        title: '安装',
        code: `npm install prova-agent-sdk @wasiai/sdk`,
      },
      {
        step: '02',
        title: '初始化两个客户端',
        code: `import { ProvaClient } from 'prova-agent-sdk';
import { WasiAI } from '@wasiai/sdk';
import { Keypair } from '@solana/web3.js';

const wasi = new WasiAI({ apiKey: process.env.WASIAI_API_KEY });

// wasiai 为每个智能体管理一个 Solana devnet 密钥——终端用户看不到
const prova = new ProvaClient({
  rpcUrl: process.env.SOLANA_RPC_URL,   // 推荐 Helius devnet
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});`,
      },
      {
        step: '03',
        title: '封存每次调用',
        code: `// 在 wasiai 上调用智能体，然后在 Solana 上锚定回执
export async function invokeWithProva(slug, input) {
  const res = await wasi.agents.invoke(slug, input);   // 真实调用（Avalanche）

  const actionHash = await ProvaClient.hashAction(
    JSON.stringify({ slug, input, output: res.output,
                     receipt: res.metadata?.receiptSignature })
  );

  prova.attest({                    // 发送即忘——不阻塞智能体
    operatorKeypair,
    actionHash,
    actionType: 'ToolCall',
    privacyMode: true,              // Vanish：私有数据，公开指纹
  }).catch((e) => console.warn('[prova] 非阻塞存证失败:', e));

  return res;                       // 用户无需等待即可获得响应
}`,
      },
      {
        step: '04',
        title: '高并发批处理',
        code: `// 一笔 Solana 交易 → 最多 100 张回执
await prova.batchAttest({
  operatorKeypair,
  attestations: calls.map((c) => ({
    actionHash: c.hash,
    actionType: 'ToolCall',
  })),
});`,
      },
    ],

    forTag: '取证',
    forTitle: '证明发生了什么。抓出谎言。',
    forDesc:
      '哈希是该动作的指纹。指纹存于链上——不可篡改、带时间戳。要验证时，对真实数据重新哈希并比对。',
    forCode: `// 声称的数据是否与链上不可篡改的指纹一致？
const expected = await ProvaClient.hashAction(JSON.stringify(claimedData));

const receipt = await fetch(
  \`https://prova-api.fly.dev/api/v1/attestations/\${pda}\`
).then((r) => r.json());

const authentic = receipt.actionHash === expected;
// true  → 正是智能体所做，未被触碰
// false → 被篡改 / 有人在说谎`,
    forLinks: '在取证浏览器中查看实时回执，或通过 API 拉取完整历史。',

    chainTag: '链',
    chainTitle: '坦诚说明我们运行在哪',
    chainDesc:
      'wasiai 运行在 Avalanche（EVM）。Prova 目前原生于 Solana。相同的 x402 标准，不同的链——尚不能即插即用互操作。这是计划，不吹嘘。',
    phases: [
      { k: '第一阶段 · 现在', d: 'Prova 将 wasiai 智能体的调用锚定到 Solana devnet。今天即可运行——哈希锚定与链无关。完整取证流程，实时，零成本。' },
      { k: '第二阶段 · 共建', d: 'Prova 原生于 Avalanche / EVM——回执与 wasiai 同链——由 wasiai 作为主导设计的首个合作伙伴。' },
    ],

    notTag: '纯软件',
    notTitle: 'Prova 不碰什么',
    nots: [
      { t: '不托管', d: '你的存款和 Agent Keys 归你所有。Prova 从不持有资金。' },
      { t: '不抽成', d: '固定软件授权。任何向 Prova 的 x402 付款都是为了一次验证查询——绝不是你智能体收入的一部分。' },
      { t: '无状态合约', d: 'Prova 是动作的不可篡改历史，而非可变余额或目录。不要把审计轨迹建两遍。' },
    ],

    linksTag: '你需要的一切',
    linksSdk: 'SDK · TypeScript',
    linksDocs: '开发者文档',
    linksExplorer: '取证浏览器',
    linksApi: 'REST API',
    linksProgram: 'Devnet 程序（Solana）',
    linksRepo: '开源仓库',

    ctaTag: '下一步',
    ctaTitle: '开始试点',
    ctaDesc: '一次 30 分钟的结对会话。Solana 那部分由我们主导——你无需学习 Solana。你的一个智能体，在浏览器中实时存证，零成本。',
    ctaBtn: '预约试点通话',
  },
};

const links = [
  { key: 'linksSdk', href: 'https://www.npmjs.com/package/prova-agent-sdk', label: 'npmjs.com/package/prova-agent-sdk', ext: true },
  { key: 'linksDocs', href: 'https://www.theprova.xyz/developers/docs', label: 'theprova.xyz/developers/docs', ext: true },
  { key: 'linksExplorer', href: 'https://www.theprova.xyz/explorer', label: 'theprova.xyz/explorer', ext: true },
  { key: 'linksApi', href: 'https://prova-api.fly.dev/api/v1/health', label: 'prova-api.fly.dev', ext: true },
  { key: 'linksProgram', href: 'https://explorer.solana.com/address/G11dBAzLQaADtHHM2AZNz3ThCDnkY5nhX3Ujddu1CMM1?cluster=devnet', label: 'G11d…1CMM1', ext: true },
  { key: 'linksRepo', href: 'https://github.com/Eras256/Prova', label: 'github.com/Eras256/Prova', ext: true },
] as const;

export function WasiaiContent() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
          </div>
          <div>
            <h1 className="break-words font-display text-3xl min-[380px]:text-4xl uppercase leading-none tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <span className="text-foreground">{t.headline[0]}</span>{' '}
              <span className="text-muted-foreground">{t.headline[1]}</span>{' '}
              <span className="text-primary">{t.headline[2]}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg font-medium leading-relaxed text-foreground">{t.sub}</p>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">{t.desc}</p>
          </div>
        </div>

        {/* Fit — three layers */}
        <section className="mt-16 sm:mt-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.fitTag}</p>
              <h2 className="mt-3 font-display text-xl min-[380px]:text-2xl uppercase leading-tight text-foreground sm:text-3xl">
                {t.fitTitle}
              </h2>
            </div>
            <div>
              <div className="grid gap-px border border-border bg-border grid-cols-1 sm:grid-cols-3">
                {t.layers.map((l, i) => (
                  <div key={l.k} className="bg-background p-5 sm:p-6">
                    <span className="font-mono text-xs text-primary">{`0${i + 1}`}</span>
                    <p className="mt-3 font-display text-base uppercase text-foreground">{l.k}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {l.by}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{l.q}</p>
                  </div>
                ))}
              </div>
              <div className="mt-px border border-border bg-surface p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{t.fitNote}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16 sm:mt-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.howTag}</p>
              <h2 className="mt-3 font-display text-xl min-[380px]:text-2xl uppercase leading-tight text-foreground sm:text-3xl">
                {t.howTitle}
              </h2>
            </div>
            <ol className="border-t border-border">
              {t.howSteps.map((s) => (
                <li
                  key={s.n}
                  className="grid gap-2 border-b border-border py-6 sm:py-8 lg:grid-cols-[auto_1fr] lg:gap-12"
                >
                  <span className="font-mono text-xs text-primary">{s.n}</span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base uppercase text-foreground">{s.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pilot code */}
        <section className="mt-16 sm:mt-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.codeTag}</p>
              <h2 className="mt-3 font-display text-xl min-[380px]:text-2xl uppercase leading-tight text-foreground sm:text-3xl">
                {t.codeTitle}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{t.codeNote}</p>
            </div>
            <ol className="border-t border-border">
              {t.steps.map((s) => (
                <li key={s.step} className="border-b border-border py-6 sm:py-8">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-primary">{s.step}</span>
                    <h3 className="font-display text-base uppercase text-foreground">{s.title}</h3>
                  </div>
                  <div className="mt-4 overflow-x-auto border border-border bg-surface p-4 sm:p-5">
                    <pre className="font-mono text-[11px] min-[380px]:text-xs md:text-sm leading-relaxed text-primary/90 whitespace-pre overflow-x-auto scrollbar-thin">{s.code}</pre>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Forensics */}
        <section className="mt-16 sm:mt-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.forTag}</p>
              <h2 className="mt-3 font-display text-xl min-[380px]:text-2xl uppercase leading-tight text-foreground sm:text-3xl">
                {t.forTitle}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{t.forDesc}</p>
            </div>
            <div>
              <div className="overflow-x-auto border border-border bg-surface p-4 sm:p-5">
                <pre className="font-mono text-[11px] min-[380px]:text-xs md:text-sm leading-relaxed text-primary/90 whitespace-pre overflow-x-auto scrollbar-thin">{t.forCode}</pre>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.forLinks}</p>
            </div>
          </div>
        </section>

        {/* Chains + phases */}
        <section className="mt-16 sm:mt-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.chainTag}</p>
              <h2 className="mt-3 font-display text-xl min-[380px]:text-2xl uppercase leading-tight text-foreground sm:text-3xl">
                {t.chainTitle}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{t.chainDesc}</p>
            </div>
            <div className="grid gap-px border border-border bg-border grid-cols-1 sm:grid-cols-2">
              {t.phases.map((p) => (
                <div key={p.k} className="bg-background p-5 sm:p-6">
                  <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{p.k}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guardrails */}
        <section className="mt-16 sm:mt-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.notTag}</p>
              <h2 className="mt-3 font-display text-xl min-[380px]:text-2xl uppercase leading-tight text-foreground sm:text-3xl">
                {t.notTitle}
              </h2>
            </div>
            <div className="grid gap-px border border-border bg-border grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {t.nots.map((n) => (
                <div key={n.t} className="bg-background p-5 sm:p-6">
                  <p className="font-display text-sm uppercase text-foreground">{n.t}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mt-16 sm:mt-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.linksTag}</p>
            </div>
            <div className="grid gap-px border border-border bg-border grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3">
              {links.map((l) => (
                <a
                  key={l.key}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group bg-background p-5 sm:p-6 transition-colors hover:bg-surface"
                >
                  <p className="font-pixel text-[12px] uppercase tracking-wider text-muted-foreground">
                    {t[l.key]}
                  </p>
                  <span className="mt-2 flex items-center gap-1.5 break-all font-mono text-xs sm:text-sm text-foreground group-hover:text-primary">
                    {l.label}
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 sm:mt-24">
          <div className="border border-border bg-surface p-6 sm:p-10 lg:p-12">
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.ctaTag}</p>
            <h2 className="mt-3 font-display text-xl min-[380px]:text-2xl uppercase leading-tight text-foreground sm:text-3xl lg:text-4xl">
              {t.ctaTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">{t.ctaDesc}</p>
            <Link
              href="/contact"
              className="mt-8 inline-block w-full sm:w-auto text-center bg-primary px-6 py-3 font-display text-sm uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t.ctaBtn}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
