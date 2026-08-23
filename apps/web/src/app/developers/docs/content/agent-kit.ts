import type { LocalizedDoc } from './types';

const installCode = `npm install prova-agent-kit prova-agent-sdk`;

const attachCode = `import { attachProva, attesterFromProvaClient } from 'prova-agent-kit';
import { ProvaClient } from 'prova-agent-sdk';

const prova = new ProvaClient({ rpcUrl, agentKeypair });
const attester = attesterFromProvaClient(
  prova,
  ProvaClient.hashAction,
  operatorKeypair,
);

// Call AFTER registering all your Solana Agent Kit plugins:
const handle = attachProva(agent, { attester });

// ... your agent runs normally; every action is attested automatically ...

await handle.stop(); // final flush — call when shutting the agent down`;

const optionsCode = `const handle = attachProva(agent, {
  attester,
  // Only attest specific actions:
  rules: (actionName) => actionName.startsWith('trade_'),
  // Tune batching:
  batch: {
    maxSize: 25,        // flush immediately at N items (1–100)
    flushDelayMs: 1000, // debounce: flush N ms after the LAST action
  },
  // Custom error handling (attestation never breaks the action):
  onError: (error, { action }) => log.warn({ action, error }),
});`;

const walletCode = `import { ProvaWallet } from 'prova-agent-kit';

// Wraps any SAK BaseWallet: captures the REAL on-chain signature
// of every transaction the agent signs and attests it.
const wallet = new ProvaWallet(innerWallet, { attester });

const agent = new SolanaAgentKit(wallet, rpcUrl, config);`;

