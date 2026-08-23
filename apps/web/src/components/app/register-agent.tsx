'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { usePrivy, useConnectWallet } from '@privy-io/react-auth';
import {
  useCreateWallet as useCreateSolanaWallet,
  useWallets as usePrivySolanaWallets,
} from '@privy-io/react-auth/solana';
import { Button } from '@prova/ui';
import {
  ArrowRight,
  Wallet,
  KeyRound,
  Download,
  CheckCircle,
  Loader2,
  AlertTriangle,
  ShieldAlert,
  ShieldOff,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useProvaProgram, useAgentAccount } from '@/lib/solana/hooks';
import {
  generateAgentKeypair,
  registerAgent,
  revokeAgent,
  downloadKeypair,
  parseProgramError,
} from '@/lib/solana/registration';
import { explorerTxUrl, NETWORK, deriveAgentPda } from '@/lib/solana/constants';
import { shortPubkey } from '@/lib/solana/events';
import { useI18n } from '@/components/i18n-provider';

type Step = 'connect' | 'generate' | 'review' | 'register' | 'success';

const content = {
  EN: {
    tag: 'Register agent',
    headline: ['Three keys', 'in 90 seconds.'],
    desc: 'Connect your operator wallet, generate a fresh agent keypair, save it, and write the registration on Solana. The agent identity is yours — Prova never sees the secret.',
    stage1: 'Operator wallet',
    stage2: 'Agent keypair',
    stage3: 'On-chain registration',
    s1tag: 'Step 1 · Operator',
    s1title: 'Connect the wallet that controls this agent.',
    s1desc: 'The operator wallet pays for registration and is the only key that can revoke or update the agent later.',
    airdrop: 'Airdrop 1 SOL (devnet)',
    airdropping: 'Airdropping…',
    createWallet: 'Create Solana wallet',
    provisioning: 'Provisioning…',
    connectExisting: 'Connect existing wallet',
    emailLogin: 'Email Login',
    connectBtn: 'Connect operator wallet',
    noSolanaWallet: 'No Solana wallet provisioned for this account yet. Create one with Privy to continue.',
    signerNotReady: '(signer not ready — log out and back in to provision wallet)',
    solanaAddress: 'Solana address:',
    balance: 'Balance:',
    pdaFor: 'Agent PDA for this operator:',
    s2tag: 'Step 2 · Agent identity',
    s2title: 'Generate a fresh Ed25519 keypair.',
    s2desc: 'The agent uses this key to sign every action. Generated locally, never transmitted. You must download and store it before continuing.',
    generateBtn: 'Generate agent keypair',
    publicKey: 'Public key (agent_id)',
    secretKey: 'Secret key',
    savedDownloads: '(saved to your downloads — never shown again)',
    notShown: '(not shown — download to save)',
    downloadBtn: 'Download keypair',
    downloaded: 'Keypair downloaded',
    regenerate: 'Regenerate',
    saveWarning: 'Save this file now. We do not store it. If you lose it, the agent identity is unrecoverable and you must register a new one.',
    checkingExisting: 'Checking devnet for an existing agent under this operator…',
    alreadyRegistered: 'Agent already registered',
    alreadyDesc: 'This operator wallet is bound to one agent on-chain. The Prova program enforces a 1:1 mapping',
    agentPda: 'Agent PDA',
    attsIssued: 'Attestations issued',
    registeredAt: 'Registered',
    openAgentPage: 'Open agent page',
    revokeAgent: 'Revoke this agent',
    revoking: 'Revoking…',
    revokeTxLabel: 'Revoke tx:',
    burnedTitle: 'This operator is burned',
    burnedDesc: "The agent at this operator's PDA has been revoked. The PDA still occupies the address and the program cannot reuse it. To register a new agent, switch to a different operator wallet.",
    revokedAgent: 'Revoked agent',
    finalCount: 'Final attestation count',
    s3tag: 'Step 3 · Register on-chain',
    s3title: 'Write the registration to the Prova program.',
    s3desc: 'Calls',
    s3desc2: 'with the agent\'s public key as',
    s3desc3: 'and a zero policy root (you can update it later via',
    s3desc4: ').',
    preCheck: 'Pre-check:',
    treatedAs: '(Treated as "no agent yet".)',
    successTitle: 'Registered on Solana',
    txSig: 'Tx signature',
    issueFirst: 'Issue first attestation',
    registerBtn: 'Register on',
    sending: 'Sending transaction…',
    connectViaPrivy: 'Connect wallet via Privy',
  },
  ES: {
    tag: 'Registrar agente',
    headline: ['Tres claves', 'en 90 segundos.'],
    desc: 'Conecta tu wallet de operador, genera un nuevo keypair de agente, guárdalo y registra la identidad en Solana. El agente te pertenece — Prova nunca ve el secreto.',
    stage1: 'Wallet operador',
    stage2: 'Keypair del agente',
    stage3: 'Registro on-chain',
    s1tag: 'Paso 1 · Operador',
    s1title: 'Conecta la wallet que controla este agente.',
    s1desc: 'La wallet del operador paga el registro y es la única clave que puede revocar o actualizar el agente más tarde.',
    airdrop: 'Airdrop 1 SOL (devnet)',
    airdropping: 'Enviando airdrop…',
    createWallet: 'Crear wallet de Solana',
    provisioning: 'Provisionando…',
    connectExisting: 'Conectar wallet existente',
    emailLogin: 'Login Email',
    connectBtn: 'Conectar wallet de operador',
    noSolanaWallet: 'No hay wallet de Solana para esta cuenta. Crea una con Privy para continuar.',
    signerNotReady: '(firmante no disponible — cierra y vuelve a iniciar sesión para provisionar la wallet)',
    solanaAddress: 'Dirección de Solana:',
    balance: 'Balance:',
    pdaFor: 'PDA del agente para este operador:',
    s2tag: 'Paso 2 · Identidad del agente',
    s2title: 'Genera un keypair Ed25519 nuevo.',
    s2desc: 'El agente usa esta clave para firmar cada acción. Generado localmente, nunca transmitido. Debes descargarlo antes de continuar.',
    generateBtn: 'Generar keypair del agente',
    publicKey: 'Clave pública (agent_id)',
    secretKey: 'Clave privada',
    savedDownloads: '(guardado en tus descargas — no se mostrará de nuevo)',
    notShown: '(no se muestra — descarga para guardar)',
    downloadBtn: 'Descargar keypair',
    downloaded: 'Keypair descargado',
    regenerate: 'Regenerar',
    saveWarning: 'Guarda este archivo ahora. No lo almacenamos. Si lo pierdes, la identidad del agente es irrecuperable y deberás registrar uno nuevo.',
    checkingExisting: 'Buscando un agente existente en devnet para este operador…',
    alreadyRegistered: 'Agente ya registrado',
    alreadyDesc: 'Esta wallet de operador está vinculada a un agente on-chain. El programa Prova aplica un mapeo 1:1',
    agentPda: 'PDA del agente',
    attsIssued: 'Atestaciones emitidas',
    registeredAt: 'Registrado',
    openAgentPage: 'Abrir página del agente',
    revokeAgent: 'Revocar este agente',
    revoking: 'Revocando…',
    revokeTxLabel: 'Tx de revocación:',
    burnedTitle: 'Este operador está quemado',
    burnedDesc: 'El agente en el PDA de este operador ha sido revocado. El PDA sigue ocupando la dirección y el programa no puede reutilizarla. Para registrar un nuevo agente, cambia a una wallet de operador diferente.',
    revokedAgent: 'Agente revocado',
    finalCount: 'Número final de atestaciones',
    s3tag: 'Paso 3 · Registrar on-chain',
    s3title: 'Escribe el registro en el programa Prova.',
    s3desc: 'Llama a',
    s3desc2: 'con la clave pública del agente como',
    s3desc3: 'y un policy root cero (puedes actualizarlo más tarde con',
    s3desc4: ').',
    preCheck: 'Pre-verificación:',
    treatedAs: '(Se trata como "sin agente todavía".)',
    successTitle: 'Registrado en Solana',
    txSig: 'Firma de Tx',
    issueFirst: 'Emitir primera atestación',
    registerBtn: 'Registrar en',
    sending: 'Enviando transacción…',
    connectViaPrivy: 'Conectar wallet con Privy',
  },
};

