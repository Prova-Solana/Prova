'use client';
import { ExternalLink } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

const content = {
  EN: {
    tag: 'SDK Reference',
    headline: ['Two clients.', 'One attestation layer.'],
    desc: 'prova-agent-sdk v0.1.7 ships two independent clients. ProvaClient writes receipts on-chain via Solana. ProvaApiClient queries the indexed data via REST — no wallet required.',
    install: 'npm install prova-agent-sdk',
    version: 'v0.1.7 · Apache 2.0 · Node 18+',
    packagesTitle: 'The package ecosystem',
    packagesDesc: 'Five open-source packages. Pick the one that matches how you build.',
    packages: [
      { name: 'prova-agent-sdk', reg: 'npm', tag: 'Core', desc: 'On-chain client + REST client + attestation builder. The foundation.', href: 'https://www.npmjs.com/package/prova-agent-sdk' },
      { name: 'prova-agent-kit', reg: 'npm', tag: 'Solana Agent Kit', desc: 'Drop-in adapter — attests every action of a Solana Agent Kit v2 agent.', href: 'https://www.npmjs.com/package/prova-agent-kit' },
      { name: 'prova-plugin-eliza', reg: 'npm', tag: 'elizaOS', desc: 'Plugin that wraps every elizaOS agent action with an on-chain receipt.', href: 'https://www.npmjs.com/package/prova-plugin-eliza' },
      { name: 'prova-mcp-server', reg: 'npm', tag: 'MCP', desc: 'Lets Claude, Cursor & any MCP client query verified attestations.', href: 'https://www.npmjs.com/package/prova-mcp-server' },
      { name: 'prova-agent-sdk', reg: 'crates.io', tag: 'Rust', desc: 'Full attestation lifecycle for Rust agents, with a fluent builder.', href: 'https://crates.io/crates/prova-agent-sdk' },
    ],
    clientATag: 'On-chain',
    clientATitle: 'ProvaClient',
    clientADesc: 'Signs each action hash and seals it on Solana via the Anchor program (native Ed25519, AttestationIssued event). Requires an agent keypair and an RPC URL.',
    clientBTag: 'REST API',
    clientBTitle: 'ProvaApiClient',
    clientBDesc: 'Queries the Prova indexer (Postgres-backed) over HTTP. Read-only. No wallet or Solana dependency.',
    constructorTitle: 'Constructor',
    methodsTitle: 'Methods',
    provaClientConstructor: `import { ProvaClient } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

const client = new ProvaClient({
  rpcUrl: 'https://devnet.helius-rpc.com/?api-key=...',
  agentKeypair: Keypair.fromSecretKey(secretKeyBytes),
});`,
    provaClientMethods: [
      {
        sig: 'attest(builder: AttestationBuilder): Promise<AttestationReceipt>',
        desc: 'Submits an attestation transaction to Solana. Returns the PDA address and transaction signature.',
      },
      {
        sig: 'verify(pda: string): Promise<{ valid: boolean; attestation?: ... }>',
        desc: 'Fetches the on-chain account and verifies the Ed25519 signature.',
      },
    ],
    builderTitle: 'AttestationBuilder helpers',
    builderMethods: [
      { sig: 'AttestationBuilder.transaction(txSig, metadata?)', desc: 'Wraps a Solana transaction signature.' },
      { sig: 'AttestationBuilder.toolCall(tool, params, metadata?)', desc: 'Records an LLM tool invocation.' },
      { sig: 'AttestationBuilder.decision(type, rationale, metadata?)', desc: 'Records an agent decision with rationale.' },
    ],
    apiClientConstructor: `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...',   // optional — required for premium endpoints
});`,
    apiClientMethods: [
      { sig: 'listAttestations(query?)', desc: 'Paginated list. Filter by agentPda, actionType, from/to dates.' },
      { sig: 'getAttestation(pda)', desc: 'Single attestation by PDA address.' },
      { sig: 'verifyAttestation(pda)', desc: 'Returns { valid, attestation?, error? } without throwing.' },
      { sig: 'getAgent(agentId)', desc: 'Agent profile: operator, registration date, attestation count.' },
      { sig: 'getAgentStats(agentId)', desc: 'Breakdown by action type + recent attestations.' },
      { sig: 'bulkVerify(ids[]) ⚡ premium', desc: 'Verify up to 1 000 attestation IDs in one call. Requires API key.' },
      { sig: 'getFullHistory(agentId) ⚡ premium', desc: 'Complete attestation history for an agent. Requires API key.' },
      { sig: 'getForensicReport(agentId) ⚡ premium', desc: 'PDF-ready summary with timeline. Requires API key.' },
    ],
    typesTitle: 'Key types',
    fullExampleTitle: 'Full example',
    fullExampleCode: `import { ProvaClient, ProvaApiClient, AttestationBuilder } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

// 1 — write on-chain
const client = new ProvaClient({
  rpcUrl: process.env.SOLANA_RPC_URL!,
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});

const receipt = await client.attest(
  AttestationBuilder.transaction(txSig, { operation: 'transfer', amount: 100 })
);

// 2 — query via REST
const api = new ProvaApiClient({
  apiUrl: process.env.PROVA_API_URL!,
  apiKey: process.env.PROVA_API_KEY,
});

const { valid } = await api.verifyAttestation(receipt.id);
console.log('Tamper-proof:', valid); // true`,
  },

  ES: {
    tag: 'Referencia del SDK',
    headline: ['Dos clientes.', 'Una capa de atestación.'],
    desc: 'prova-agent-sdk v0.1.7 incluye dos clientes independientes. ProvaClient escribe recibos on-chain en Solana. ProvaApiClient consulta los datos indexados mediante REST — sin wallet requerida.',
    install: 'npm install prova-agent-sdk',
    version: 'v0.1.7 · Apache 2.0 · Node 18+',
    packagesTitle: 'El ecosistema de paquetes',
    packagesDesc: 'Cinco paquetes open-source. Elige el que encaje con cómo construyes.',
    packages: [
      { name: 'prova-agent-sdk', reg: 'npm', tag: 'Core', desc: 'Cliente on-chain + cliente REST + builder de atestaciones. La base.', href: 'https://www.npmjs.com/package/prova-agent-sdk' },
      { name: 'prova-agent-kit', reg: 'npm', tag: 'Solana Agent Kit', desc: 'Adapter drop-in — atesta cada acción de un agente de Solana Agent Kit v2.', href: 'https://www.npmjs.com/package/prova-agent-kit' },
      { name: 'prova-plugin-eliza', reg: 'npm', tag: 'elizaOS', desc: 'Plugin que envuelve cada acción de un agente elizaOS con un recibo on-chain.', href: 'https://www.npmjs.com/package/prova-plugin-eliza' },
      { name: 'prova-mcp-server', reg: 'npm', tag: 'MCP', desc: 'Permite a Claude, Cursor y cualquier cliente MCP consultar atestaciones verificadas.', href: 'https://www.npmjs.com/package/prova-mcp-server' },
      { name: 'prova-agent-sdk', reg: 'crates.io', tag: 'Rust', desc: 'Ciclo de vida completo de atestación para agentes en Rust, con builder fluido.', href: 'https://crates.io/crates/prova-agent-sdk' },
    ],
    clientATag: 'On-chain',
    clientATitle: 'ProvaClient',
    clientADesc: 'Firma cada hash de acción y lo sella en Solana mediante el programa Anchor (Ed25519 nativo, evento AttestationIssued). Requiere un keypair del agente y una URL de RPC.',
    clientBTag: 'API REST',
    clientBTitle: 'ProvaApiClient',
    clientBDesc: 'Consulta el indexador de Prova (respaldado por Postgres) vía HTTP. Solo lectura. Sin dependencia de wallet ni Solana.',
    constructorTitle: 'Constructor',
    methodsTitle: 'Métodos',
    provaClientConstructor: `import { ProvaClient } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

const client = new ProvaClient({
  rpcUrl: 'https://devnet.helius-rpc.com/?api-key=...',
  agentKeypair: Keypair.fromSecretKey(secretKeyBytes),
});`,
    provaClientMethods: [
      {
        sig: 'attest(builder: AttestationBuilder): Promise<AttestationReceipt>',
        desc: 'Envía la transacción de atestación a Solana. Devuelve la dirección PDA y la firma de la transacción.',
      },
      {
        sig: 'verify(pda: string): Promise<{ valid: boolean; attestation?: ... }>',
        desc: 'Obtiene la cuenta on-chain y verifica la firma Ed25519.',
      },
    ],
    builderTitle: 'Helpers de AttestationBuilder',
    builderMethods: [
      { sig: 'AttestationBuilder.transaction(txSig, metadata?)', desc: 'Envuelve una firma de transacción de Solana.' },
      { sig: 'AttestationBuilder.toolCall(tool, params, metadata?)', desc: 'Registra una invocación de herramienta LLM.' },
      { sig: 'AttestationBuilder.decision(type, rationale, metadata?)', desc: 'Registra una decisión del agente con justificación.' },
    ],
    apiClientConstructor: `import { ProvaApiClient } from 'prova-agent-sdk';

const api = new ProvaApiClient({
  apiUrl: 'https://prova-api.fly.dev',
  apiKey: 'prova_...',   // opcional — requerido para endpoints premium
});`,
    apiClientMethods: [
      { sig: 'listAttestations(query?)', desc: 'Lista paginada. Filtra por agentPda, actionType, fechas from/to.' },
      { sig: 'getAttestation(pda)', desc: 'Atestación individual por dirección PDA.' },
      { sig: 'verifyAttestation(pda)', desc: 'Devuelve { valid, attestation?, error? } sin lanzar excepciones.' },
      { sig: 'getAgent(agentId)', desc: 'Perfil del agente: operador, fecha de registro, conteo de atestaciones.' },
      { sig: 'getAgentStats(agentId)', desc: 'Desglose por tipo de acción + atestaciones recientes.' },
      { sig: 'bulkVerify(ids[]) ⚡ premium', desc: 'Verifica hasta 1 000 IDs en una sola llamada. Requiere API key.' },
      { sig: 'getFullHistory(agentId) ⚡ premium', desc: 'Historial completo de atestaciones de un agente. Requiere API key.' },
      { sig: 'getForensicReport(agentId) ⚡ premium', desc: 'Resumen listo para PDF con línea de tiempo. Requiere API key.' },
    ],
    typesTitle: 'Tipos principales',
    fullExampleTitle: 'Ejemplo completo',
    fullExampleCode: `import { ProvaClient, ProvaApiClient, AttestationBuilder } from 'prova-agent-sdk';
import { Keypair } from '@solana/web3.js';

// 1 — escribir on-chain
const client = new ProvaClient({
  rpcUrl: process.env.SOLANA_RPC_URL!,
  agentKeypair: Keypair.fromSecretKey(agentSecretKey),
});

const receipt = await client.attest(
  AttestationBuilder.transaction(txSig, { operation: 'transfer', amount: 100 })
);

// 2 — consultar mediante REST
const api = new ProvaApiClient({
  apiUrl: process.env.PROVA_API_URL!,
  apiKey: process.env.PROVA_API_KEY,
});

const { valid } = await api.verifyAttestation(receipt.id);
console.log('A prueba de manipulación:', valid); // true`,
  },

};

