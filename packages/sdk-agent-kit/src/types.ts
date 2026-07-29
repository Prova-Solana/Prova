// Tipos del adapter. Reflejamos estructuralmente la API pública de Solana Agent
// Kit v2 (BaseWallet, Action, SolanaAgentKit) para NO importar el paquete y
// mantener el adapter como peerDependency ligera. La compatibilidad se apoya en
// el tipado estructural de TypeScript.

/** Resultado típico del handler de una acción de SAK. */
export type ActionResult = Record<string, unknown>;

/**
 * Acción de Solana Agent Kit (subconjunto que el adapter necesita).
 * `handler` usa `any` en los parámetros a propósito: el `Action` real de SAK es
 * una interfaz cerrada con tipos concretos de agente/input, y solo `any` permite
 * que ese tipo cerrado sea asignable a `HostAction` SIN que el integrador tenga
 * que castear (`as never`). Sin index signature — bloqueaba pasar el `Action`
 * cerrado de SAK (hallazgo reportado por un integrador real, jul-2026).
 */
export interface HostAction {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- límite estructural con el Action cerrado de SAK
  handler: (agent: any, input: any) => Promise<ActionResult>;
}

/** Agente de Solana Agent Kit (subconjunto que el adapter necesita). */
export interface HostAgent {
  actions: HostAction[];
}

/**
 * BaseWallet de Solana Agent Kit v2, en forma estructural.
 * Los métodos de transacción son NO genéricos a propósito: el `BaseWallet` real
 * usa `signTransaction<T extends Transaction | VersionedTransaction>`, y un
 * genérico restringido no es asignable a uno sin restringir — declarar genéricos
 * aquí obligaba al integrador a castear (`as never`). Con parámetros `unknown` y
 * retorno `any`, un `KeypairWallet` real encaja sin cast en ambas direcciones.
 */
export interface HostWallet {
  readonly publicKey: { toBase58(): string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- covarianza con el BaseWallet de SAK
  signTransaction(transaction: unknown): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- covarianza con el BaseWallet de SAK
  signAllTransactions(transactions: unknown[]): Promise<any[]>;
  signAndSendTransaction(transaction: unknown, options?: unknown): Promise<{ signature: string }>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
}

/** Tipos de acción soportados por Prova (espejo de `ActionType` del SDK). */
export type ProvaActionType =
  | 'Transaction'
  | 'ToolCall'
  | 'ModelInvocation'
  | 'Decision'
  | 'ResourceAccess'
  | 'PolicyCheck'
  | 'Custom';

/** Una atestación lista para enviar (action_hash de 32 bytes + tipo). */
export interface AttestationItem {
  actionHash: Uint8Array;
  actionType: ProvaActionType;
  /** Si es true el hash queda on-chain pero el payload off-chain (Vanish). Default false. */
  privacyMode?: boolean;
}

/**
 * Superficie mínima que el adapter necesita de Prova, inyectada por el
 * integrador. Permite usar el `ProvaClient` real sin acoplarnos a su tipo.
 */
export interface ProvaAttester {
  hashAction(payload: string): Promise<Uint8Array>;
  attest(item: AttestationItem): Promise<{ txSignature: string }>;
  batchAttest(items: AttestationItem[]): Promise<{ txSignature: string }>;
}

/** Configuración del batching de atestaciones. */
export interface BatchOptions {
  /** Nº máximo de atestaciones por transacción (1–100). Al alcanzarlo, flush inmediato. Default 25. */
  maxSize?: number;
  /**
   * Debounce: hace flush este nº de ms tras la ÚLTIMA acción. Así una ráfaga de
   * tool calls (multi-tool-calling) se agrupa en UNA sola tx on-chain apenas
   * termina la ráfaga. Default 1000. 0 = flush inmediato en cada acción (sin batch).
   */
  flushDelayMs?: number;
}

/** Opciones de `attachProva`. */
export interface AttachProvaOptions {
  /** Puente hacia Prova (ver `attesterFromProvaClient`). */
  attester: ProvaAttester;
  /** Filtra qué acciones atestar por nombre (default: todas). */
  rules?: (actionName: string) => boolean;
  /** Configuración de batching. */
  batch?: BatchOptions;
  /** Manejo de errores (default: warn por consola). Nunca rompe la acción. */
  onError?: (error: unknown, context: { action: string }) => void;
}
