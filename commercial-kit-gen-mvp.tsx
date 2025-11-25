import React, { useState, useEffect } from 'react';
import { Upload, FileText, Loader2, Copy, Download, CheckCircle, AlertCircle, Settings, Sparkles, Zap } from 'lucide-react';

// Type definitions
interface UploadedFile {
  name: string;
  size: number;
  content: string;
}

interface ContextPack {
  projectName: string;
  tagline: string;
  productOrSolution: string;
  problemSpace: string;
  targetCustomers: string;
  valueProposition: string;
  keyFeatures: string[];
  technicalStack: string;
  metricsAndResults: string;
  constraintsAndRisks: string;
  rawSummary: string;
}

interface ProjectParams {
  projectName: string;
  tagline: string;
  shortDescription: string;
  icp: string;
  persona: string;
  tone: string;
  docLanguage: Language;
}

type Language = 'pt-PT' | 'en';
type DocType = 'onepager' | 'pitch' | 'roi' | 'faq' | 'datasheet' | 'blueprint' | 'playbook' | 'battlecard' | 'email';
type FrameworkMode = 'recommended' | 'custom';

interface GeneratedDoc {
  content: string;
  timestamp: number;
}

const CommercialKitGenerator: React.FC = () => {
  // State management
  const [language, setLanguage] = useState<Language>('pt-PT');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [contextPack, setContextPack] = useState<ContextPack | null>(null);
  const [params, setParams] = useState<ProjectParams>({
    projectName: '',
    tagline: '',
    shortDescription: '',
    icp: 'SaaS B2B',
    persona: 'CEO / Founder',
    tone: 'balanced',
    docLanguage: 'pt-PT'
  });
  
  const [activeTab, setActiveTab] = useState<DocType>('onepager');
  const [generatedDocs, setGeneratedDocs] = useState<Record<DocType, GeneratedDoc | null>>({
    onepager: null,
    pitch: null,
    roi: null,
    faq: null,
    datasheet: null,
    blueprint: null,
    playbook: null,
    battlecard: null,
    email: null
  });
  
  const [frameworkModes, setFrameworkModes] = useState<Record<DocType, FrameworkMode>>({
    onepager: 'recommended',
    pitch: 'recommended',
    roi: 'recommended',
    faq: 'recommended',
    datasheet: 'recommended',
    blueprint: 'recommended',
    playbook: 'recommended',
    battlecard: 'recommended',
    email: 'recommended'
  });
  
  const [customPrompts, setCustomPrompts] = useState<Record<DocType, string>>({} as Record<DocType, string>);
  
  const [loading, setLoading] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState<DocType | null>(null);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [showParams, setShowParams] = useState(true);

  // Reactive prompts - update custom prompts when params change
  useEffect(() => {
    if (!contextPack) return;
    
    // Update all custom prompts when params change
    const newCustomPrompts: Record<DocType, string> = {} as Record<DocType, string>;
    Object.keys(customPrompts).forEach((docType) => {
      if (frameworkModes[docType as DocType] === 'custom') {
        newCustomPrompts[docType as DocType] = getRecommendedPrompt(docType as DocType, params.docLanguage);
      }
    });
    
    if (Object.keys(newCustomPrompts).length > 0) {
      setCustomPrompts(prev => ({ ...prev, ...newCustomPrompts }));
    }
  }, [params, contextPack]);

  // Translations
  const t = {
    'pt-PT': {
      title: 'Commercial Kit Generator',
      subtitle: 'Materiais comerciais profissionais powered by AI',
      phase2: 'v2.0 - 9 Tipos de Documentos',
      languageLabel: 'Idioma da app:',
      uploadTitle: 'Upload de Documentos',
      uploadDesc: 'Arrasta ficheiros aqui ou clica para selecionar',
      uploadButton: 'Selecionar Ficheiros',
      filesUploaded: 'ficheiros',
      createContextButton: 'Criar Context Pack',
      contextPackTitle: 'Context Pack',
      configureParams: 'Parâmetros',
      toggleParams: 'Toggle',
      projectNameLabel: 'Nome do Projeto',
      taglineLabel: 'Tagline',
      shortDescLabel: 'Descrição',
      icpLabel: 'ICP',
      personaLabel: 'Persona',
      toneLabel: 'Tom',
      docLanguageLabel: 'Idioma Docs',
      frameworkLabel: 'Framework',
      frameworkRecommended: 'Recomendado',
      frameworkCustom: 'Custom (Avançado)',
      generateButton: 'Gerar Documento',
      copyToClipboard: 'Copiar',
      downloadMd: 'Download',
      regenerate: 'Regenerar',
      backToUpload: 'Novo Projeto',
      copied: 'Copiado!',
      generating: 'A gerar...',
      notGenerated: 'Documento não gerado. Configura os parâmetros e clica em "Gerar Documento".',
      tabs: {
        onepager: 'One-Pager',
        pitch: 'Pitch Deck',
        roi: 'ROI/TCO',
        faq: 'FAQ',
        datasheet: 'Datasheet',
        blueprint: 'Blueprint',
        playbook: 'Playbook',
        battlecard: 'Battlecard',
        email: 'Email'
      },
      toneOptions: {
        business: 'Business',
        technical: 'Técnico',
        balanced: 'Equilibrado'
      },
      personaOptions: {
        ceo: 'CEO / Founder',
        coo: 'COO / Operações',
        head_cs: 'Head CS',
        it: 'IT / Tech',
        other: 'Outro'
      },
      icpOptions: {
        saas: 'SaaS B2B',
        pme: 'PME Industrial',
        prof: 'Serviços Pro',
        other: 'Outro'
      },
      steps: {
        parsing: 'A analisar ficheiros',
        extracting: 'A extrair informação',
        consolidating: 'A consolidar',
        generating: 'A gerar'
      }
    },
    'en': {
      title: 'Commercial Kit Generator',
      subtitle: 'Professional commercial materials powered by AI',
      phase2: 'v2.0 - 9 Document Types',
      languageLabel: 'App Language:',
      uploadTitle: 'Document Upload',
      uploadDesc: 'Drag files here or click to select',
      uploadButton: 'Select Files',
      filesUploaded: 'files',
      createContextButton: 'Create Context Pack',
      contextPackTitle: 'Context Pack',
      configureParams: 'Parameters',
      toggleParams: 'Toggle',
      projectNameLabel: 'Project Name',
      taglineLabel: 'Tagline',
      shortDescLabel: 'Description',
      icpLabel: 'ICP',
      personaLabel: 'Persona',
      toneLabel: 'Tone',
      docLanguageLabel: 'Doc Language',
      frameworkLabel: 'Framework',
      frameworkRecommended: 'Recommended',
      frameworkCustom: 'Custom (Advanced)',
      generateButton: 'Generate Document',
      copyToClipboard: 'Copy',
      downloadMd: 'Download',
      regenerate: 'Regenerate',
      backToUpload: 'New Project',
      copied: 'Copied!',
      generating: 'Generating...',
      notGenerated: 'Document not generated. Configure parameters and click "Generate Document".',
      tabs: {
        onepager: 'One-Pager',
        pitch: 'Pitch Deck',
        roi: 'ROI/TCO',
        faq: 'FAQ',
        datasheet: 'Datasheet',
        blueprint: 'Blueprint',
        playbook: 'Playbook',
        battlecard: 'Battlecard',
        email: 'Email'
      },
      toneOptions: {
        business: 'Business',
        technical: 'Technical',
        balanced: 'Balanced'
      },
      personaOptions: {
        ceo: 'CEO / Founder',
        coo: 'COO / Operations',
        head_cs: 'Head CS',
        it: 'IT / Tech',
        other: 'Other'
      },
      icpOptions: {
        saas: 'SaaS B2B',
        pme: 'Industrial SME',
        prof: 'Professional Services',
        other: 'Other'
      },
      steps: {
        parsing: 'Parsing files',
        extracting: 'Extracting info',
        consolidating: 'Consolidating',
        generating: 'Generating'
      }
    }
  };

  const text = t[language];

  // Framework Templates - ALWAYS use current params
  const getRecommendedPrompt = (docType: DocType, docLang: Language): string => {
    const ctx = contextPack ? JSON.stringify(contextPack, null, 2) : '';
    const lang = docLang === 'pt-PT' ? 'Português de Portugal (PT-PT)' : 'English';
    const toneDesc = params.tone === 'business' 
      ? (docLang === 'pt-PT' ? 'empresarial e estratégico' : 'business and strategic')
      : params.tone === 'technical'
      ? (docLang === 'pt-PT' ? 'técnico mas acessível' : 'technical but accessible')
      : (docLang === 'pt-PT' ? 'equilibrado entre negócio e técnica' : 'balanced between business and technical');

    const prompts: Record<DocType, Record<Language, string>> = {
      onepager: {
        'pt-PT': `Cria um Commercial One-Pager profissional em **Português de Portugal (PT-PT)** usando o framework AIDA + 3W.

CONTEXTO DO PROJETO:
- Nome: ${params.projectName}
- Tagline: ${params.tagline}
- Descrição: ${params.shortDescription}
- ICP: ${params.icp}
- Persona: ${params.persona}
- Tom: ${toneDesc}

INFORMAÇÃO TÉCNICA:
${ctx}

ESTRUTURA OBRIGATÓRIA (em Markdown):

# ${params.projectName}
## ${params.tagline}

### Problema / Contexto
- [3-5 bullets sobre o problema, contexto de mercado, pressões no negócio]

### Solução
[2-3 parágrafos curtos sobre como o projeto resolve o problema]

### Para Quem É Isto?
[Descrição clara do ICP e persona: ${params.icp}, ${params.persona}]

### Benefícios & Impacto
- [3-5 bullets com benefícios concretos]
- [Incluir 1-2 "hero numbers" se existirem métricas no contexto]

### Prova & Mitigação de Risco
- [2-3 bullets sobre proof points, abordagem à segurança/compliance, human-in-the-loop]

### Próximo Passo
**Agende uma demonstração de 30 minutos** para ver como ${params.projectName} pode [benefício principal] na sua organização.

INSTRUÇÕES:
- Tom: ${toneDesc}
- Linguagem: PT-PT formal-profissional
- Foco na persona: ${params.persona}
- Ser concreto, evitar clichés de marketing
- Usar números e factos do contexto quando disponíveis`,
        'en': `Create a professional Commercial One-Pager in **English** using the AIDA + 3W framework.

PROJECT CONTEXT:
- Name: ${params.projectName}
- Tagline: ${params.tagline}
- Description: ${params.shortDescription}
- ICP: ${params.icp}
- Persona: ${params.persona}
- Tone: ${toneDesc}

TECHNICAL INFORMATION:
${ctx}

MANDATORY STRUCTURE (in Markdown):

# ${params.projectName}
## ${params.tagline}

### Problem / Context
- [3-5 bullets about the problem, market context, business pressures]

### Solution
[2-3 short paragraphs about how the project solves the problem]

### Who Is This For?
[Clear description of ICP and persona: ${params.icp}, ${params.persona}]

### Benefits & Impact
- [3-5 bullets with concrete benefits]
- [Include 1-2 "hero numbers" if metrics exist in context]

### Proof & Risk Mitigation
- [2-3 bullets about proof points, security/compliance approach, human-in-the-loop]

### Next Step
**Book a 30-minute demo** to see how ${params.projectName} can [main benefit] in your organization.

INSTRUCTIONS:
- Tone: ${toneDesc}
- Language: Professional English
- Focus on persona: ${params.persona}
- Be concrete, avoid marketing clichés
- Use numbers and facts from context when available`
      },
      pitch: {
        'pt-PT': `Cria um Pitch Deck Outline (máx. 10 slides) em **Português de Portugal (PT-PT)** usando storytelling: Problema → Implicações → Visão → Solução → Prova → Próximos Passos.

CONTEXTO: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | Persona: ${params.persona}
Tom: ${toneDesc}
INFORMAÇÃO: ${ctx}

ESTRUTURA (10 slides máximo):

## Slide 1: Título & Promessa
**Título:** [título impactante baseado em ${params.tagline}]
**Conteúdo:**
- [3-5 bullets]
**Notas do apresentador:** [mensagem chave em 1-2 frases]

## Slide 2: Problema / Status Quo
**Conteúdo:**
- [descrição do problema actual alinhado com ${params.icp}]
**Notas do apresentador:** [insight chave]

## Slide 3: Implicações para o Negócio
**Conteúdo:**
- [custo de inação, riscos para ${params.persona}]
**Notas do apresentador:** [urgência]

## Slide 4: Visão ("Promised Land")
**Conteúdo:**
- [como o mundo poderia ser em 6-12 meses com ${params.projectName}]
**Notas do apresentador:** [inspiração]

## Slide 5: Solução Overview
**Conteúdo:**
- [descrição da solução: ${params.shortDescription}]
**Notas do apresentador:** [diferenciação]

## Slide 6: Arquitectura / Abordagem (30% tech, 70% business)
**Conteúdo:**
- [visão high-level da abordagem]
**Notas do apresentador:** [credibilidade técnica]

## Slide 7: Prova & Métricas
**Conteúdo:**
- [métricas, resultados, ou projecções]
**Notas do apresentador:** [confiança]

## Slide 8: Risco & Confiança
**Conteúdo:**
- [compliance, human-in-control, segurança]
**Notas do apresentador:** [tranquilização]

## Slide 9: Casos de Uso / Cenários
**Conteúdo:**
- [exemplos concretos para ${params.icp}]
**Notas do apresentador:** [aplicabilidade]

## Slide 10: Próximos Passos & CTA
**Conteúdo:**
- [call to action claro]
**Notas do apresentador:** [fechamento]

Tom: ${toneDesc}`,
        'en': `Create a Pitch Deck Outline (max 10 slides) in **English** using storytelling: Problem → Implications → Vision → Solution → Proof → Next Steps.

CONTEXT: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | Persona: ${params.persona}
Tone: ${toneDesc}
INFORMATION: ${ctx}

STRUCTURE (10 slides maximum):

## Slide 1: Title & Promise
**Title:** [impactful title based on ${params.tagline}]
**Content:**
- [3-5 bullets]
**Speaker notes:** [key message in 1-2 sentences]

## Slide 2: Problem / Status Quo
**Content:**
- [current problem description aligned with ${params.icp}]
**Speaker notes:** [key insight]

## Slide 3: Business Implications
**Content:**
- [cost of inaction, risks for ${params.persona}]
**Speaker notes:** [urgency]

## Slide 4: Vision ("Promised Land")
**Content:**
- [how the world could look in 6-12 months with ${params.projectName}]
**Speaker notes:** [inspiration]

## Slide 5: Solution Overview
**Content:**
- [solution description: ${params.shortDescription}]
**Speaker notes:** [differentiation]

## Slide 6: Architecture / Approach (30% tech, 70% business)
**Content:**
- [high-level approach view]
**Speaker notes:** [technical credibility]

## Slide 7: Proof & Metrics
**Content:**
- [metrics, results, or projections]
**Speaker notes:** [confidence]

## Slide 8: Risk & Trust
**Content:**
- [compliance, human-in-control, security]
**Speaker notes:** [reassurance]

## Slide 9: Use Cases / Scenarios
**Content:**
- [concrete examples for ${params.icp}]
**Speaker notes:** [applicability]

## Slide 10: Next Steps & CTA
**Content:**
- [clear call to action]
**Speaker notes:** [closing]

Tone: ${toneDesc}`
      },
      roi: {
        'pt-PT': `Cria um ROI / TCO One-Pager em **PT-PT** com 3 cenários.

PROJETO: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | Persona: ${params.persona}
Tom: ${toneDesc}
CONTEXTO: ${ctx}

ESTRUTURA:

# ROI / TCO: ${params.projectName}

## Introdução
[2-3 frases sobre o que está em jogo para ${params.persona} em ${params.icp}: custos, pressão na equipa, risco]

## Pressupostos Base
[Resumir do contexto: volume baseline, custo por FTE, etc.]

## Cenários de Impacto

| Cenário | Volume | Automação/Impacto | Horas Poupadas | Poupança Anual Estimada |
|---------|--------|-------------------|----------------|-------------------------|
| A - Pequeno | [ex: 100/mês] | [ex: 30%] | [ex: 120h/ano] | [ex: €6.000-€10.000] |
| B - Médio | [ex: 500/mês] | [ex: 50%] | [ex: 600h/ano] | [ex: €30.000-€50.000] |
| C - Grande | [ex: 2000/mês] | [ex: 70%] | [ex: 2400h/ano] | [ex: €120.000-€200.000] |

## O Que Está Incluído no TCO
- Infraestrutura e licenças
- Serviços de implementação
- Suporte e manutenção

## Mensagem para ${params.persona}
- **Timeframe de ROI:** [range, ex: 3-9 meses]
- **Benefícios qualitativos:** satisfação do cliente, saúde da equipa, redução de burnout

## Próximo Passo
Proposta de workshop ROI (1-2h) com os números reais da vossa operação.

Tom: ${toneDesc}`,
        'en': `Create an ROI / TCO One-Pager in **English** with 3 scenarios.

PROJECT: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | Persona: ${params.persona}
Tone: ${toneDesc}
CONTEXT: ${ctx}

STRUCTURE:

# ROI / TCO: ${params.projectName}

## Introduction
[2-3 sentences about what's at stake for ${params.persona} in ${params.icp}: costs, team pressure, risk]

## Base Assumptions
[Summarize from context: baseline volume, cost per FTE, etc.]

## Impact Scenarios

| Scenario | Volume | Automation/Impact | Hours Saved | Estimated Annual Savings |
|----------|--------|-------------------|-------------|--------------------------|
| A - Small | [e.g.: 100/month] | [e.g.: 30%] | [e.g.: 120h/year] | [e.g.: $8,000-$12,000] |
| B - Medium | [e.g.: 500/month] | [e.g.: 50%] | [e.g.: 600h/year] | [e.g.: $40,000-$60,000] |
| C - Large | [e.g.: 2000/month] | [e.g.: 70%] | [e.g.: 2400h/year] | [e.g.: $160,000-$240,000] |

## What's Included in TCO
- Infrastructure and licenses
- Implementation services
- Support and maintenance

## Key Message for ${params.persona}
- **ROI Timeframe:** [range, e.g.: 3-9 months]
- **Qualitative benefits:** customer satisfaction, team health, reduced burnout

## Next Step
ROI workshop proposal (1-2h) with your operation's real numbers.

Tone: ${toneDesc}`
      },
      faq: {
        'pt-PT': `Cria um Executive FAQ em **PT-PT** organizado por temas, com tom pragmático-formal.

PROJETO: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | Persona: ${params.persona}
Tom: ${toneDesc}
CONTEXTO: ${ctx}

ESTRUTURA:

# FAQ Executivo: ${params.projectName}

## 1. Produto & Utilização

**Q: O que é ${params.projectName}?**
A: [2-5 frases baseadas em ${params.shortDescription}]

**Q: Para quem é ${params.projectName}?**
A: [resposta focada em ${params.icp}]

[Mais 2-3 FAQs nesta secção]

## 2. AI & Modelos

**Q: Que modelos de AI são utilizados?**
A: [resposta baseada no contexto]

[3-4 FAQs]

## 3. Dados & Privacidade (GDPR)

**Q: Como são tratados os dados pessoais?**
A: [resposta]

**Q: Onde são armazenados os dados?**
A: [resposta]

[4-5 FAQs]

## 4. Regulamentação (AI Act, se relevante)

**Q: [pergunta sobre conformidade regulamentar]**
A: [resposta]

[2-3 FAQs se aplicável]

## 5. Segurança & Operações

**Q: Que medidas de segurança existem?**
A: [resposta]

[3-4 FAQs]

## 6. Custos, ROI & Roadmap

**Q: Qual é o modelo de pricing?**
A: [resposta baseada no que existe no contexto, ou indicar "a definir com cada cliente"]

**Q: Quando vejo resultados?**
A: [resposta]

[3-4 FAQs]

Tom: ${toneDesc}, focado em ${params.persona}, evitar jargão desnecessário`,
        'en': `Create an Executive FAQ in **English** organized by themes, with pragmatic-formal tone.

PROJECT: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | Persona: ${params.persona}
Tone: ${toneDesc}
CONTEXT: ${ctx}

STRUCTURE:

# Executive FAQ: ${params.projectName}

## 1. Product & Usage

**Q: What is ${params.projectName}?**
A: [2-5 sentences based on ${params.shortDescription}]

**Q: Who is ${params.projectName} for?**
A: [answer focused on ${params.icp}]

[2-3 more FAQs in this section]

## 2. AI & Models

**Q: Which AI models are used?**
A: [answer based on context]

[3-4 FAQs]

## 3. Data & Privacy (GDPR)

**Q: How is personal data handled?**
A: [answer]

**Q: Where is data stored?**
A: [answer]

[4-5 FAQs]

## 4. Regulation (AI Act, if relevant)

**Q: [question about regulatory compliance]**
A: [answer]

[2-3 FAQs if applicable]

## 5. Security & Operations

**Q: What security measures exist?**
A: [answer]

[3-4 FAQs]

## 6. Costs, ROI & Roadmap

**Q: What is the pricing model?**
A: [answer based on what exists in context, or indicate "to be defined with each client"]

**Q: When do I see results?**
A: [answer]

[3-4 FAQs]

Tone: ${toneDesc}, focused on ${params.persona}, avoid unnecessary jargon`
      },
      datasheet: {
        'pt-PT': `Cria um Technical Datasheet em **PT-PT** estilo vendor clássico.

PROJETO: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | Persona: ${params.persona}
Tom: ${toneDesc}
CONTEXTO: ${ctx}

ESTRUTURA:

# Technical Datasheet: ${params.projectName}

## Overview
${params.shortDescription}

[Expandir em 1-2 parágrafos adicionais sobre contexto técnico-funcional]

## Benefícios Chave
- [4-6 bullets, mix de IT + business value para ${params.persona}]

## Features & Capacidades

### [Bloco Funcional 1, ex: "Processamento de Documentos"]
- Feature A: [descrição 1 linha]
- Feature B: [descrição]

### [Bloco Funcional 2, ex: "AI & Automação"]
- Feature C: [descrição]
- Feature D: [descrição]

### [Bloco Funcional 3, ex: "Integração & APIs"]
- Feature E: [descrição]

## Arquitectura Overview
[Descrição textual breve das camadas principais, sem gráficos]

Camadas:
- **Edge / Acesso:** [descrição]
- **Application / API:** [descrição]
- **Data / Storage:** [descrição]
- **AI / LLM:** [descrição]
- **Observability:** [descrição]

## Especificações Técnicas

**Tech Stack:**
- [lista das tecnologias do contexto]

**Limites / Targets:**
- Latência: [ex: <500ms P95, se conhecido]
- Disponibilidade: [ex: SLO 99.5%, se conhecido]
- Throughput: [se conhecido]

## Requisitos & Dependências

**O que o cliente precisa ter:**
- [sistemas, conectividade, roles necessários para ${params.icp}]

## Segurança & Compliance

**Encriptação:** [em trânsito e em repouso]
**Controlo de Acesso:** [RBAC, SSO, etc.]
**Backups:** [estratégia]
**Standards/Regulation:** [GDPR, ISO, AI Act, etc. se aplicável]

Tom: ${toneDesc}`,
        'en': `Create a Technical Datasheet in **English** classic vendor style.

PROJECT: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | Persona: ${params.persona}
Tone: ${toneDesc}
CONTEXT: ${ctx}

STRUCTURE:

# Technical Datasheet: ${params.projectName}

## Overview
${params.shortDescription}

[Expand in 1-2 additional paragraphs about technical-functional context]

## Key Benefits
- [4-6 bullets, mix of IT + business value for ${params.persona}]

## Features & Capabilities

### [Functional Block 1, e.g.: "Document Processing"]
- Feature A: [1-line description]
- Feature B: [description]

### [Functional Block 2, e.g.: "AI & Automation"]
- Feature C: [description]
- Feature D: [description]

### [Functional Block 3, e.g.: "Integration & APIs"]
- Feature E: [description]

## Architecture Overview
[Brief textual description of main layers, no graphics]

Layers:
- **Edge / Access:** [description]
- **Application / API:** [description]
- **Data / Storage:** [description]
- **AI / LLM:** [description]
- **Observability:** [description]

## Technical Specifications

**Tech Stack:**
- [list of technologies from context]

**Limits / Targets:**
- Latency: [e.g.: <500ms P95, if known]
- Availability: [e.g.: SLO 99.5%, if known]
- Throughput: [if known]

## Requirements & Dependencies

**What the client needs to have:**
- [systems, connectivity, required roles for ${params.icp}]

## Security & Compliance

**Encryption:** [in transit and at rest]
**Access Control:** [RBAC, SSO, etc.]
**Backups:** [strategy]
**Standards/Regulation:** [GDPR, ISO, AI Act, etc. if applicable]

Tone: ${toneDesc}`
      },
      blueprint: {
        'pt-PT': `Cria um Technical Blueprint (text-based, C4-inspired) em **PT-PT**.

PROJETO: ${params.projectName} | ${params.tagline}
Tom: ${toneDesc}
CONTEXTO: ${ctx}

ESTRUTURA:

# Technical Blueprint: ${params.projectName}

## 1. Scope & Objectivo
[2-3 frases sobre o scope arquitectural e objectivo principal de ${params.projectName}]

## 2. Princípios Arquitecturais
- [Princípio 1: ex: "Security by design"]
- [Princípio 2: ex: "Human-in-the-loop obrigatório"]
- [Princípio 3: ex: "Cloud-first, local fallback"]
- [Princípio 4: ex: "Observable desde day one"]
- [Princípio 5: ex: "Compliance-ready"]

## 3. High-Level Architecture

### Main Containers:

**Edge / Access**
- [descrição: reverse proxy, rate limiting, auth gateway]

**Application / API**
- [descrição: business logic, orchestration]

**Data / Storage**
- [descrição: databases, object storage, caching]

**AI / LLM / RAG**
- [descrição: model serving, vector DB, prompt management]

**Observability**
- [descrição: logs, metrics, traces, alerting]

**Operations / Backups**
- [descrição: CI/CD, backup strategy, DR]

## 4. Data Flow - Cenário Chave

**Cenário:** [ex: "User submits document for analysis in ${params.projectName}"]

**Passos:**
1. [User request arrives at Edge]
2. [Auth & rate limit check]
3. [Request routed to API]
4. [Document stored in Object Storage]
5. [AI pipeline triggered]
6. [LLM processes with RAG context]
7. [Result stored in DB]
8. [Response returned to user]
9. [Logs/metrics emitted]
10. [Async notification if needed]

## 5. Security & Compliance Hooks

**Edge:** [TLS termination, WAF, DDoS protection]
**Auth:** [OAuth2/OIDC, RBAC enforcement]
**DB:** [encryption at rest, field-level encryption for PII]
**Logs:** [audit trail, GDPR-compliant retention]
**External Providers:** [DPA agreements, data residency controls]

Tom: ${toneDesc}`,
        'en': `Create a Technical Blueprint (text-based, C4-inspired) in **English**.

PROJECT: ${params.projectName} | ${params.tagline}
Tone: ${toneDesc}
CONTEXT: ${ctx}

STRUCTURE:

# Technical Blueprint: ${params.projectName}

## 1. Scope & Objective
[2-3 sentences about architectural scope and main objective of ${params.projectName}]

## 2. Architectural Principles
- [Principle 1: e.g.: "Security by design"]
- [Principle 2: e.g.: "Human-in-the-loop mandatory"]
- [Principle 3: e.g.: "Cloud-first, local fallback"]
- [Principle 4: e.g.: "Observable from day one"]
- [Principle 5: e.g.: "Compliance-ready"]

## 3. High-Level Architecture

### Main Containers:

**Edge / Access**
- [description: reverse proxy, rate limiting, auth gateway]

**Application / API**
- [description: business logic, orchestration]

**Data / Storage**
- [description: databases, object storage, caching]

**AI / LLM / RAG**
- [description: model serving, vector DB, prompt management]

**Observability**
- [description: logs, metrics, traces, alerting]

**Operations / Backups**
- [description: CI/CD, backup strategy, DR]

## 4. Data Flow - Key Scenario

**Scenario:** [e.g.: "User submits document for analysis in ${params.projectName}"]

**Steps:**
1. [User request arrives at Edge]
2. [Auth & rate limit check]
3. [Request routed to API]
4. [Document stored in Object Storage]
5. [AI pipeline triggered]
6. [LLM processes with RAG context]
7. [Result stored in DB]
8. [Response returned to user]
9. [Logs/metrics emitted]
10. [Async notification if needed]

## 5. Security & Compliance Hooks

**Edge:** [TLS termination, WAF, DDoS protection]
**Auth:** [OAuth2/OIDC, RBAC enforcement]
**DB:** [encryption at rest, field-level encryption for PII]
**Logs:** [audit trail, GDPR-compliant retention]
**External Providers:** [DPA agreements, data residency controls]

Tone: ${toneDesc}`
      },
      playbook: {
        'pt-PT': `Cria um Sales Playbook em **PT-PT** com Message House + SPIN + Objecções.

PROJETO: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | PERSONA: ${params.persona}
Tom: ${toneDesc}
CONTEXTO: ${ctx}

ESTRUTURA:

# Sales Playbook: ${params.projectName}

## 1. ICP & Personas

**ICP Principal:** ${params.icp}
[Descrição breve: sector, tamanho, maturidade, pain points típicos]

**Persona Primária:** ${params.persona}
[Descrição: responsabilidades, KPIs, pressões diárias, motivações]

**Personas Secundárias:**
- [Persona 2: ex: CTO - descrição breve]
- [Persona 3: ex: CFO - descrição breve]

## 2. Message House

**Promessa Principal:**
${params.tagline}

**Pilar 1: [ex: "Eficiência Operacional"]**
- Proof point 1: [facto concreto]
- Proof point 2: [métrica ou resultado]

**Pilar 2: [ex: "Qualidade & Consistência"]**
- Proof point 1: [facto]
- Proof point 2: [resultado]

**Pilar 3: [ex: "Segurança & Compliance"]**
- Proof point 1: [facto]
- Proof point 2: [standard]

**Pilar 4: [ex: "ROI Rápido"]**
- Proof point 1: [timeframe]
- Proof point 2: [exemplo]

## 3. Discovery Questions (SPIN)

### Situação
- [pergunta sobre estado actual relevante para ${params.persona}]
- [pergunta sobre processos existentes]

### Problema
- [pergunta sobre pain points específicos de ${params.icp}]
- [pergunta sobre desafios]

### Implicação
- [pergunta sobre custo de inação]
- [pergunta sobre riscos]

### Need-Payoff
- [pergunta sobre benefícios desejados]
- [pergunta sobre resultado ideal]

## 4. Sales Flow Básico

### Stage 1: Contacto Inicial
**Objectivo:** [ex: agendar discovery call]
**Deliverable:** [ex: reunião agendada com 2-3 stakeholders]

### Stage 2: Discovery
**Objectivo:** [qualificar fit, entender pain]
**Deliverable:** [doc de discovery preenchido]

### Stage 3: Vision / Demo
**Objectivo:** [mostrar "promised land"]
**Deliverable:** [vision deck apresentado, sponsor identificado]

### Stage 4: ROI / Business Case
**Objectivo:** [quantificar valor]
**Deliverable:** [ROI one-pager com números reais do cliente]

### Stage 5: Validação Técnica
**Objectivo:** [tech eval, security review]
**Deliverable:** [POC concluído, IT sign-off]

### Stage 6: Proposta & Negociação
**Objectivo:** [fechar deal]
**Deliverable:** [contrato assinado]

## 5. Objecções & Respostas

### Objecção 1: "É muito caro"
**Por trás:** [receio de não conseguir ROI]
**Resposta curta:** [1 frase]
**Resposta longa:** [2-3 frases focadas em ROI e TCO]
**Follow-up:** [pergunta para aprofundar: "Qual é o custo actual de...?"]

### Objecção 2: "Já temos uma solução"
**Por trás:** [resistência à mudança, sunk cost]
**Resposta curta:** [1 frase]
**Resposta longa:** [2-3 frases sobre gaps da solução actual]
**Follow-up:** [pergunta: "Como está a funcionar em X cenário?"]

### Objecção 3: "Não temos budget agora"
**Por trás:** [não é prioridade]
**Resposta curta:** [1 frase]
**Resposta longa:** [2-3 frases sobre custo de adiamento]
**Follow-up:** [pergunta: "Quando é o próximo ciclo de budget?"]

### Objecção 4: "E se a AI falhar?"
**Por trás:** [medo de risco reputacional]
**Resposta curta:** [1 frase]
**Resposta longa:** [2-3 frases sobre human-in-the-loop e controls]
**Follow-up:** [pergunta: "Que tipo de falha é mais preocupante para si?"]

### Objecção 5: "Não sabemos se a equipa vai adoptar"
**Por trás:** [change management]
**Resposta curta:** [1 frase]
**Resposta longa:** [2-3 frases sobre onboarding e quick wins]
**Follow-up:** [pergunta: "Qual foi a última ferramenta que adoptaram com sucesso?"]

[Adicionar 2-3 objecções adicionais relevantes ao projeto]

Tom: ${toneDesc}, focado em ${params.icp}`,
        'en': `Create a Sales Playbook in **English** with Message House + SPIN + Objections.

PROJECT: ${params.projectName} | ${params.tagline}
ICP: ${params.icp} | PERSONA: ${params.persona}
Tone: ${toneDesc}
CONTEXT: ${ctx}

STRUCTURE:

# Sales Playbook: ${params.projectName}

## 1. ICP & Personas

**Primary ICP:** ${params.icp}
[Brief description: sector, size, maturity, typical pain points]

**Primary Persona:** ${params.persona}
[Description: responsibilities, KPIs, daily pressures, motivations]

**Secondary Personas:**
- [Persona 2: e.g.: CTO - brief description]
- [Persona 3: e.g.: CFO - brief description]

## 2. Message House

**Main Promise:**
${params.tagline}

**Pillar 1: [e.g.: "Operational Efficiency"]**
- Proof point 1: [concrete fact]
- Proof point 2: [metric or result]

**Pillar 2: [e.g.: "Quality & Consistency"]**
- Proof point 1: [fact]
- Proof point 2: [result]

**Pillar 3: [e.g.: "Security & Compliance"]**
- Proof point 1: [fact]
- Proof point 2: [standard]

**Pillar 4: [e.g.: "Fast ROI"]**
- Proof point 1: [timeframe]
- Proof point 2: [example]

## 3. Discovery Questions (SPIN)

### Situation
- [question about current state relevant to ${params.persona}]
- [question about existing processes]

### Problem
- [question about pain points specific to ${params.icp}]
- [question about challenges]

### Implication
- [question about cost of inaction]
- [question about risks]

### Need-Payoff
- [question about desired benefits]
- [question about ideal outcome]

## 4. Basic Sales Flow

### Stage 1: Initial Contact
**Objective:** [e.g.: schedule discovery call]
**Deliverable:** [e.g.: meeting scheduled with 2-3 stakeholders]

### Stage 2: Discovery
**Objective:** [qualify fit, understand pain]
**Deliverable:** [filled discovery doc]

### Stage 3: Vision / Demo
**Objective:** [show "promised land"]
**Deliverable:** [vision deck presented, sponsor identified]

### Stage 4: ROI / Business Case
**Objective:** [quantify value]
**Deliverable:** [ROI one-pager with client's real numbers]

### Stage 5: Technical Validation
**Objective:** [tech eval, security review]
**Deliverable:** [POC completed, IT sign-off]

### Stage 6: Proposal & Negotiation
**Objective:** [close deal]
**Deliverable:** [signed contract]

## 5. Objections & Responses

### Objection 1: "It's too expensive"
**Behind it:** [fear of not achieving ROI]
**Short answer:** [1 sentence]
**Long answer:** [2-3 sentences focused on ROI and TCO]
**Follow-up:** [question to dig deeper: "What's the current cost of...?"]

### Objection 2: "We already have a solution"
**Behind it:** [resistance to change, sunk cost]
**Short answer:** [1 sentence]
**Long answer:** [2-3 sentences about current solution gaps]
**Follow-up:** [question: "How is it working in X scenario?"]

### Objection 3: "We don't have budget now"
**Behind it:** [not a priority]
**Short answer:** [1 sentence]
**Long answer:** [2-3 sentences about cost of delay]
**Follow-up:** [question: "When is the next budget cycle?"]

### Objection 4: "What if the AI fails?"
**Behind it:** [fear of reputational risk]
**Short answer:** [1 sentence]
**Long answer:** [2-3 sentences about human-in-the-loop and controls]
**Follow-up:** [question: "What type of failure concerns you most?"]

### Objection 5: "We don't know if the team will adopt it"
**Behind it:** [change management]
**Short answer:** [1 sentence]
**Long answer:** [2-3 sentences about onboarding and quick wins]
**Follow-up:** [question: "What was the last tool you successfully adopted?"]

[Add 2-3 additional objections relevant to the project]

Tone: ${toneDesc}, focused on ${params.icp}`
      },
      battlecard: {
        'pt-PT': `Cria um Battlecard em **PT-PT** focado em TIPOS de competição (não marcas).

PROJETO: ${params.projectName} | ${params.tagline}
ICP: ${params.icp}
Tom: ${toneDesc}
CONTEXTO: ${ctx}

ESTRUTURA:

# Battlecard: ${params.projectName}

## Tipo de Competidor 1: "Ferramentas Genéricas Baratas"

**Exemplos:** [ex: "ferramentas no-code genéricas, scripts DIY"]

**Onde são percebidos como fortes:**
- Custo inicial baixo
- Fácil de começar
- Sem compromisso de longo prazo

**Onde ${params.projectName} é mais forte:**
- [3-4 bullets sobre vantagens específicas para ${params.icp}]
- [foco em: especialização, qualidade, compliance, suporte]

**Mensagem de posicionamento:**
[2-3 frases curtas sobre quando escolher ${params.projectName} vs ferramentas genéricas]

---

## Tipo de Competidor 2: "Big Suite Vendors"

**Exemplos:** [ex: "plataformas enterprise all-in-one"]

**Onde são percebidos como fortes:**
- Integração com todo o ecossistema
- Brand recognition
- Suporte enterprise

**Onde ${params.projectName} é mais forte:**
- [3-4 bullets sobre vantagens]
- [foco em: especialização, time-to-value, flexibilidade, custo-benefício]

**Mensagem de posicionamento:**
[2-3 frases]

---

## Tipo de Competidor 3: "Integradores Custom"

**Exemplos:** [ex: "consultoras que fazem implementações à medida"]

**Onde são percebidos como fortes:**
- Total personalização
- Controlo total do cliente
- Propriedade do código

**Onde ${params.projectName} é mais forte:**
- [3-4 bullets sobre vantagens]
- [foco em: time-to-market, manutenção, updates contínuos, best practices]

**Mensagem de posicionamento:**
[2-3 frases]

---

## Tipo de Competidor 4: "Status Quo / Nada"

**Exemplos:** [continuar com processos manuais, equipas internas]

**Onde é percebido como forte:**
- Sem risco de mudança
- Sem custo directo visível
- "Sempre funcionou assim"

**Onde ${params.projectName} é mais forte:**
- [3-4 bullets sobre custo de oportunidade para ${params.icp}]
- [foco em: custo oculto, escalabilidade, qualidade, burnout da equipa]

**Mensagem de posicionamento:**
[2-3 frases sobre o custo real da inacção]

Tom: ${toneDesc}`,
        'en': `Create a Battlecard in **English** focused on TYPES of competition (not brands).

PROJECT: ${params.projectName} | ${params.tagline}
ICP: ${params.icp}
Tone: ${toneDesc}
CONTEXT: ${ctx}

STRUCTURE:

# Battlecard: ${params.projectName}

## Competitor Type 1: "Cheap Generic Tools"

**Examples:** [e.g.: "generic no-code tools, DIY scripts"]

**Where they're perceived as strong:**
- Low initial cost
- Easy to start
- No long-term commitment

**Where ${params.projectName} is stronger:**
- [3-4 bullets about specific advantages for ${params.icp}]
- [focus on: specialization, quality, compliance, support]

**Positioning message:**
[2-3 short sentences about when to choose ${params.projectName} vs generic tools]

---

## Competitor Type 2: "Big Suite Vendors"

**Examples:** [e.g.: "all-in-one enterprise platforms"]

**Where they're perceived as strong:**
- Integration with entire ecosystem
- Brand recognition
- Enterprise support

**Where ${params.projectName} is stronger:**
- [3-4 bullets about advantages]
- [focus on: specialization, time-to-value, flexibility, cost-benefit]

**Positioning message:**
[2-3 sentences]

---

## Competitor Type 3: "Custom Integrators"

**Examples:** [e.g.: "consulting firms doing custom implementations"]

**Where they're perceived as strong:**
- Total customization
- Full client control
- Code ownership

**Where ${params.projectName} is stronger:**
- [3-4 bullets about advantages]
- [focus on: time-to-market, maintenance, continuous updates, best practices]

**Positioning message:**
[2-3 sentences]

---

## Competitor Type 4: "Status Quo / Nothing"

**Examples:** [continue with manual processes, internal teams]

**Where it's perceived as strong:**
- No change risk
- No visible direct cost
- "It's always worked this way"

**Where ${params.projectName} is stronger:**
- [3-4 bullets about opportunity cost for ${params.icp}]
- [focus on: hidden cost, scalability, quality, team burnout]

**Positioning message:**
[2-3 sentences about the real cost of inaction]

Tone: ${toneDesc}`
      },
      email: {
        'pt-PT': `Cria um Email de Primeiro Contacto em **PT-PT** para ${params.persona}.

PROJETO: ${params.projectName}
TAGLINE: ${params.tagline}
DESCRIÇÃO: ${params.shortDescription}
ICP: ${params.icp} | PERSONA: ${params.persona}
Tom: ${toneDesc}
CONTEXTO: ${ctx}

ESTRUTURA:

# Email - Primeiro Contacto

## Variantes de Assunto (escolher uma):

1. [Assunto focado no problema de ${params.persona}]
2. [Assunto focado na solução: ${params.tagline}]
3. [Assunto provocador/questão]

## Corpo do Email:

Olá [Nome],

[**Intro (quem sou, why now):**]
[1-2 frases: apresentação breve + trigger para contactar agora]

[**Framing do problema:**]
[2-3 frases sobre o problema que ${params.persona} em ${params.icp} enfrenta, alinhado com o contexto]

[**Solução:**]
[2-3 linhas sobre ${params.projectName}: ${params.shortDescription}]

[**Benefícios concretos:**]
[1-2 números ou factos específicos do contexto, se disponíveis]

[**CTA:**]
Proposta: conversa de 30 minutos para explorar como [benefício específico] na vossa operação.

Na conversa, podemos cobrir:
- [Ponto 1: ex: "mapeamento rápido do vosso processo actual"]
- [Ponto 2: ex: "exemplos de quick wins em 2-4 semanas"]

Disponível [sugestão de 2-3 slots]?

Cumprimentos,
[Assinatura]

---

## Notas para Personalização:

- **Para CEO/Founder:** foco em strategic impact, ROI, competitive advantage
- **Para COO:** foco em operational efficiency, team productivity, risk reduction
- **Para Head of Customer Service:** foco em customer satisfaction, response time, team burnout
- **Para IT/Architecture:** foco em technical feasibility, integration, security, TCO

Tom: ${toneDesc}, profissional mas acessível, focado em ${params.persona}`,
        'en': `Create a First Contact Email in **English** for ${params.persona}.

PROJECT: ${params.projectName}
TAGLINE: ${params.tagline}
DESCRIPTION: ${params.shortDescription}
ICP: ${params.icp} | PERSONA: ${params.persona}
Tone: ${toneDesc}
CONTEXT: ${ctx}

STRUCTURE:

# Email - First Contact

## Subject Line Variants (choose one):

1. [Subject focused on ${params.persona} problem]
2. [Subject focused on solution: ${params.tagline}]
3. [Provocative subject/question]

## Email Body:

Hi [Name],

[**Intro (who I am, why now):**]
[1-2 sentences: brief introduction + trigger for contacting now]

[**Problem framing:**]
[2-3 sentences about the problem ${params.persona} in ${params.icp} faces, aligned with context]

[**Solution:**]
[2-3 lines about ${params.projectName}: ${params.shortDescription}]

[**Concrete benefits:**]
[1-2 specific numbers or facts from context, if available]

[**CTA:**]
Proposal: 30-minute conversation to explore how [specific benefit] in your operation.

In the conversation, we can cover:
- [Point 1: e.g.: "quick mapping of your current process"]
- [Point 2: e.g.: "examples of quick wins in 2-4 weeks"]

Available [suggest 2-3 slots]?

Best regards,
[Signature]

---

## Personalization Notes:

- **For CEO/Founder:** focus on strategic impact, ROI, competitive advantage
- **For COO:** focus on operational efficiency, team productivity, risk reduction
- **For Head of Customer Service:** focus on customer satisfaction, response time, team burnout
- **For IT/Architecture:** focus on technical feasibility, integration, security, TCO

Tone: ${toneDesc}, professional but accessible, focused on ${params.persona}`
      }
    };

    return prompts[docType][docLang];
  };

  // File handling
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 3) {
      setError(language === 'pt-PT' ? 'Máximo 3 ficheiros permitidos' : 'Maximum 3 files allowed');
      return;
    }

    const newFiles: UploadedFile[] = [];
    for (const file of selectedFiles) {
      if (!file.name.match(/\.(md|txt)$/i)) {
        setError(language === 'pt-PT' ? 'Apenas ficheiros MD e TXT são suportados' : 'Only MD and TXT files supported');
        return;
      }

      const content = await file.text();
      newFiles.push({
        name: file.name,
        size: file.size,
        content
      });
    }

    setFiles(newFiles);
    setError('');
  };

  // Claude API call
  const callClaude = async (prompt: string): Promise<string> => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.content[0].text;
  };

  // Create Context Pack with improved extraction
  const createContextPack = async () => {
    setLoading(true);
    setError('');
    setCurrentStep(text.steps.parsing);

    try {
      const allContent = files.map(f => `=== ${f.name} ===\n\n${f.content}`).join('\n\n');
      setCurrentStep(text.steps.extracting);

      const extractionPrompt = language === 'pt-PT' 
        ? `Analisa os seguintes documentos e extrai informação estruturada sobre o projeto/produto descrito.

DOCUMENTOS:
${allContent}

Responde APENAS com um JSON válido (sem markdown, sem explicações) com esta estrutura:
{
  "projectName": "nome do projeto/produto",
  "tagline": "uma única frase impactante de até 15 palavras que capture a essência do projeto",
  "productOrSolution": "descrição em 2-3 frases completas (não apenas uma frase curta) explicando o que é o produto/solução e o seu valor",
  "problemSpace": "problema que resolve",
  "targetCustomers": "clientes alvo",
  "valueProposition": "proposta de valor principal",
  "keyFeatures": ["feature 1", "feature 2", "feature 3"],
  "technicalStack": "tecnologias mencionadas",
  "metricsAndResults": "métricas, resultados, ou objetivos quantitativos",
  "constraintsAndRisks": "restrições, riscos, ou desafios mencionados"
}

IMPORTANTE:
- tagline: exatamente uma frase de até 15 palavras, impactante
- productOrSolution: 2-3 frases COMPLETAS com pontuação adequada, não apenas uma frase curta
- Se alguma informação não existir nos documentos, usa "Não especificado".`
        : `Analyze the following documents and extract structured information about the described project/product.

DOCUMENTS:
${allContent}

Respond ONLY with valid JSON (no markdown, no explanations) with this structure:
{
  "projectName": "project/product name",
  "tagline": "a single impactful sentence of up to 15 words capturing the project essence",
  "productOrSolution": "description in 2-3 complete sentences (not just one short phrase) explaining what the product/solution is and its value",
  "problemSpace": "problem it solves",
  "targetCustomers": "target customers",
  "valueProposition": "main value proposition",
  "keyFeatures": ["feature 1", "feature 2", "feature 3"],
  "technicalStack": "mentioned technologies",
  "metricsAndResults": "metrics, results, or quantitative objectives",
  "constraintsAndRisks": "mentioned constraints, risks, or challenges"
}

IMPORTANT:
- tagline: exactly one sentence of up to 15 words, impactful
- productOrSolution: 2-3 COMPLETE sentences with proper punctuation, not just one short phrase
- If any information doesn't exist in the documents, use "Not specified".`;

      const result = await callClaude(extractionPrompt);
      setCurrentStep(text.steps.consolidating);

      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid JSON response from Claude');

      const extracted = JSON.parse(jsonMatch[0]);
      const pack: ContextPack = { ...extracted, rawSummary: result };

      setContextPack(pack);
      setParams(prev => ({
        ...prev,
        projectName: extracted.projectName !== 'Não especificado' && extracted.projectName !== 'Not specified' ? extracted.projectName : prev.projectName,
        tagline: extracted.tagline !== 'Não especificado' && extracted.tagline !== 'Not specified' ? extracted.tagline : prev.tagline,
        shortDescription: extracted.productOrSolution !== 'Não especificado' && extracted.productOrSolution !== 'Not specified' ? extracted.productOrSolution : prev.shortDescription
      }));

      await window.storage.set('context-pack-latest', JSON.stringify(pack));
    } catch (err) {
      setError(language === 'pt-PT' 
        ? `Erro ao criar Context Pack: ${err.message}` 
        : `Error creating Context Pack: ${err.message}`);
    } finally {
      setLoading(false);
      setCurrentStep('');
    }
  };

  // Generate Document - always uses current params
  const generateDocument = async (docType: DocType) => {
    if (!contextPack) return;

    setLoadingDoc(docType);
    setError('');
    setCurrentStep(text.steps.generating);

    try {
      const mode = frameworkModes[docType];
      const prompt = mode === 'custom' && customPrompts[docType]
        ? customPrompts[docType]
        : getRecommendedPrompt(docType, params.docLanguage);

      const result = await callClaude(prompt);
      
      setGeneratedDocs(prev => ({
        ...prev,
        [docType]: {
          content: result,
          timestamp: Date.now()
        }
      }));
    } catch (err) {
      setError(language === 'pt-PT'
        ? `Erro ao gerar documento: ${err.message}`
        : `Error generating document: ${err.message}`);
    } finally {
      setLoadingDoc(null);
      setCurrentStep('');
    }
  };

  // Utility functions
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    alert(text.copied);
  };

  const downloadMarkdown = (docType: DocType, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${params.projectName.replace(/\s+/g, '-')}-${docType}.md`;
    a.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const resetAll = () => {
    setFiles([]);
    setContextPack(null);
    setGeneratedDocs({
      onepager: null,
      pitch: null,
      roi: null,
      faq: null,
      datasheet: null,
      blueprint: null,
      playbook: null,
      battlecard: null,
      email: null
    });
    setActiveTab('onepager');
  };

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with glassmorphism */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Sparkles className="text-purple-400" size={36} />
                {text.title}
              </h1>
              <p className="text-purple-200 text-lg">{text.subtitle}</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-400/30">
                <Zap className="text-purple-300" size={16} />
                <span className="text-sm text-purple-200 font-medium">{text.phase2}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                {text.languageLabel}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="pt-PT" className="bg-slate-800">Português (PT-PT)</option>
                <option value="en" className="bg-slate-800">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-300 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-red-200">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input (1/3) */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Upload size={24} className="text-purple-400" />
                {text.uploadTitle}
              </h2>
              <p className="text-sm text-purple-200 mb-4">{text.uploadDesc}</p>
              
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-400/30 rounded-xl cursor-pointer hover:border-purple-400/50 hover:bg-white/5 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="text-purple-300 mb-2" size={32} />
                  <p className="text-sm text-purple-200">{text.uploadButton}</p>
                  <p className="text-xs text-purple-300 mt-1">MD, TXT (max 3)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".md,.txt"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
              </label>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium text-purple-200">
                    {files.length} {text.filesUploaded}
                  </div>
                  {files.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                      <span className="text-sm text-white truncate flex-1">{file.name}</span>
                      <span className="text-xs text-purple-300 ml-2">{formatBytes(file.size)}</span>
                    </div>
                  ))}
                  
                  {!contextPack && (
                    <button
                      onClick={createContextPack}
                      disabled={loading}
                      className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          {currentStep}
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          {text.createContextButton}
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Context Pack Preview */}
            {contextPack && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-400" size={24} />
                  {text.contextPackTitle}
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="text-purple-200"><strong className="text-white">Project:</strong> {contextPack.projectName}</div>
                  <div className="text-purple-200"><strong className="text-white">Tagline:</strong> {contextPack.tagline}</div>
                  <div className="text-purple-200"><strong className="text-white">Solution:</strong> {contextPack.productOrSolution.substring(0, 80)}...</div>
                  <div className="text-purple-200"><strong className="text-white">Features:</strong> {contextPack.keyFeatures.length} identified</div>
                </div>
              </div>
            )}

            {/* Parameters Form */}
            {contextPack && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">{text.configureParams}</h2>
                  <button
                    onClick={() => setShowParams(!showParams)}
                    className="text-sm text-purple-300 hover:text-purple-200 p-2 hover:bg-white/5 rounded-lg transition-all"
                  >
                    <Settings size={20} />
                  </button>
                </div>
                
                {showParams && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-1">
                        {text.projectNameLabel}
                      </label>
                      <input
                        type="text"
                        value={params.projectName}
                        onChange={(e) => setParams({...params, projectName: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-1">
                        {text.taglineLabel}
                      </label>
                      <input
                        type="text"
                        value={params.tagline}
                        onChange={(e) => setParams({...params, tagline: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-1">
                        {text.shortDescLabel}
                      </label>
                      <textarea
                        value={params.shortDescription}
                        onChange={(e) => setParams({...params, shortDescription: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-1">
                          {text.icpLabel}
                        </label>
                        <select
                          value={params.icp}
                          onChange={(e) => setParams({...params, icp: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        >
                          <option value="SaaS B2B" className="bg-slate-800">{text.icpOptions.saas}</option>
                          <option value="PME Industrial" className="bg-slate-800">{text.icpOptions.pme}</option>
                          <option value="Professional Services" className="bg-slate-800">{text.icpOptions.prof}</option>
                          <option value="Other" className="bg-slate-800">{text.icpOptions.other}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-1">
                          {text.personaLabel}
                        </label>
                        <select
                          value={params.persona}
                          onChange={(e) => setParams({...params, persona: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        >
                          <option value="CEO / Founder" className="bg-slate-800">{text.personaOptions.ceo}</option>
                          <option value="COO / Operations Director" className="bg-slate-800">{text.personaOptions.coo}</option>
                          <option value="Head of Customer Service" className="bg-slate-800">{text.personaOptions.head_cs}</option>
                          <option value="IT / Architecture" className="bg-slate-800">{text.personaOptions.it}</option>
                          <option value="Other" className="bg-slate-800">{text.personaOptions.other}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-1">
                          {text.toneLabel}
                        </label>
                        <select
                          value={params.tone}
                          onChange={(e) => setParams({...params, tone: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        >
                          <option value="business" className="bg-slate-800">{text.toneOptions.business}</option>
                          <option value="technical" className="bg-slate-800">{text.toneOptions.technical}</option>
                          <option value="balanced" className="bg-slate-800">{text.toneOptions.balanced}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-1">
                          {text.docLanguageLabel}
                        </label>
                        <select
                          value={params.docLanguage}
                          onChange={(e) => setParams({...params, docLanguage: e.target.value as Language})}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        >
                          <option value="pt-PT" className="bg-slate-800">Português (PT-PT)</option>
                          <option value="en" className="bg-slate-800">English</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={resetAll}
                      className="w-full bg-white/10 backdrop-blur-sm text-purple-200 py-2 px-4 rounded-lg hover:bg-white/20 text-sm border border-white/10 transition-all"
                    >
                      {text.backToUpload}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Tabs & Output (2/3) */}
          {contextPack && (
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/20">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(text.tabs) as DocType[]).map((docType) => (
                    <button
                      key={docType}
                      onClick={() => setActiveTab(docType)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === docType
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {text.tabs[docType]}
                      {generatedDocs[docType] && (
                        <CheckCircle className="inline ml-2 text-green-300" size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Document */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {text.tabs[activeTab]}
                </h2>

                {/* Framework Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    {text.frameworkLabel}
                  </label>
                  <select
                    value={frameworkModes[activeTab]}
                    onChange={(e) => {
                      const mode = e.target.value as FrameworkMode;
                      setFrameworkModes(prev => ({ ...prev, [activeTab]: mode }));
                      if (mode === 'custom') {
                        setCustomPrompts(prev => ({
                          ...prev,
                          [activeTab]: getRecommendedPrompt(activeTab, params.docLanguage)
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  >
                    <option value="recommended" className="bg-slate-800">{text.frameworkRecommended}</option>
                    <option value="custom" className="bg-slate-800">{text.frameworkCustom}</option>
                  </select>
                </div>

                {/* Custom Prompt Editor */}
                {frameworkModes[activeTab] === 'custom' && (
                  <div className="mb-4">
                    <textarea
                      value={customPrompts[activeTab] || ''}
                      onChange={(e) => setCustomPrompts(prev => ({
                        ...prev,
                        [activeTab]: e.target.value
                      }))}
                      rows={10}
                      className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder={language === 'pt-PT' 
                        ? 'Edita o prompt conforme necessário...'
                        : 'Edit the prompt as needed...'}
                    />
                  </div>
                )}

                {/* Generate Button */}
                {!generatedDocs[activeTab] && (
                  <button
                    onClick={() => generateDocument(activeTab)}
                    disabled={loadingDoc === activeTab || !params.projectName || !params.tagline}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium mb-4 shadow-lg"
                  >
                    {loadingDoc === activeTab ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        {text.generating}
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        {text.generateButton}
                      </>
                    )}
                  </button>
                )}

                {/* Generated Content */}
                {generatedDocs[activeTab] ? (
                  <>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => copyToClipboard(generatedDocs[activeTab]!.content)}
                        className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 text-sm text-purple-200 border border-white/10 transition-all"
                      >
                        <Copy size={16} />
                        {text.copyToClipboard}
                      </button>
                      <button
                        onClick={() => downloadMarkdown(activeTab, generatedDocs[activeTab]!.content)}
                        className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 text-sm text-purple-200 border border-white/10 transition-all"
                      >
                        <Download size={16} />
                        {text.downloadMd}
                      </button>
                      <button
                        onClick={() => generateDocument(activeTab)}
                        disabled={loadingDoc === activeTab}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center gap-2 text-sm disabled:from-gray-500 disabled:to-gray-600 shadow-lg transition-all"
                      >
                        {text.regenerate}
                      </button>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 overflow-auto max-h-[600px]">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-purple-100">{generatedDocs[activeTab]!.content}</pre>
                    </div>
                  </>
                ) : (
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-6 text-blue-200">
                    {text.notGenerated}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommercialKitGenerator;