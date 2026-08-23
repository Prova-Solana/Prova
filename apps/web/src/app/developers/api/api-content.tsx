'use client';
import { Badge, Separator } from '@prova/ui';
import { useI18n } from '@/components/i18n-provider';
import { Globe, Server } from 'lucide-react';
import { ApiConsole } from './api-console';

const content = {
  EN: {
    tag: 'Reference',
    title: 'API & MCP Reference',
    desc: 'Integrate the Prova REST API into your backend, or use the Model Context Protocol (MCP) to let your LLM read attestations natively.',
    sections: {
      rest: {
        title: 'REST API',
        content: [
          'The REST API provides read-only access to the indexed Solana state. It is hosted on Fly.io and ensures 99.99% uptime.',
          '• Base URL: https://prova-api.fly.dev/api/v1',
          '• GET /attestations - List recent agent attestations (paginated)',
          '• GET /agents/:id - Retrieve specific agent metrics and policies',
          '• GET /health - Check indexer and RPC synchronization status'
        ]
      },
      mcp: {
        title: 'Model Context Protocol (MCP)',
        content: [
          'Prova provides an official MCP server (npm: prova-mcp-server). It lets Claude, Cursor, and any MCP-compatible client query verified on-chain attestations directly within their context window — Claude Code: claude mcp add prova -- npx -y prova-mcp-server.',
          'For Claude Desktop or Cursor, add the following to your MCP config (claude_desktop_config.json / .cursor/mcp.json):',
          '{\n  "mcpServers": {\n    "prova": {\n      "command": "npx",\n      "args": ["-y", "prova-mcp-server"]\n    }\n  }\n}',
          'This exposes 9 tools to your model — including `list_attestations`, `get_agent_stats` and `verify_action_hash` (recomputes the SHA-256 of a payload and matches it against the on-chain hash). Set PROVA_API_KEY in the env block to unlock the premium tools (`get_full_history`, `get_forensic_report`, `bulk_verify`). Full guide in the docs → MCP Server.'
        ]
      }
    }
  },
  ES: {
    tag: 'Referencia',
    title: 'Referencia API y MCP',
    desc: 'Integra la API REST de Prova en tu backend, o usa el Model Context Protocol (MCP) para que tu LLM lea atestaciones nativamente.',
    sections: {
      rest: {
        title: 'API REST',
        content: [
          'La API REST provee acceso de solo lectura al estado indexado de Solana. Está alojada en Fly.io y garantiza 99.99% de uptime.',
          '• Base URL: https://prova-api.fly.dev/api/v1',
          '• GET /attestations - Lista atestaciones recientes (paginado)',
          '• GET /agents/:id - Obtén métricas y políticas de un agente específico',
          '• GET /health - Revisa el estado de sincronización del indexador y RPC'
        ]
      },
      mcp: {
        title: 'Model Context Protocol (MCP)',
        content: [
          'Prova provee un servidor MCP oficial (npm: prova-mcp-server). Permite que Claude, Cursor y cualquier cliente compatible con MCP consulten atestaciones on-chain verificadas directamente en su ventana de contexto — Claude Code: claude mcp add prova -- npx -y prova-mcp-server.',
          'Para Claude Desktop o Cursor, agrega lo siguiente a tu config MCP (claude_desktop_config.json / .cursor/mcp.json):',
          '{\n  "mcpServers": {\n    "prova": {\n      "command": "npx",\n      "args": ["-y", "prova-mcp-server"]\n    }\n  }\n}',
          'Esto expone 9 herramientas a tu modelo — incluyendo `list_attestations`, `get_agent_stats` y `verify_action_hash` (recomputa el SHA-256 de un payload y lo compara con el hash on-chain). Define PROVA_API_KEY en el bloque env para desbloquear las tools premium (`get_full_history`, `get_forensic_report`, `bulk_verify`). Guía completa en docs → Servidor MCP.'
        ]
      }
    }
  },
};

export function ApiContent() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Badge variant="secondary" className="mb-4">{t.tag}</Badge>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">{t.title}</h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          {t.desc}
        </p>

        <Separator className="my-12 bg-border/50" />

        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display uppercase text-white">{t.sections.rest.title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {t.sections.rest.content.map((p, i) => (
                <p key={i} className={p.startsWith('•') ? "pl-6 font-mono text-sm text-primary/80" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          <ApiConsole />

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                <Server className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display uppercase text-white">{t.sections.mcp.title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {t.sections.mcp.content.map((p, i) => {
                if (p.startsWith('{')) {
                  return (
                    <div key={i} className="mt-4 overflow-x-auto border border-border bg-surface p-5">
                      <pre className="font-mono text-sm text-primary/90">{p}</pre>
                    </div>
                  );
                }
                return (
                  <p key={i} className={p.includes('`') ? "font-mono text-sm" : ""}>
                    {p}
                  </p>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
