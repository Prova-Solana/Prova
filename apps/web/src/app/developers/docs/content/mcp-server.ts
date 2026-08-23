import type { LocalizedDoc } from './types';

const claudeCodeCode = `claude mcp add prova -- npx -y prova-mcp-server`;

const jsonConfigCode = `{
  "mcpServers": {
    "prova": {
      "command": "npx",
      "args": ["-y", "prova-mcp-server"]
    }
  }
}`;

const envConfigCode = `{
  "mcpServers": {
    "prova": {
      "command": "npx",
      "args": ["-y", "prova-mcp-server"],
      "env": {
        "PROVA_API_KEY": "prova_...",
        "PROVA_API_URL": "https://prova-api.fly.dev"
      }
    }
  }
}`;

export const mcpServer: LocalizedDoc = {
  EN: {
    title: 'MCP Server',
    intro:
      'The official Prova MCP server (`prova-mcp-server`) connects Claude, Cursor, and any Model Context Protocol client to the attestation layer. Your assistant can ask "what did agent X do on Tuesday?" and get verifiable on-chain answers — no explorer tab needed.',
    blocks: [
      { kind: 'h2', text: 'What it is' },
      {
        kind: 'p',
        text: 'A read-only MCP server over stdio. It queries the public Prova REST API (the indexed projection of the on-chain program) and verifies hashes locally. It never holds keys, never signs, never moves funds. Node.js 18+ is the only requirement — `npx` handles the rest.',
      },
      { kind: 'h2', text: 'Setup' },
      { kind: 'h3', text: 'Claude Code' },
      { kind: 'code', code: claudeCodeCode },
      { kind: 'h3', text: 'Claude Desktop' },
      {
        kind: 'p',
        text: 'Add to `claude_desktop_config.json` (Settings → Developer → Edit Config):',
      },
      { kind: 'code', code: jsonConfigCode },
      { kind: 'h3', text: 'Cursor' },
      {
        kind: 'p',
        text: 'Add the same block to `.cursor/mcp.json` (per project) or `~/.cursor/mcp.json` (global). Any other MCP-compatible client works identically — the server speaks standard MCP over stdio.',
      },
      { kind: 'h2', text: 'Tools' },
      {
        kind: 'table',
        headers: ['Tool', 'What it answers'],
        rows: [
          ['`get_stats`', '"How many agents and attestations does the network have?"'],
          ['`list_attestations`', '"What did agent X do this week?" — filters by agent, action type, date range.'],
          ['`get_attestation`', '"Show me receipt Y" — hash, type, signature, timestamp.'],
          ['`get_agent`', '"Who operates agent X? Is it revoked?"'],
          ['`get_agent_stats`', '"What does this agent do most — swaps or tool calls?"'],
          ['`verify_action_hash`', '"Does this payload match the on-chain receipt?" — recomputes SHA-256 locally and compares.'],
          ['`get_full_history`', 'Premium: complete history, up to 1000 receipts.'],
          ['`get_forensic_report`', 'Premium: structured report for audits/compliance.'],
          ['`bulk_verify`', 'Premium: verify up to 1000 receipt PDAs at once.'],
        ],
      },
      { kind: 'h2', text: 'Configuration' },
      {
        kind: 'table',
        headers: ['Env variable', 'Default', 'Purpose'],
        rows: [
          ['`PROVA_API_URL`', '`https://prova-api.fly.dev`', 'Prova REST API base URL.'],
          ['`PROVA_API_KEY`', '—', 'Optional `prova_…` key. Unlocks the three premium tools. Generate at `theprova.xyz/app/api-keys`.'],
        ],
      },
      { kind: 'code', title: 'With premium key', code: envConfigCode },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Without a key, the six public tools work fully. The premium tools respond with a clear setup instruction instead of failing silently.',
      },
      { kind: 'h2', text: 'Why this matters' },
      {
        kind: 'p',
        text: 'LLMs answering questions about agent behavior usually rely on the operator\'s logs — exactly the thing Prova distrusts by design. With MCP, the model reads the cryptographic record: every answer can cite an on-chain transaction anyone can check.',
      },
    ],
  },
  ES: {
    title: 'Servidor MCP',
    intro:
      'El servidor MCP oficial de Prova (`prova-mcp-server`) conecta Claude, Cursor y cualquier cliente de Model Context Protocol con la capa de atestaciones. Tu asistente puede preguntar "¿qué hizo el agente X el martes?" y recibir respuestas on-chain verificables — sin abrir el explorer.',
    blocks: [
      { kind: 'h2', text: 'Qué es' },
      {
        kind: 'p',
        text: 'Un servidor MCP de solo lectura sobre stdio. Consulta la API REST pública de Prova (la proyección indexada del programa on-chain) y verifica hashes localmente. Nunca retiene claves, nunca firma, nunca mueve fondos. Solo requiere Node.js 18+ — `npx` hace el resto.',
      },
      { kind: 'h2', text: 'Configuración' },
      { kind: 'h3', text: 'Claude Code' },
      { kind: 'code', code: claudeCodeCode },
      { kind: 'h3', text: 'Claude Desktop' },
      {
        kind: 'p',
        text: 'Agrega a `claude_desktop_config.json` (Settings → Developer → Edit Config):',
      },
      { kind: 'code', code: jsonConfigCode },
      { kind: 'h3', text: 'Cursor' },
      {
        kind: 'p',
        text: 'Agrega el mismo bloque a `.cursor/mcp.json` (por proyecto) o `~/.cursor/mcp.json` (global). Cualquier otro cliente compatible con MCP funciona igual — el servidor habla MCP estándar por stdio.',
      },
      { kind: 'h2', text: 'Tools' },
      {
        kind: 'table',
        headers: ['Tool', 'Qué responde'],
        rows: [
          ['`get_stats`', '"¿Cuántos agentes y atestaciones tiene la red?"'],
          ['`list_attestations`', '"¿Qué hizo el agente X esta semana?" — filtra por agente, tipo de acción y rango de fechas.'],
          ['`get_attestation`', '"Muéstrame el recibo Y" — hash, tipo, firma, timestamp.'],
          ['`get_agent`', '"¿Quién opera el agente X? ¿Está revocado?"'],
          ['`get_agent_stats`', '"¿Qué hace más este agente — swaps o tool calls?"'],
          ['`verify_action_hash`', '"¿Este payload corresponde al recibo on-chain?" — recomputa el SHA-256 localmente y compara.'],
          ['`get_full_history`', 'Premium: historial completo, hasta 1000 recibos.'],
          ['`get_forensic_report`', 'Premium: reporte estructurado para auditorías/compliance.'],
          ['`bulk_verify`', 'Premium: verifica hasta 1000 PDAs de recibos de una vez.'],
        ],
      },
      { kind: 'h2', text: 'Variables de entorno' },
      {
        kind: 'table',
        headers: ['Variable', 'Default', 'Propósito'],
        rows: [
          ['`PROVA_API_URL`', '`https://prova-api.fly.dev`', 'URL base de la API REST de Prova.'],
          ['`PROVA_API_KEY`', '—', 'Key `prova_…` opcional. Desbloquea las tres tools premium. Genérala en `theprova.xyz/app/api-keys`.'],
        ],
      },
      { kind: 'code', title: 'Con key premium', code: envConfigCode },
      {
        kind: 'callout',
        tone: 'info',
        text: 'Sin key, las seis tools públicas funcionan al completo. Las premium responden con una instrucción clara de configuración en vez de fallar en silencio.',
      },
      { kind: 'h2', text: 'Por qué importa' },
      {
        kind: 'p',
        text: 'Los LLMs que responden sobre el comportamiento de agentes suelen apoyarse en los logs del operador — justo aquello de lo que Prova desconfía por diseño. Con MCP, el modelo lee el registro criptográfico: cada respuesta puede citar una transacción on-chain que cualquiera puede comprobar.',
      },
    ],
  },
};
