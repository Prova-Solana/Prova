// Puente entre el `ProvaClient` real (prova-agent-sdk) y la interfaz
// `ProvaAttester` que usa el adapter. Tipado estructural → no importamos el SDK.

import type { AttestationItem, ProvaActionType, ProvaAttester } from './types';

/**
 * Forma estructural del `ProvaClient` que necesitamos (de prova-agent-sdk).
 * Genérico en el tipo de la keypair `K`: antes `operatorKeypair` era `unknown`,
 * lo que impedía que el `ProvaClient` real (que exige `Keypair`) fuera asignable
 * a esta interfaz sin castear (`as never`). Con `K` inferido del propio cliente,
 * el tercer argumento queda además chequeado contra el tipo real de keypair
 * (hallazgo reportado por un integrador real, jul-2026).
 */
export interface ProvaClientLike<K = unknown> {
  attest(args: {
    operatorKeypair: K;
    actionHash: Uint8Array;
    actionType: ProvaActionType;
    privacyMode?: boolean;
  }): Promise<{ txSignature: string }>;
  batchAttest(args: {
    operatorKeypair: K;
    attestations: Array<{ actionHash: Uint8Array; actionType: ProvaActionType; privacyMode?: boolean }>;
  }): Promise<{ txSignature: string }>;
}

/**
 * Construye un `ProvaAttester` a partir de un `ProvaClient` real, la función
 * estática `ProvaClient.hashAction` y la keypair operadora de Prova. `K` se
 * infiere del cliente, así que `operatorKeypair` debe ser exactamente el tipo
 * de keypair que ese cliente espera — sin `unknown`, sin cast.
 *
 * @example
 * const attester = attesterFromProvaClient(prova, ProvaClient.hashAction, operatorKeypair);
 */
export function attesterFromProvaClient<K>(
  client: ProvaClientLike<K>,
  hashAction: (payload: string) => Promise<Uint8Array>,
  operatorKeypair: K,
): ProvaAttester {
  return {
    hashAction,
    attest: (item: AttestationItem) =>
      client.attest({
        operatorKeypair,
        actionHash: item.actionHash,
        actionType: item.actionType,
        privacyMode: item.privacyMode,
      }),
    batchAttest: (items: AttestationItem[]) =>
      client.batchAttest({ operatorKeypair, attestations: items }),
  };
}
