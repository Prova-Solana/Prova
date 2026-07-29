// Enfoque A: decorador de BaseWallet (SAK v2). Captura la firma on-chain real
// de cada transacción firmada/enviada, sin importar qué plugin la produjo. Es
// el "cinturón de seguridad" que complementa a `attachProva`.

import type { BatchOptions, HostWallet, ProvaAttester } from './types';
import { createBatcher, type Batcher } from './batcher';

export interface ProvaWalletOptions {
  attester: ProvaAttester;
  batch?: BatchOptions;
  onError?: (error: unknown) => void;
}

export class ProvaWallet<W extends HostWallet = HostWallet> implements HostWallet {
  private readonly inner: W;
  private readonly attester: ProvaAttester;
  private readonly batcher: Batcher;

  constructor(inner: W, options: ProvaWalletOptions) {
    this.inner = inner;
    this.attester = options.attester;
    this.batcher = createBatcher(options.attester, options.batch, options.onError);
  }

  /**
   * Delega el `publicKey` del wallet envuelto CONSERVANDO su tipo real
   * (`W['publicKey']`, p. ej. el `PublicKey` completo de web3.js). Antes exponía
   * solo `{ toBase58() }`, lo que obligaba a castear al pasar el ProvaWallet a
   * `SolanaAgentKit` (hallazgo reportado por un integrador real, jul-2026).
   */
  get publicKey(): W['publicKey'] {
    return this.inner.publicKey;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- espejo de HostWallet
  signTransaction(transaction: unknown): Promise<any> {
    return this.inner.signTransaction(transaction);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- espejo de HostWallet
  signAllTransactions(transactions: unknown[]): Promise<any[]> {
    return this.inner.signAllTransactions(transactions);
  }

  signMessage(message: Uint8Array): Promise<Uint8Array> {
    return this.inner.signMessage(message);
  }

  async signAndSendTransaction(transaction: unknown, options?: unknown): Promise<{ signature: string }> {
    const result = await this.inner.signAndSendTransaction(transaction, options);
    // Atestación NO bloqueante de la firma on-chain real.
    void this.captureSignature(result.signature).catch(() => {});
    return result;
  }

  /** Fuerza el envío de las atestaciones pendientes. */
  flush(): Promise<void> {
    return this.batcher.flush();
  }

  /** Detiene el batcher y hace un flush final. */
  stop(): Promise<void> {
    return this.batcher.stop();
  }

  private async captureSignature(signature: string): Promise<void> {
    const payload = { kind: 'transaction', signature, source: 'wallet' };
    const actionHash = await this.attester.hashAction(JSON.stringify(payload));
    this.batcher.add({ actionHash, actionType: 'Transaction' });
  }
}