export const agentKit: LocalizedDoc = {
  EN: {
    title: 'Agent Kit Adapter',
    intro:
      '`prova-agent-kit` plugs Prova into Solana Agent Kit v2 with two lines. Every action your agent executes is captured, hashed, batched, and sealed on-chain — without touching your agent logic.',
    blocks: [
      { kind: 'h2', text: 'How it captures actions' },
      {
        kind: 'list',
        items: [
          '`attachProva(agent)` wraps each registered action handler: after the handler resolves, the adapter builds a payload from the action name, input, and result, hashes it, and queues the attestation. Rich semantics, zero changes to your code.',
          '`ProvaWallet` decorates the SAK `BaseWallet`: it captures the real on-chain transaction signature at signing time — proof of the exact transaction, not just the intent.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Attestation is fire-and-forget: a Prova failure never breaks or slows down the agent action. Errors go to `onError` (default: console warning).',
      },
      { kind: 'h2', text: 'Install' },
      { kind: 'code', code: installCode },
      {
        kind: 'p',
        text: 'The adapter never imports `solana-agent-kit` — it relies on TypeScript structural typing, so it stays a lightweight dependency validated against SAK v2.',
      },
      { kind: 'h2', text: 'Quick start' },
      { kind: 'code', code: attachCode },
      { kind: 'h2', text: 'Options' },
      { kind: 'code', code: optionsCode },
      {
        kind: 'table',
        headers: ['Option', 'Default', 'Description'],
        rows: [
          ['`attester`', '—', 'Bridge to Prova. Build it with `attesterFromProvaClient(client, hashAction, operatorKeypair)`.'],
          ['`rules`', 'attest all', 'Predicate by action name — return `false` to skip an action.'],
          ['`batch.maxSize`', '`25`', 'Immediate flush at N queued items (1–100 per transaction).'],
          ['`batch.flushDelayMs`', '`1000`', 'Debounce: flush N ms after the last action, so a burst of tool calls lands in ONE transaction. `0` = attest each action immediately.'],
          ['`onError`', 'console warn', 'Called on attestation failure; the agent action itself is never affected.'],
        ],
      },
      { kind: 'h2', text: 'Batching semantics' },
      {
        kind: 'p',
        text: 'Multi-tool-calling agents fire actions in bursts. The batcher groups a burst by debounce: it waits `flushDelayMs` after the last action, then sends everything in one `record_attestations` transaction (up to 100). Reaching `maxSize` flushes immediately. `handle.flush()` forces a send; `handle.stop()` does a final guaranteed flush — always call it on shutdown.',
      },
      { kind: 'h2', text: 'Wallet-level capture' },
      { kind: 'code', code: walletCode },
      { kind: 'h2', text: 'What gets attested' },
      {
        kind: 'table',
        headers: ['Source', 'Payload', 'Action type'],
        rows: [
          ['Action handler', 'Action name + input + result (hashed, never on-chain).', 'Mapped from the action name (`ToolCall`, `Transaction`, …).'],
          ['`ProvaWallet`', 'The real transaction signature.', '`Transaction`.'],
        ],
      },
    ],
  },
  ES: {
    title: 'Adapter Agent Kit',
    intro:
      '`prova-agent-kit` conecta Prova con Solana Agent Kit v2 en dos líneas. Cada acción que ejecuta tu agente se captura, hashea, agrupa y sella on-chain — sin tocar la lógica de tu agente.',
    blocks: [
      { kind: 'h2', text: 'Cómo captura las acciones' },
      {
        kind: 'list',
        items: [
          '`attachProva(agent)` envuelve cada handler de acción registrado: al resolver el handler, el adapter construye un payload con el nombre de la acción, el input y el resultado, lo hashea y encola la atestación. Semántica rica, cero cambios en tu código.',
          '`ProvaWallet` decora el `BaseWallet` de SAK: captura la firma real de la transacción on-chain al momento de firmar — prueba de la transacción exacta, no solo de la intención.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'La atestación es fire-and-forget: un fallo de Prova jamás rompe ni ralentiza la acción del agente. Los errores van a `onError` (default: warning por consola).',
      },
      { kind: 'h2', text: 'Instalar' },
      { kind: 'code', code: installCode },
      {
        kind: 'p',
        text: 'El adapter nunca importa `solana-agent-kit` — se apoya en el tipado estructural de TypeScript, así que sigue siendo una dependencia ligera validada contra SAK v2.',
      },
      { kind: 'h2', text: 'Inicio rápido' },
      { kind: 'code', code: attachCode },
      { kind: 'h2', text: 'Opciones' },
      { kind: 'code', code: optionsCode },
      {
        kind: 'table',
        headers: ['Opción', 'Default', 'Descripción'],
        rows: [
          ['`attester`', '—', 'Puente hacia Prova. Constrúyelo con `attesterFromProvaClient(client, hashAction, operatorKeypair)`.'],
          ['`rules`', 'atesta todo', 'Predicado por nombre de acción — devuelve `false` para saltar una acción.'],
          ['`batch.maxSize`', '`25`', 'Flush inmediato al llegar a N items encolados (1–100 por transacción).'],
          ['`batch.flushDelayMs`', '`1000`', 'Debounce: flush N ms después de la última acción, así una ráfaga de tool calls cae en UNA transacción. `0` = atestar cada acción de inmediato.'],
          ['`onError`', 'warn por consola', 'Se llama si falla la atestación; la acción del agente nunca se ve afectada.'],
        ],
      },
      { kind: 'h2', text: 'Semántica del batching' },
      {
        kind: 'p',
        text: 'Los agentes multi-tool-calling disparan acciones en ráfagas. El batcher agrupa la ráfaga por debounce: espera `flushDelayMs` tras la última acción y envía todo en una transacción `record_attestations` (hasta 100). Al llegar a `maxSize` hace flush inmediato. `handle.flush()` fuerza el envío; `handle.stop()` hace un flush final garantizado — llámalo siempre al apagar.',
      },
      { kind: 'h2', text: 'Captura a nivel de wallet' },
      { kind: 'code', code: walletCode },
      { kind: 'h2', text: 'Qué se atesta' },
      {
        kind: 'table',
        headers: ['Fuente', 'Payload', 'Tipo de acción'],
        rows: [
          ['Handler de acción', 'Nombre de la acción + input + resultado (hasheado, nunca on-chain).', 'Mapeado desde el nombre de la acción (`ToolCall`, `Transaction`, …).'],
          ['`ProvaWallet`', 'La firma real de la transacción.', '`Transaction`.'],
        ],
      },
    ],
  },
};
