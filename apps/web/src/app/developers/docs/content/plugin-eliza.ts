import type { LocalizedDoc } from './types';

const installCode = `npm install prova-plugin-eliza prova-agent-sdk`;

const quickStartCode = `import { provaPlugin, attesterFromProvaClient } from 'prova-plugin-eliza';
import { ProvaClient } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

const prova = new ProvaClient({
  rpcUrl: process.env.PROVA_RPC_URL!,
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});

const attester = attesterFromProvaClient(
  prova,
  ProvaClient.hashAction,
  operatorKeypair,
);

// Add to your runtime's plugins:
const runtime = new AgentRuntime({
  plugins: [provaPlugin({ attester })],
  // ...other character configuration...
});`;

const shutdownCode = `import { createProvaPlugin } from 'prova-plugin-eliza';

const { plugin, flush, stop } = createProvaPlugin({ attester });
// plugins: [plugin] ...
await stop(); // guaranteed final flush when the agent shuts down`;

export const pluginEliza: LocalizedDoc = {
  EN: {
    title: 'elizaOS Plugin',
    intro:
      '`prova-plugin-eliza` is the official plugin to connect Prova with elizaOS agents. Every action executed by your character gets a verifiable, Ed25519-signed receipt on Solana without touching your agent logic.',
    blocks: [
      { kind: 'h2', text: 'How it works' },
      {
        kind: 'list',
        items: [
          'On initialization, the plugin intercepts the handler of every registered character action and hooks the runtime actions pipeline.',
          'After each handler resolves, the plugin hashes the action name, message content, and result (SHA-256) and queues the attestation.',
          'Attestations are automatically batched using a debouncer, writing up to 100 receipts in a single transaction to eliminate rent costs.',
          'The plugin works off-chain with structural typing, ensuring it never imports `@elizaos/core` directly to stay lightweight and compatible across versions.',
        ],
      },
      { kind: 'h2', text: 'Install' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: 'Quick start' },
      { kind: 'code', code: quickStartCode },
      { kind: 'h2', text: 'Shutdown control' },
      { kind: 'code', code: shutdownCode },
      { kind: 'h2', text: 'Options' },
      {
        kind: 'table',
        headers: ['Option', 'Default', 'Description'],
        rows: [
          ['`attester`', '—', 'Bridge to Prova. Build it with `attesterFromProvaClient(client, hashAction, operatorKeypair)`.'],
          ['`rules`', 'attest all', 'Predicate filter by action name — return `false` to skip attesting that action.'],
          ['`batch.maxSize`', '`25`', 'Flushes immediately when the queue reaches N items (1–100).'],
          ['`batch.flushDelayMs`', '`1000`', 'Debounce time in milliseconds. Buffers bursts of actions into a single transaction.'],
          ['`onError`', 'console warn', 'Fallback hook on attestation failure; the agent\'s action itself is unaffected.'],
        ],
      },
    ],
  },
  ES: {
    title: 'Plugin elizaOS',
    intro:
      '`prova-plugin-eliza` es el plugin oficial para conectar Prova con agentes de elizaOS. Cada acción ejecutada por tu personaje recibe un recibo firmado por Ed25519 en Solana sin alterar la lógica de tu agente.',
    blocks: [
      { kind: 'h2', text: 'Cómo funciona' },
      {
        kind: 'list',
        items: [
          'Al inicializarse, el plugin intercepta el handler de cada acción registrada del personaje y se conecta a la tubería de acciones de ejecución.',
          'Al resolverse el handler, construye un payload con el nombre de la acción, mensaje e input, lo hashea (SHA-256) y encola la atestación.',
          'Las atestaciones se agrupan en batches por un debouncer, escribiendo hasta 100 recibos en una sola transacción para eliminar costes de rent.',
          'El plugin funciona mediante tipado estructural sin importar `@elizaos/core` directamente, lo que garantiza ligereza y compatibilidad entre versiones.',
        ],
      },
      { kind: 'h2', text: 'Instalar' },
      { kind: 'code', code: installCode },
      { kind: 'h2', text: 'Inicio rápido' },
      { kind: 'code', code: quickStartCode },
      { kind: 'h2', text: 'Control de apagado' },
      { kind: 'code', code: shutdownCode },
      { kind: 'h2', text: 'Opciones' },
      {
        kind: 'table',
        headers: ['Opción', 'Predeterminado', 'Descripción'],
        rows: [
          ['`attester`', '—', 'Puente hacia Prova. Constrúyelo con `attesterFromProvaClient(client, hashAction, operatorKeypair)`.'],
          ['`rules`', 'atesta todo', 'Predicado de filtrado por nombre de acción — devuelve `false` para omitir.'],
          ['`batch.maxSize`', '`25`', 'Flush inmediato al llegar a N items encolados (1–100).'],
          ['`batch.flushDelayMs`', '`1000`', 'Tiempo de debounce en milisegundos. Agrupa ráfagas de acciones en una sola transacción.'],
          ['`onError`', 'warn por consola', 'Se llama si falla la atestación; la acción del agente nunca se ve afectada.'],
        ],
      },
    ],
  },
};
