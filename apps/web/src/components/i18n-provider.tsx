'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'EN' | 'ES';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  EN: {
    home: 'Home',
    product: 'Product',
    explorer: 'Explorer',
    developers: 'Developers',
    solutions: 'Solutions',
    pricing: 'Pricing',
    docs: 'Docs',
    blog: 'Blog',
    registerAgent: 'Register Agent',
    startBuilding: 'Start Building',
    live: 'LIVE',
    shippedThisWeek: 'v0.1.7 on npm →',
    heroTitle1: 'The forensic',
    heroTitle2: 'settlement layer',
    heroTitle3: 'for every',
    heroTitle4: 'Autonomous',
    heroTitle5: 'AI Agent.',
    heroDesc1: 'Prova writes a cryptographic, on-chain receipt for every transaction, API call, and decision your agent makes — ',
    heroDesc2: ' unlocking trustless enterprise adoption with sub-second, sub-cent Solana finality.',
    shipFirst: 'Ship Your First Attestation',
    seeFeed: 'View Global Feed',
    finality: 'finality',
    perReceipt: 'per receipt',
    openSource: 'open source',
    native: 'native',
    feedFooter: 'Immutable on-chain receipts · live from devnet · verify cryptographically →',
    liveAttestations: 'Live Attestations',
    thisSession: 'this session',
    total: 'total',
    liveOnDevnet: 'live on devnet',
    awaitingActivity: 'awaiting agentic activity',
    noAttestationsYet: 'No AI attestations yet on devnet.',
    openExplorer: 'Open Prova Explorer →',
    sAgo: 's ago',
    mAgo: 'm ago',
    hAgo: 'h ago',
    productPageTitle: 'Product',
    productHeadline1: 'How autonomous',
    productHeadline2: 'AI decisions',
    productHeadline3: 'become forensic-',
    productHeadline4: 'grade evidence.',
    productDesc: 'Four deep-dives into the architecture of the Agentic Internet. Designed for AI engineers, security researchers, and enterprise compliance teams.',
    tagCore: 'Core',
    tagDevelopers: 'Developers',
    tagTrust: 'Trust',
    tagCompliance: 'Compliance',
    titleHowItWorks: 'How it works',
    titleSdk: 'Agent SDK',
    titleSecurity: 'Security',
    titlePrivacyMode: 'Privacy mode',
    descHowItWorks: 'Architecture, Machine Payment Protocol (MPP) integration, and sequence diagrams from agent intent to immutable on-chain receipt.',
    descSdk: 'TypeScript SDK reference — ProvaClient on-chain + REST API. Built for elizaOS and native Solana agents.',
    descSecurity: 'STRIDE threat model, cryptographic custody, and enterprise bug bounty.',
    descPrivacyMode: 'Selective disclosure via Vanish Core. Prove an AI action was executed without leaking proprietary prompts.',
    connectWallet: 'Connect Wallet',
    connecting: 'Connecting...',
    emailLogin: 'Email Login',
    emailLoginTitle: 'Enterprise Sign-In',
    emailLoginDesc: 'Phantom Connect / Privy embedded wallet flow initiated. Enter your corporate email to generate a secure non-custodial wallet instantly.',
    emailPlaceholder: 'you@enterprise.com',
    continueWithEmail: 'Continue with Email',
    cancel: 'Cancel',
    logout: 'Disconnect'
  },
  ES: {
    home: 'Inicio',
    product: 'Producto',
    explorer: 'Explorer',
    developers: 'Devs',
    solutions: 'Soluciones',
    pricing: 'Precios',
    docs: 'Docs',
    blog: 'Blog',
    registerAgent: 'Registrar',
    startBuilding: 'Desplegar',
    live: 'EN VIVO',
    shippedThisWeek: 'v0.1.7 en npm →',
    heroTitle1: 'La capa de',
    heroTitle2: 'liquidación forense',
    heroTitle3: 'para cada',
    heroTitle4: 'Agente de IA',
    heroTitle5: 'Autónomo.',
    heroDesc1: 'Prova escribe un recibo criptográfico on-chain por cada transacción, llamada de API y decisión que toma tu agente — ',
    heroDesc2: ' habilitando la adopción empresarial con finalidad en sub-segundos a fracciones de centavo en Solana.',
    shipFirst: 'Envía tu primera atestación',
    seeFeed: 'Ver el feed global',
    finality: 'finalidad',
    perReceipt: 'por recibo',
    openSource: 'código abierto',
    native: 'nativo',
    feedFooter: 'Recibos inmutables on-chain · en vivo desde devnet · verifica criptográficamente →',
    liveAttestations: 'Atestaciones en Vivo',
    thisSession: 'esta sesión',
    total: 'total',
    liveOnDevnet: 'en vivo en devnet',
    awaitingActivity: 'esperando actividad de agentes',
    noAttestationsYet: 'Aún no hay atestaciones de IA en devnet.',
    openExplorer: 'Abrir Prova Explorer →',
    sAgo: 's atrás',
    mAgo: 'm atrás',
    hAgo: 'h atrás',
    productPageTitle: 'Producto',
    productHeadline1: 'Cómo las decisiones',
    productHeadline2: 'autónomas de IA',
    productHeadline3: 'se convierten en',
    productHeadline4: 'evidencia forense.',
    productDesc: 'Cuatro inmersiones profundas en la arquitectura del Internet de Agentes. Diseñado para ingenieros de IA, investigadores de seguridad y equipos de cumplimiento.',
    tagCore: 'Núcleo',
    tagDevelopers: 'Desarrolladores',
    tagTrust: 'Confianza',
    tagCompliance: 'Cumplimiento',
    titleHowItWorks: 'Cómo funciona',
    titleSdk: 'SDK para Agentes',
    titleSecurity: 'Seguridad',
    titlePrivacyMode: 'Modo Privacidad',
    descHowItWorks: 'Arquitectura, integración con el Machine Payment Protocol (MPP) y diagramas desde la intención del agente hasta el recibo inmutable.',
    descSdk: 'Referencia del SDK — ProvaClient on-chain + REST API. Diseñado para elizaOS y agentes nativos de Solana.',
    descSecurity: 'Modelo de amenazas STRIDE, custodia criptográfica y bug bounty empresarial.',
    descPrivacyMode: 'Divulgación selectiva con Vanish Core. Prueba que una acción de IA ocurrió sin filtrar tus prompts propietarios.',
    connectWallet: 'Conectar Wallet',
    connecting: 'Conectando...',
    emailLogin: 'Login Email',
    emailLoginTitle: 'Acceso Empresarial',
    emailLoginDesc: 'Flujo de wallet embebida Phantom Connect / Privy iniciado. Ingresa tu correo corporativo para generar una wallet no custodial segura al instante.',
    emailPlaceholder: 'tu@empresa.com',
    continueWithEmail: 'Continuar con Email',
    cancel: 'Cancelar',
    logout: 'Desconectar'
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('EN');

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations['EN']] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