const TYPES_EN = `// Returned by attest()
interface AttestationReceipt {
  id: string;          // PDA address on Solana
  txSignature: string; // Solana transaction signature
}

// Returned by listAttestations()
interface AttestationResponse {
  pda: string;
  agentPda: string;
  actionType: string;
  actionHash: string;
  timestamp: string;   // ISO 8601
  blockHeight: number;
  privacyMode: boolean;
  signature: string;
  schemaVersion: number;
}

// Returned by getAgentStats()
interface AgentStatsResponse {
  agent: AgentResponse;
  totalAttestations: number;
  byType: Record<string, number>;
  recentAttestations: AttestationResponse[];
}`;

export function SdksContent() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">{t.headline[0]}</span>
              <span className="mt-1 block text-muted-foreground">{t.headline[1]}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.desc}</p>
            <div className="mt-8 border border-border bg-surface p-4">
              <pre className="font-mono text-xs sm:text-sm text-primary/90">{t.install}</pre>
              <a
                href="https://www.npmjs.com/package/prova-agent-sdk"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary"
              >
                {t.version}
                <ExternalLink className="h-2.5 w-2.5 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Package ecosystem */}
        <section className="mt-20">
          <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.packagesTitle}</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{t.packagesDesc}</p>
          <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {t.packages.map((p) => (
              <a
                key={`${p.name}-${p.reg}`}
                href={p.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex flex-col bg-background p-6 transition-colors hover:bg-surface"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-pixel text-[10px] uppercase tracking-wider text-primary">{p.tag}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{p.reg}</span>
                </div>
                <code className="mt-3 flex items-center gap-1.5 font-mono text-sm text-foreground group-hover:text-primary">
                  {p.name}
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                </code>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* ProvaClient */}
        <section className="mt-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">{t.clientATag}</p>
              <h2 className="mt-2 font-display text-2xl uppercase text-foreground sm:text-3xl">{t.clientATitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.clientADesc}</p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.constructorTitle}</p>
                <div className="mt-3 overflow-x-auto border border-border bg-surface p-5">
                  <pre className="font-mono text-sm leading-relaxed text-primary/90">{t.provaClientConstructor}</pre>
                </div>
              </div>
              <div>
                <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.methodsTitle}</p>
                <ul className="mt-3 border-t border-border">
                  {t.provaClientMethods.map((m) => (
                    <li key={m.sig} className="border-b border-border py-4">
                      <code className="font-mono text-xs text-primary">{m.sig}</code>
                      <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.builderTitle}</p>
                <ul className="mt-3 border-t border-border">
                  {t.builderMethods.map((m) => (
                    <li key={m.sig} className="border-b border-border py-4">
                      <code className="font-mono text-xs text-primary">{m.sig}</code>
                      <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mt-20 border-t border-border" />

        {/* ProvaApiClient */}
        <section className="mt-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="font-pixel text-[11px] uppercase tracking-wider text-primary">{t.clientBTag}</p>
              <h2 className="mt-2 font-display text-2xl uppercase text-foreground sm:text-3xl">{t.clientBTitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.clientBDesc}</p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.constructorTitle}</p>
                <div className="mt-3 overflow-x-auto border border-border bg-surface p-5">
                  <pre className="font-mono text-sm leading-relaxed text-primary/90">{t.apiClientConstructor}</pre>
                </div>
              </div>
              <div>
                <p className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{t.methodsTitle}</p>
                <ul className="mt-3 border-t border-border">
                  {t.apiClientMethods.map((m) => (
                    <li key={m.sig} className="border-b border-border py-4">
                      <code className="font-mono text-xs text-primary">{m.sig}</code>
                      <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mt-20 border-t border-border" />

        {/* Types + Full Example */}
        <section className="mt-20 grid gap-px bg-border border border-border md:grid-cols-2">
          <div className="bg-background p-8">
            <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.typesTitle}</p>
            <div className="mt-4 overflow-x-auto border border-border bg-surface p-5">
              <pre className="font-mono text-xs leading-relaxed text-primary/80">{TYPES_EN}</pre>
            </div>
          </div>
          <div className="bg-background p-8">
            <p className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.fullExampleTitle}</p>
            <div className="mt-4 overflow-x-auto border border-border bg-surface p-5">
              <pre className="font-mono text-xs leading-relaxed text-primary/80">{t.fullExampleCode}</pre>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
