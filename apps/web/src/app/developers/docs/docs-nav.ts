// Estructura de navegación de la documentación. Fuente única para el sidebar,
// el prev/next y generateStaticParams del route dinámico.

export type DocsLang = 'EN' | 'ES';

export interface DocsNavItem {
  /** Slug de la ruta. '' es la página índice (/developers/docs). */
  slug: string;
  titles: Record<DocsLang, string>;
}

export interface DocsNavGroup {
  labels: Record<DocsLang, string>;
  items: DocsNavItem[];
}

export const DOCS_BASE = '/developers/docs';

export const docsNav: DocsNavGroup[] = [
  {
    labels: { EN: 'Start', ES: 'Empieza' },
    items: [
      { slug: '', titles: { EN: 'Overview', ES: 'Visión general' } },
      {
        slug: 'getting-started',
        titles: { EN: 'Getting Started', ES: 'Primeros pasos' },
      },
    ],
  },
  {
    labels: { EN: 'Concepts', ES: 'Conceptos' },
    items: [
      {
        slug: 'core-concepts',
        titles: { EN: 'Core Concepts', ES: 'Conceptos clave' },
      },
    ],
  },
  {
    labels: { EN: 'SDKs', ES: 'SDKs' },
    items: [
      { slug: 'sdk-typescript', titles: { EN: 'TypeScript SDK', ES: 'SDK TypeScript' } },
      { slug: 'agent-kit', titles: { EN: 'Agent Kit Adapter', ES: 'Adapter Agent Kit' } },
      { slug: 'plugin-eliza', titles: { EN: 'elizaOS Plugin', ES: 'Plugin elizaOS' } },
      { slug: 'sdk-rust', titles: { EN: 'Rust SDK', ES: 'SDK Rust' } },
      { slug: 'mcp-server', titles: { EN: 'MCP Server', ES: 'Servidor MCP' } },
    ],
  },
  {
    labels: { EN: 'Reference', ES: 'Referencia' },
    items: [
      { slug: 'api-reference', titles: { EN: 'REST API', ES: 'API REST' } },
      { slug: 'program', titles: { EN: 'On-chain Program', ES: 'Programa on-chain' } },
    ],
  },
];

/** Lista plana en orden de lectura (para prev/next y static params). */
export const docsFlat: DocsNavItem[] = docsNav.flatMap((g) => g.items);

export function docHref(slug: string): string {
  return slug === '' ? DOCS_BASE : `${DOCS_BASE}/${slug}`;
}