export function RegisterAgent() {
  const { lang } = useI18n();
  const t = content[lang];

  const wallet = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const { connection } = useConnection();
  const { program, readOnly } = useProvaProgram();
  const [airdropping, setAirdropping] = useState(false);
  const [balanceLamports, setBalanceLamports] = useState<number | null>(null);

  const { authenticated, user, login } = usePrivy();
  const { connectWallet } = useConnectWallet();
  // useWallets de @privy-io/react-auth/solana devuelve SOLO wallets de Solana.
  // El useWallets del paquete principal devuelve ConnectedWallet[] que solo cubre Ethereum,
  // por eso los wallets Solana no aparecían y veíamos "No Solana wallet provisioned" incluso
  // cuando Privy sí los tenía registrados.
  const { wallets: solanaWallets } = usePrivySolanaWallets();
  const { createWallet: createPrivySolanaWallet } = useCreateSolanaWallet();
  const [creatingWallet, setCreatingWallet] = useState(false);
  const embeddedWallet = solanaWallets.find(
    (w) => (w as { standardWallet?: { name?: string } }).standardWallet?.name === 'Privy'
  );

  const privyPubkey = (() => {
    if (!embeddedWallet) return null;
    try {
      return new PublicKey((embeddedWallet as unknown as { address: string }).address);
    } catch {
      return null;
    }
  })();

  const activePubkey = wallet.publicKey || privyPubkey;
  const isConnected = wallet.connected || authenticated;
  
  const operatorBase58 = activePubkey?.toBase58() ?? null;
  const { data: existingAgent, loading: checkingExisting, error: existingError } = useAgentAccount(
    operatorBase58
  );

  const [agentKeypair, setAgentKeypair] = useState<Keypair | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ txSignature: string; agentPda: string } | null>(null);
  const [revokeTx, setRevokeTx] = useState<string | null>(null);

  const step: Step = !isConnected
    ? 'connect'
    : !agentKeypair
      ? 'generate'
      : !downloaded
        ? 'review'
        : result
          ? 'success'
          : 'register';

  // Handler global para rechazos de Promise no capturados que puedan venir del SDK de Privy
  // durante la firma. Se registra al montar para que exista antes de cualquier clic.
  useEffect(() => {
    const handleRejection = (ev: PromiseRejectionEvent) => {
      ev.preventDefault();
      const reason = ev.reason;
      const msg = reason instanceof Error ? reason.message : String(reason ?? 'Unknown error');
      // Solo actuamos si hay una operación de registro activa.
      setError((prev) => prev ?? `Transaction failed: ${msg}`);
      setRegistering(false);
    };
    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, []);

  // Lee el balance del operator para detectar cuando hace falta airdrop.
  useEffect(() => {
    if (!activePubkey) {
      setBalanceLamports(null);
      return;
    }
    let cancelled = false;
    connection
      .getBalance(activePubkey, 'confirmed')
      .then((b) => {
        if (!cancelled) setBalanceLamports(b);
      })
      .catch(() => {
        if (!cancelled) setBalanceLamports(null);
      });
    return () => {
      cancelled = true;
    };
  }, [connection, activePubkey, result, revokeTx]);

  const airdrop = async () => {
    if (!activePubkey || NETWORK !== 'devnet') return;
    setError(null);
    setAirdropping(true);
    try {
      const sig = await connection.requestAirdrop(activePubkey, LAMPORTS_PER_SOL);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        'confirmed'
      );
      const b = await connection.getBalance(activePubkey, 'confirmed');
      setBalanceLamports(b);
    } catch (e) {
      setError(parseProgramError(e));
    } finally {
      setAirdropping(false);
    }
  };

  const provisionPrivyWallet = async () => {
    setError(null);
    setCreatingWallet(true);
    try {
      await createPrivySolanaWallet();
    } catch (e) {
      setError(parseProgramError(e));
    } finally {
      setCreatingWallet(false);
    }
  };

  const generate = () => {
    setAgentKeypair(generateAgentKeypair());
    setDownloaded(false);
    setResult(null);
    setError(null);
  };

  const download = () => {
    if (!agentKeypair) return;
    downloadKeypair(agentKeypair, `prova-agent-${agentKeypair.publicKey.toBase58().slice(0, 8)}.json`);
    setDownloaded(true);
  };

  const register = async () => {
    // Capa exterior: captura cualquier error imprevisto (incluyendo los que escapen
    // del try/catch interior — por ejemplo errores síncronos en los guards).
    try {
      setError(null);
      if (!agentKeypair) {
        setError('Generate an agent keypair first (Step 2).');
        return;
      }
      if (!activePubkey) {
        setError('No operator wallet detected. Connect Phantom/Solflare or sign in via Privy.');
        return;
      }
      if (!program || readOnly) {
        setError(
          authenticated
            ? 'Your Privy embedded Solana wallet is not ready to sign. Try logging out and back in to trigger wallet creation, or connect Phantom/Solflare instead.'
            : 'Signing is not available. Connect Phantom or Solflare to continue.'
        );
        return;
      }
      setRegistering(true);

      try {
        const r = await registerAgent({ program, operator: activePubkey, agentKeypair });
        setResult({ txSignature: r.txSignature, agentPda: r.agentPda.toBase58() });
      } catch (e) {
        console.error('[Prova] Registration error:', e);
        const msg = (() => { try { return parseProgramError(e); } catch { return String(e); } })();
        setError(msg);
      } finally {
        setRegistering(false);
      }
    } catch (outer) {
      console.error('[Prova] Unexpected registration error:', outer);
      setError(outer instanceof Error ? outer.message : String(outer ?? 'Unexpected error'));
      setRegistering(false);
    }
  };

  const revoke = async () => {
    if (!program || readOnly || !activePubkey) return;
    setRevoking(true);
    setError(null);
    try {
      const r = await revokeAgent({ program, operator: activePubkey });
      setRevokeTx(r.txSignature);
      window.setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      setError(parseProgramError(e));
    } finally {
      setRevoking(false);
    }
  };

  const agentPdaPreview = activePubkey ? deriveAgentPda(activePubkey)[0].toBase58() : null;
  const hasActiveAgent = existingAgent !== null && !existingAgent?.revoked;
  const hasRevokedAgent = existingAgent !== null && existingAgent?.revoked === true;

  return (
    <div className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-pixel text-[13px] uppercase tracking-wider text-primary">{t.tag}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{NETWORK}</p>
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none text-foreground sm:text-5xl">
              <span className="block">{t.headline[0]}</span>
              <span className="mt-1 inline-block bg-primary px-2 text-primary-foreground">{t.headline[1]}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.desc}</p>
          </div>
        </div>

        {/* Progress stages */}
        <ol className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
          <Stage n="01" label={t.stage1} active={step === 'connect'} done={step !== 'connect'} icon={Wallet} />
          <Stage n="02" label={t.stage2} active={step === 'generate' || step === 'review'} done={step === 'register' || step === 'success'} icon={KeyRound} />
          <Stage n="03" label={t.stage3} active={step === 'register'} done={step === 'success'} icon={CheckCircle} />
        </ol>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Step 1: Operator wallet */}
          <section>
            <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.s1tag}</h2>
            <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">{t.s1title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{t.s1desc}</p>
            <div className="mt-6">
              {wallet.connected && wallet.publicKey ? (
                <div className="flex items-center gap-3 border border-border bg-background px-4 py-3">
                  <span className="h-2 w-2 bg-primary" aria-hidden />
                  <span className="break-all font-mono text-xs text-foreground">{wallet.publicKey.toBase58()}</span>
                </div>
              ) : authenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between border border-border bg-background px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 ${activePubkey ? 'bg-primary' : 'bg-destructive'}`} aria-hidden />
                      <span className="font-mono text-xs text-foreground">{user.email?.address || 'User'}</span>
                    </div>
                    <span className="bg-primary/10 px-2 py-0.5 font-pixel text-[10px] text-primary">Privy Embedded Wallet</span>
                  </div>
                  {activePubkey ? (
                    <div className="space-y-1.5">
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {t.solanaAddress} <span className="break-all text-foreground">{activePubkey.toBase58()}</span>
                        {readOnly && <span className="ml-2 text-destructive">{t.signerNotReady}</span>}
                      </p>
                      {NETWORK === 'devnet' && (
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {t.balance}{' '}
                            <span className={balanceLamports !== null && balanceLamports > 0 ? 'text-foreground' : 'text-destructive'}>
                              {balanceLamports !== null ? `${(balanceLamports / LAMPORTS_PER_SOL).toFixed(4)} SOL` : '…'}
                            </span>
                          </p>
                          {(balanceLamports === 0 || (balanceLamports !== null && balanceLamports < 0.01 * LAMPORTS_PER_SOL)) && (
                            <Button size="sm" variant="outline" onClick={airdrop} disabled={airdropping} className="gap-2 font-mono text-[10px] uppercase tracking-wider">
                              {airdropping ? <><Loader2 className="h-3 w-3 animate-spin" /> {t.airdropping}</> : t.airdrop}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-mono text-[11px] text-destructive">{t.noSolanaWallet}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={provisionPrivyWallet} disabled={creatingWallet} className="gap-2 font-mono uppercase tracking-wider">
                          {creatingWallet ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.provisioning}</> : <><Wallet className="h-4 w-4" /> {t.createWallet}</>}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => connectWallet()} className="gap-2 font-mono uppercase tracking-wider">
                          <Wallet className="h-4 w-4" /> {t.connectExisting}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => openWalletModal(true)} className="gap-2 font-mono uppercase tracking-wider">
                    <Wallet className="h-4 w-4" /> {t.connectBtn}
                  </Button>
                  <Button variant="secondary" onClick={login} className="gap-2 font-mono uppercase tracking-wider">
                    {t.emailLogin}
                  </Button>
                </div>
              )}
              {isConnected && agentPdaPreview && (
                <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                  {t.pdaFor}{' '}
                  <Link href={`/explorer/agent/${agentPdaPreview}`} className="text-foreground hover:text-primary">
                    {shortPubkey(agentPdaPreview, 6, 6)}
                  </Link>
                </p>
              )}
            </div>
          </section>

          {/* Step 2: Agent keypair */}
          <section className={!isConnected || hasActiveAgent ? 'pointer-events-none opacity-40' : ''}>
            <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.s2tag}</h2>
            <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">{t.s2title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{t.s2desc}</p>

            {!agentKeypair ? (
              <Button onClick={generate} disabled={!isConnected || hasActiveAgent} className="mt-6 gap-2 font-mono uppercase tracking-wider">
                <KeyRound className="h-4 w-4" /> {t.generateBtn}
              </Button>
            ) : (
              <div className="mt-6 space-y-4">
                <dl className="border border-border bg-background">
                  <Pair k={t.publicKey}>
                    <span className="break-all font-mono text-xs text-foreground">{agentKeypair.publicKey.toBase58()}</span>
                  </Pair>
                  <Pair k={t.secretKey}>
                    <span className="font-mono text-xs text-muted-foreground">
                      {downloaded ? t.savedDownloads : t.notShown}
                    </span>
                  </Pair>
                </dl>
                <div className="flex flex-wrap gap-2">
                  {!downloaded ? (
                    <Button onClick={download} className="gap-2 font-mono uppercase tracking-wider">
                      <Download className="h-4 w-4" /> {t.downloadBtn}
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-primary">
                      <CheckCircle className="h-3.5 w-3.5" /> {t.downloaded}
                    </span>
                  )}
                  <Button variant="ghost" onClick={generate} className="gap-2 font-mono uppercase tracking-wider">
                    <RefreshCw className="h-3.5 w-3.5" /> {t.regenerate}
                  </Button>
                </div>
                <div className="flex items-start gap-3 border border-destructive/40 bg-destructive/5 px-4 py-3 text-xs text-destructive">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{t.saveWarning}</span>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Checking existing */}
        {isConnected && checkingExisting && (
          <div className="mt-16 flex items-center gap-3 border border-border bg-background px-5 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> {t.checkingExisting}
          </div>
        )}

        {/* Existing active agent */}
        {isConnected && hasActiveAgent && existingAgent && (
          <section className="mt-16 border border-primary/40 bg-primary/4 p-6">
            <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-primary">
              <CheckCircle className="h-4 w-4" /> {t.alreadyRegistered}
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              {t.alreadyDesc}
              <code className="mx-1 font-mono text-foreground">[b&quot;prova_agent&quot;, operator]</code>
            </p>
            <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
              <Pair k={t.agentPda}>
                <Link href={`/explorer/agent/${existingAgent.address.toBase58()}`} className="break-all font-mono text-xs text-foreground hover:text-primary">
                  {existingAgent.address.toBase58()}
                </Link>
              </Pair>
              <Pair k={t.attsIssued}>
                <span className="font-mono">{existingAgent.attestationCount.toLocaleString()}</span>
              </Pair>
              <Pair k={t.registeredAt}>
                <span className="font-mono text-xs">{new Date(existingAgent.createdAt * 1000).toISOString().replace('T', ' ').slice(0, 19)} UTC</span>
              </Pair>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild className="gap-2 font-mono uppercase tracking-wider">
                <Link href={`/explorer/agent/${existingAgent.address.toBase58()}`}>
                  {t.openAgentPage} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button onClick={revoke} disabled={revoking} variant="outline" className="gap-2 font-mono uppercase tracking-wider">
                {revoking ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.revoking}</> : <><ShieldOff className="h-3.5 w-3.5" /> {t.revokeAgent}</>}
              </Button>
            </div>
            {revokeTx && (
              <p className="mt-4 font-mono text-[11px] text-muted-foreground">
                {t.revokeTxLabel}{' '}
                <a href={explorerTxUrl(revokeTx)} target="_blank" rel="noreferrer noopener" className="text-primary hover:underline">
                  {revokeTx.slice(0, 8)}…{revokeTx.slice(-4)} <ExternalLink className="inline h-3 w-3" />
                </a>
              </p>
            )}
          </section>
        )}

        {/* Burned operator */}
        {isConnected && hasRevokedAgent && existingAgent && (
          <section className="mt-16 border border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-destructive">
              <ShieldOff className="h-4 w-4" /> {t.burnedTitle}
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{t.burnedDesc}</p>
            <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
              <Pair k={t.revokedAgent}>
                <Link href={`/explorer/agent/${existingAgent.address.toBase58()}`} className="break-all font-mono text-xs text-foreground hover:text-primary">
                  {existingAgent.address.toBase58()}
                </Link>
              </Pair>
              <Pair k={t.finalCount}>
                <span className="font-mono">{existingAgent.attestationCount.toLocaleString()}</span>
              </Pair>
            </dl>
          </section>
        )}

        {/* Step 3: Register */}
        <section className={`mt-16 ${!downloaded || hasActiveAgent || hasRevokedAgent ? 'pointer-events-none opacity-40' : ''}`}>
          <h2 className="font-pixel text-[12px] uppercase tracking-wider text-primary">{t.s3tag}</h2>
          <h3 className="mt-2 font-display text-xl uppercase text-foreground sm:text-2xl">{t.s3title}</h3>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {t.s3desc} <code className="font-mono text-foreground">register_agent(agent_id, policy_root)</code> {t.s3desc2} <code className="font-mono text-foreground">agent_id</code> {t.s3desc3}<code className="font-mono text-foreground"> update_policy_root</code>{t.s3desc4}
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-3 border border-destructive/40 bg-destructive/5 px-5 py-4 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="wrap-break-word">{error}</span>
            </div>
          )}

          {existingError && !existingAgent && (
            <p className="mt-4 font-mono text-[11px] text-muted-foreground">
              {t.preCheck} {existingError}. {t.treatedAs}
            </p>
          )}

          {result ? (
            <div className="mt-6 border border-primary/40 bg-primary/4 p-6">
              <div className="flex items-center gap-2 font-pixel text-[12px] uppercase tracking-wider text-primary">
                <CheckCircle className="h-4 w-4" /> {t.successTitle} {NETWORK}
              </div>
              <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
                <Pair k={t.agentPda}>
                  <Link href={`/explorer/agent/${result.agentPda}`} className="break-all font-mono text-xs text-foreground hover:text-primary">
                    {result.agentPda}
                  </Link>
                </Pair>
                <Pair k={t.txSig}>
                  <a href={explorerTxUrl(result.txSignature)} target="_blank" rel="noreferrer noopener" className="break-all font-mono text-xs text-foreground hover:text-primary">
                    {result.txSignature} <ExternalLink className="inline h-3 w-3" />
                  </a>
                </Pair>
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild className="gap-2 font-mono uppercase tracking-wider">
                  <Link href={`/explorer/agent/${result.agentPda}`}>
                    {t.openAgentPage} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2 font-mono uppercase tracking-wider">
                  <Link href="/app/issue">
                    {t.issueFirst} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={register} disabled={!downloaded || registering || hasActiveAgent || hasRevokedAgent} className="gap-2 font-mono uppercase tracking-wider">
                {registering ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.sending}</> : <>{t.registerBtn} {NETWORK} <ArrowRight className="h-3.5 w-3.5" /></>}
              </Button>
              {readOnly && (
                <Button variant="outline" onClick={() => connectWallet()} className="gap-2 font-mono uppercase tracking-wider">
                  <Wallet className="h-4 w-4" /> {t.connectViaPrivy}
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Stage({
  n,
  label,
  active,
  done,
  icon: Icon,
}: {
  n: string;
  label: string;
  active: boolean;
  done: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className={`flex items-center gap-4 bg-background px-6 py-5 ${active ? 'bg-primary/4' : ''}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center border ${
          done ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
        }`}
      >
        {done ? <CheckCircle className="h-4 w-4" strokeWidth={1.5} /> : <Icon className="h-4 w-4" strokeWidth={1.5} />}
      </span>
      <div>
        <p className="font-mono text-[11px] text-muted-foreground">{n}</p>
        <p
          className={`font-pixel text-[12px] uppercase tracking-wider ${
            active ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function Pair({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-6">
      <dt className="font-pixel text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}
