import type { LocalizedDoc } from './types';

// Bloques de código compartidos entre idiomas.
const installCode = `npm install prova-agent-sdk`;

const fiveLines = `import { ProvaClient } from 'prova-agent-sdk';

const client = new ProvaClient({ rpcUrl, agentKeypair });
const actionHash = await ProvaClient.hashAction(JSON.stringify(action));
const receipt = await client.attest({ operatorKeypair, actionHash });
console.log(receipt.explorerUrl); // sealed on Solana ✓`;

export const overview: LocalizedDoc = {
  EN: {
    title: 'Prova Documentation',
    intro:
      'Prova is a cryptographic attestation layer for AI agent behavior on Solana. Every action your agent performs — a swap, a tool call, an autonomous decision — is sealed on-chain as an immutable, independently verifiable receipt.',
    blocks: [
      { kind: 'h2', text: 'Why Prova' },
      {
        kind: 'p',
        text: 'AI agents operate as black boxes. Operator logs can be edited, deleted, or never written at all. Prova gives every agent action a tamper-proof, Ed25519-signed receipt on Solana — think `git blame` for AI agents.',
      },
      {
        kind: 'list',
        items: [
          'Verifiable: anyone can check a receipt on Solana without trusting your infrastructure.',
          'Cheap and fast: up to 100 attestations batched into a single transaction, sealed in under a second.',
          'Non-custodial: Prova never holds keys or funds. Your agent signs locally.',
          'Open source: SDKs and the on-chain program are Apache 2.0.',
        ],
      },
      { kind: 'h2', text: 'How it works' },
      {
        kind: 'list',
        items: [
          '1. Hash — the agent hashes the action payload locally (SHA-256). Raw payloads never touch the chain.',
          '2. Sign — the agent keypair signs the hash with Ed25519. The signature is verified natively by the Solana runtime.',
          '3. Seal — the Anchor program records the attestation and emits an `AttestationIssued` event, permanently anchored in the transaction.',
        ],
      },
      { kind: 'code', title: 'Five lines to your first receipt', code: fiveLines },
      { kind: 'h2', text: 'The stack' },
      {
        kind: 'table',
        headers: ['Component', 'What it does'],
        rows: [
          ['`prova-agent-sdk` (npm)', 'TypeScript SDK — register agents, issue and batch attestations, query the REST API.'],
          ['`prova-agent-kit` (npm)', 'Drop-in adapter for Solana Agent Kit v2 — attests every agent action automatically.'],
          ['`prova-agent-sdk` (crates.io)', 'Rust SDK with a fluent attestation builder.'],
          ['Anchor program', 'On-chain verification (Ed25519) and event emission on Solana Devnet.'],
          ['REST API', 'Indexed, queryable attestation data at `prova-api.fly.dev`.'],
          ['Forensic Explorer', 'In-browser verification of any agent or receipt at `theprova.xyz/explorer`.'],
        ],
      },
      { kind: 'h2', text: 'Where to go next' },
      {
        kind: 'list',
        items: [
          'Getting Started — register an agent and issue your first attestation in minutes.',
          'Core Concepts — the attestation lifecycle, the agent/operator model, and the storage model.',
          'TypeScript SDK — full `ProvaClient`, `AttestationBuilder`, and `ProvaApiClient` reference.',
          'REST API — every endpoint, auth model, and rate limits.',
        ],
      },
      { kind: 'code', title: 'Install', code: installCode },
    ],
  },
  ES: {
    title: 'Documentación de Prova',
    intro:
      'Prova es una capa de atestación criptográfica del comportamiento de agentes de IA sobre Solana. Cada acción que ejecuta tu agente — un swap, un tool call, una decisión autónoma — queda sellada on-chain como un recibo inmutable y verificable de forma independiente.',
    blocks: [
      { kind: 'h2', text: 'Por qué Prova' },
      {
        kind: 'p',
        text: 'Los agentes de IA operan como cajas negras. Los logs del operador pueden editarse, borrarse o nunca escribirse. Prova le da a cada acción un recibo a prueba de manipulación, firmado con Ed25519, en Solana — piensa en `git blame` para agentes de IA.',
      },
      {
        kind: 'list',
        items: [
          'Verificable: cualquiera puede comprobar un recibo en Solana sin confiar en tu infraestructura.',
          'Barato y rápido: hasta 100 atestaciones agrupadas en una sola transacción, selladas en menos de un segundo.',
          'Sin custodia: Prova nunca retiene claves ni fondos. Tu agente firma localmente.',
          'Código abierto: los SDKs y el programa on-chain son Apache 2.0.',
        ],
      },
      { kind: 'h2', text: 'Cómo funciona' },
      {
        kind: 'list',
        items: [
          '1. Hash — el agente hashea el payload de la acción localmente (SHA-256). El payload crudo nunca toca la cadena.',
          '2. Firma — la keypair del agente firma el hash con Ed25519. La firma la verifica nativamente el runtime de Solana.',
          '3. Sellado — el programa Anchor registra la atestación y emite un evento `AttestationIssued`, anclado permanentemente en la transacción.',
        ],
      },
      { kind: 'code', title: 'Cinco líneas hasta tu primer recibo', code: fiveLines },
      { kind: 'h2', text: 'El stack' },
      {
        kind: 'table',
        headers: ['Componente', 'Qué hace'],
        rows: [
          ['`prova-agent-sdk` (npm)', 'SDK TypeScript — registra agentes, emite y agrupa atestaciones, consulta la API REST.'],
          ['`prova-agent-kit` (npm)', 'Adapter drop-in para Solana Agent Kit v2 — atesta cada acción del agente automáticamente.'],
          ['`prova-agent-sdk` (crates.io)', 'SDK Rust con builder fluido de atestaciones.'],
          ['Programa Anchor', 'Verificación on-chain (Ed25519) y emisión de eventos en Solana Devnet.'],
          ['API REST', 'Datos de atestaciones indexados y consultables en `prova-api.fly.dev`.'],
          ['Forensic Explorer', 'Verificación en el navegador de cualquier agente o recibo en `theprova.xyz/explorer`.'],
        ],
      },
      { kind: 'h2', text: 'Siguientes pasos' },
      {
        kind: 'list',
        items: [
          'Primeros pasos — registra un agente y emite tu primera atestación en minutos.',
          'Conceptos clave — el ciclo de vida de la atestación, el modelo agente/operador y el modelo de almacenamiento.',
          'SDK TypeScript — referencia completa de `ProvaClient`, `AttestationBuilder` y `ProvaApiClient`.',
          'API REST — todos los endpoints, el modelo de auth y los límites de tasa.',
        ],
      },
      { kind: 'code', title: 'Instalar', code: installCode },
    ],
  },
};
