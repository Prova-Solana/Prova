import type { LocalizedDoc } from './types';

const pdaCode = `// PDA seed: "prova_agent" + operator public key
const [agentPda] = PublicKey.findProgramAddressSync(
  [Buffer.from('prova_agent'), operator.toBuffer()],
  PROVA_PROGRAM_ID
);`;

const builderCode = `import { AttestationBuilder } from 'prova-agent-sdk';

// Factory methods produce consistent, typed payloads per action type:
AttestationBuilder.transaction(txSignature);
AttestationBuilder.toolCall('jupiter_swap', { inputMint, outputMint });
AttestationBuilder.modelInvocation('claude-fable-5', promptHash);
AttestationBuilder.decision('rebalance', 'drift > 5%');
AttestationBuilder.resourceAccess('https://api.example.com', 'GET');
AttestationBuilder.policyCheck('max-slippage', 'pass');
AttestationBuilder.custom({ anything: true });`;

export const coreConcepts: LocalizedDoc = {
  EN: {
    title: 'Core Concepts',
    intro:
      'What an attestation actually is, who signs what, what lands on-chain, and how the indexed layer relates to the chain. Five minutes here saves hours later.',
    blocks: [
      { kind: 'h2', text: 'Anatomy of an attestation' },
      {
        kind: 'p',
        text: 'An attestation is a minimal cryptographic commitment to an action. It contains:',
      },
      {
        kind: 'table',
        headers: ['Field', 'Description'],
        rows: [
          ['`action_hash`', '32-byte SHA-256 of the structured action payload. Deterministic and recomputable by anyone holding the payload.'],
          ['Ed25519 signature', 'The agent keypair signs the hash. Verified natively by Solana via the Ed25519 precompile before the instruction executes.'],
          ['`action_type`', 'One of 7 categories (see below) so receipts are filterable and analyzable.'],
          ['Timestamp + slot', 'When the attestation was sealed, anchored by Solana consensus.'],
          ['`privacy_mode`', 'Flag: when true, only the hash is public; the payload stays with the operator (selective disclosure).'],
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Raw payloads never touch the chain — only their hash. You choose what to disclose and to whom; the chain proves the action existed and was signed at that moment.',
      },
      { kind: 'h2', text: 'Agent vs. Operator' },
      {
        kind: 'p',
        text: 'Prova separates the acting identity from the accountable identity. The agent keypair belongs to the AI process: it signs each action hash off-chain. The operator keypair belongs to the team running the agent: it registers the agent, pays transaction fees, and can revoke the agent or update its policy root.',
      },
      {
        kind: 'p',
        text: 'Each operator gets one agent account — a PDA (Program Derived Address) storing the agent ID, an optional policy Merkle root, the attestation counter, and a revoked flag:',
      },
      { kind: 'code', code: pdaCode },
      { kind: 'h2', text: 'Action types' },
      {
        kind: 'table',
        headers: ['Type', 'Use for'],
        rows: [
          ['`Transaction`', 'On-chain actions: swaps, transfers, LP operations.'],
          ['`ToolCall`', 'The agent invoked a tool / external function.'],
          ['`ModelInvocation`', 'An LLM call (model + prompt hash).'],
          ['`Decision`', 'An autonomous decision with its rationale.'],
          ['`ResourceAccess`', 'The agent read or wrote an external resource / API.'],
          ['`PolicyCheck`', 'A policy evaluation with pass/fail result.'],
          ['`Custom`', 'Anything else — bring your own schema.'],
        ],
      },
      { kind: 'code', title: 'Typed payloads with AttestationBuilder', code: builderCode },
      { kind: 'h2', text: 'Storage model: events + indexer' },
      {
        kind: 'p',
        text: 'Prova does not create one account per attestation. Storing every receipt in account state would cost rent per receipt and would not scale to thousands of actions per day. Instead, the program verifies the Ed25519 signature and emits an `AttestationIssued` Anchor event — the cryptographic commitment is permanently anchored in the transaction.',
      },
      {
        kind: 'p',
        text: 'A WebSocket indexer captures these events with `finalized` commitment and projects them into Postgres for efficient querying (filters, pagination, stats) through the REST API. The database is a derived view, 100% reconstructible by re-scanning the chain — the chain remains the single source of truth.',
      },
      {
        kind: 'table',
        headers: ['Layer', 'Holds', 'Guarantees'],
        rows: [
          ['On-chain (Solana)', 'Hash, signature, type, timestamp — inside the tx and its events.', 'Immutability, ordering, independent verification.'],
          ['Off-chain (Postgres)', 'Indexed projection of the same events.', 'Fast queries. Reconstructible; never authoritative.'],
        ],
      },
      { kind: 'h2', text: 'Privacy mode (Vanish)' },
      {
        kind: 'p',
        text: 'With `privacyMode: true`, the receipt proves an action happened — signed, typed, timestamped — while the payload remains off-chain with the operator. To disclose selectively (e.g. to an auditor), share the payload: anyone can recompute the SHA-256 and match it against the on-chain hash.',
      },
      { kind: 'h2', text: 'Trust model' },
      {
        kind: 'list',
        items: [
          'Prova never custodies keys or funds; all signing happens on your side.',
          'Verification does not require Prova: the receipt is verifiable with any Solana RPC and standard tooling.',
          'The program and SDKs are open source (Apache 2.0), so the whole pipeline is auditable.',
        ],
      },
    ],
  },
  ES: {
    title: 'Conceptos clave',
    intro:
      'Qué es exactamente una atestación, quién firma qué, qué queda on-chain y cómo se relaciona la capa indexada con la cadena. Cinco minutos aquí ahorran horas después.',
    blocks: [
      { kind: 'h2', text: 'Anatomía de una atestación' },
      {
        kind: 'p',
        text: 'Una atestación es un compromiso criptográfico mínimo sobre una acción. Contiene:',
      },
      {
        kind: 'table',
        headers: ['Campo', 'Descripción'],
        rows: [
          ['`action_hash`', 'SHA-256 de 32 bytes del payload estructurado de la acción. Determinista y recomputable por cualquiera que tenga el payload.'],
          ['Firma Ed25519', 'La keypair del agente firma el hash. Solana la verifica nativamente vía el precompilado Ed25519 antes de ejecutar la instrucción.'],
          ['`action_type`', 'Una de 7 categorías (abajo) para que los recibos sean filtrables y analizables.'],
          ['Timestamp + slot', 'Cuándo se selló la atestación, anclado por el consenso de Solana.'],
          ['`privacy_mode`', 'Flag: en true solo el hash es público; el payload queda con el operador (selective disclosure).'],
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Los payloads crudos nunca tocan la cadena — solo su hash. Tú eliges qué revelar y a quién; la cadena prueba que la acción existió y fue firmada en ese momento.',
      },
      { kind: 'h2', text: 'Agente vs. Operador' },
      {
        kind: 'p',
        text: 'Prova separa la identidad que actúa de la identidad responsable. La keypair del agente pertenece al proceso de IA: firma cada hash de acción off-chain. La keypair del operador pertenece al equipo que corre el agente: registra al agente, paga los fees y puede revocarlo o actualizar su policy root.',
      },
      {
        kind: 'p',
        text: 'Cada operador tiene una cuenta de agente — una PDA (Program Derived Address) que almacena el ID del agente, una raíz Merkle de política opcional, el contador de atestaciones y un flag de revocación:',
      },
      { kind: 'code', code: pdaCode },
      { kind: 'h2', text: 'Tipos de acción' },
      {
        kind: 'table',
        headers: ['Tipo', 'Úsalo para'],
        rows: [
          ['`Transaction`', 'Acciones on-chain: swaps, transferencias, operaciones de LP.'],
          ['`ToolCall`', 'El agente invocó una tool / función externa.'],
          ['`ModelInvocation`', 'Una llamada a un LLM (modelo + hash del prompt).'],
          ['`Decision`', 'Una decisión autónoma con su justificación.'],
          ['`ResourceAccess`', 'El agente leyó o escribió un recurso / API externo.'],
          ['`PolicyCheck`', 'Una evaluación de política con resultado pass/fail.'],
          ['`Custom`', 'Cualquier otra cosa — trae tu propio schema.'],
        ],
      },
      { kind: 'code', title: 'Payloads tipados con AttestationBuilder', code: builderCode },
      { kind: 'h2', text: 'Modelo de almacenamiento: eventos + indexer' },
      {
        kind: 'p',
        text: 'Prova no crea una cuenta por atestación. Almacenar cada recibo en estado de cuenta costaría rent por recibo y no escalaría a miles de acciones al día. En su lugar, el programa verifica la firma Ed25519 y emite un evento Anchor `AttestationIssued` — el compromiso criptográfico queda anclado permanentemente en la transacción.',
      },
      {
        kind: 'p',
        text: 'Un indexer WebSocket captura estos eventos con commitment `finalized` y los proyecta a Postgres para consultas eficientes (filtros, paginación, stats) a través de la API REST. La base de datos es una vista derivada, 100% reconstruible re-escaneando la cadena — la cadena sigue siendo la única fuente de verdad.',
      },
      {
        kind: 'table',
        headers: ['Capa', 'Contiene', 'Garantiza'],
        rows: [
          ['On-chain (Solana)', 'Hash, firma, tipo, timestamp — en la tx y sus eventos.', 'Inmutabilidad, orden, verificación independiente.'],
          ['Off-chain (Postgres)', 'Proyección indexada de los mismos eventos.', 'Consultas rápidas. Reconstruible; nunca autoritativa.'],
        ],
      },
      { kind: 'h2', text: 'Privacy mode (Vanish)' },
      {
        kind: 'p',
        text: 'Con `privacyMode: true`, el recibo prueba que una acción ocurrió — firmada, tipada, con timestamp — mientras el payload queda off-chain con el operador. Para revelar selectivamente (p. ej. a un auditor), comparte el payload: cualquiera puede recomputar el SHA-256 y compararlo con el hash on-chain.',
      },
      { kind: 'h2', text: 'Modelo de confianza' },
      {
        kind: 'list',
        items: [
          'Prova nunca custodia claves ni fondos; toda firma ocurre de tu lado.',
          'La verificación no requiere a Prova: el recibo es verificable con cualquier RPC de Solana y tooling estándar.',
          'El programa y los SDKs son código abierto (Apache 2.0), así que todo el pipeline es auditable.',
        ],
      },
    ],
  },
};
