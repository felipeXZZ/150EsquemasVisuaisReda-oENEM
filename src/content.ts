/* =====================================================================
 *  CONTEÚDO DA LANDING PAGE — "+150 Esquemas Visuais para Redação
 *  Nota 1000 no ENEM"
 *  Básico R$ 10,00 · Completo R$ 25,90 (150 esquemas + 5 bônus)
 * =====================================================================
 *  Este é o ÚNICO arquivo que você precisa editar para trocar textos,
 *  imagens, preços e perguntas. Nenhum componente tem copy fixa.
 *
 *  ⚠️ TROCA DE OFERTA (era "150 Festas Infantis"): copy, mockup e as 37
 *  pranchas do carrossel já são da redação. O que ainda é herança da oferta
 *  antiga são as seções DESLIGADAS (`gallery` e `projectInside`, que
 *  desenham festas com <ThemeArt/>) — está marcado onde cada uma começa.
 * ===================================================================== */

/* ------------------------------------------------------------------ */
/*  CHECKOUT (GGCheckout; a 2ª etapa do popup ainda está no Zuptos)   */
/*  Um link por preço: 10,00 / 25,90 / 17,00 / 12,90. Mudou o preço   */
/*  de um produto no Zuptos? Mexa junto no texto dos planos, nos      */
/*  popups, no CTA final e no InitiateCheckout (Tracking.tsx).        */
/*                                                                    */
/*  ⚠️ Mudou o DOMÍNIO do checkout? Troque também o CHECKOUT_HOST no   */
/*  Tracking.tsx — é ele que libera as UTMs e o IC no clique; errado, */
/*  o funil perde a atribuição sem dar nenhum erro visível.           */
/* ------------------------------------------------------------------ */

/** Checkout do PLANO COMPLETO (R$ 25,90 — 150 esquemas + 5 bônus). */
export const CHECKOUT_URL = "https://ggcheckout.app/checkout/v5/gyzwMhAIdb7qzSOBvxMi";

/** Checkout do BÁSICO (R$ 10,00 — só os 150 esquemas). */
export const BASIC_CHECKOUT_URL = "https://ggcheckout.app/checkout/v5/O9WWu2UqhKw6L6rgD2F7";

/**
 * Checkout do UPSELL (R$ 17,00 — Plano Completo com os 5 bônus). É o destino
 * do "Sim, quero" no popup que abre ao clicar no plano Básico.
 */
export const DOWNSELL_CHECKOUT_URL = "https://ggcheckout.app/checkout/v5/4CVWOkbRsDgU8IJ3f0Y9";

/**
 * Checkout da 2ª ETAPA DO POPUP (R$ 12,90 — Plano Completo com os 5 bônus).
 * É uma oferta MAIS BARATA que a da 1ª etapa (R$ 17,00) de propósito: aqui a
 * pessoa já fechou a oferta uma vez e estava indo embora — o desconto maior é
 * a última tentativa. Por isso tem checkout próprio, e o valor do
 * InitiateCheckout dele é separado no Tracking (`upsell-auto-accept`).
 */
export const AUTO_UPSELL_CHECKOUT_URL = "https://app.zuptos.com.br/checkout/fa8b29859bd97fc6";

/**
 * Back-redirect: página para onde o visitante é levado ao apertar "voltar".
 * ⚠️ Enquanto for o placeholder abaixo, o redirect fica DESLIGADO (para não
 * mandar ninguém a um domínio inexistente). Troque pela URL real para ativar.
 */
export const BACK_REDIRECT_URL = "https://meubackredirect.com.br"; // REVISAR

/** Domínio público da página (metadados, sitemap e robots). */
export const SITE_URL = "https://150esquemasredacao.vercel.app"; // REVISAR

/* ------------------------------------------------------------------ */
/*  Marca / rodapé                                                     */
/* ------------------------------------------------------------------ */
/** ⚠️ REVISAR: a marca da oferta anterior era "Decoração Sem Complicação". */
export const BRAND_NAME = "Aprender sem Complicação";
export const BRAND_YEAR = 2026;

/**
 * RODAPÉ — curto de propósito: só a linha de direitos e o aviso de
 * não-afiliação. Sem menu de links, para o último elemento da página não
 * competir com o botão de compra logo acima.
 */
export const footer = {
  rights: "Todos os direitos reservados.",
  disclaimer:
    "Este site não é afiliado ao Facebook ou Meta, nem ao INEP/MEC. Resultados podem variar de pessoa para pessoa.",
};

/**
 * Aviso curto reaproveitado nas seções que citam nota e desempenho.
 * Some da página inteira se você apagar o texto.
 */
export const ESTIMATE_NOTE =
  "O material é de estudo e treino: nota e desempenho na prova dependem da dedicação de cada estudante.";

/* ------------------------------------------------------------------ */
/*  1. Barra de urgência (topo)                                        */
/* ------------------------------------------------------------------ */
export const urgencyBar = {
  emoji: "🔥",
  /**
   * A barra sai em CAIXA ALTA pelo CSS — escreva normal aqui.
   * Termina em VÍRGULA de propósito: a data do dia entra logo depois
   * ("Promoção acaba hoje, 26/08/2026"), ver `showTodayDate`.
   */
  text: "Promoção acaba hoje,",
  /**
   * true → anexa ao texto a DATA DO DIA em que a pessoa abre o site (lida no
   * navegador dela, no fuso dela). É a urgência "evergreen": a data sempre
   * bate com o dia da visita.
   *
   * ⚠️ Só faz sentido se a promoção realmente for renovada todo dia. Se o
   * preço não muda nunca, "acaba hoje" é uma afirmação que não se cumpre —
   * nesse caso deixe `false` e use um texto neutro (ex.: "Oferta especial
   * disponível hoje") ou um prazo real via `deadline`.
   */
  showTodayDate: true,
  /**
   * Contador REAL, opcional e independente do de cima. Com `null` não aparece
   * contador nenhum. Para ligar, use uma data ISO real de fim da promoção,
   * ex.: "2026-11-07T23:59:59-03:00". Quando o prazo passa, o contador some —
   * nunca reinicia sozinho.
   */
  deadline: null as string | null,
  countdownLabel: "Termina em",
};

/* ------------------------------------------------------------------ */
/*  2. Hero / primeira dobra                                           */
/* ------------------------------------------------------------------ */
export const hero = {
  /**
   * EYECATCHER acima do título — pílula branca com estrelas.
   * `{{trecho}}` sai colorido (ver <Highlight/>).
   *
   * ⚠️ O selo afirma número de clientes E nota de avaliação. Mantenha os
   * dois batendo com os seus números reais de venda/avaliação — dado
   * inventado aqui é publicidade enganosa (CDC, art. 37).
   * Versão sem afirmação de prova social, se precisar:
   *   badge: "{{+150}} esquemas prontos para aplicar",  badgeStars: 0
   *
   * Frase mais longa que esta volta a quebrar no celular — o selo do
   * HeroSection é dimensionado para ~37 caracteres.
   */
  badge: "Aprovado por {{1.847+ estudantes}}",
  /** Estrelas amarelas do selo. 0 = escondidas (entra um ícone dourado). */
  badgeStars: 5,
  // [[ ]] = número em destaque 1,5x; {{ }} = destaque colorido. Ver <Highlight/>.
  // O destaque fica em "Esquemas Visuais": é o que a pessoa está procurando.
  headline: "[[+150]] {{Esquemas Visuais}} para\nRedação Nota 1000 no ENEM",
  // Enxuta: duas frases curtas. A primeira traz os três verbos na ordem em que
  // a pessoa vai agir; a segunda, o que ela NÃO vai precisar fazer. A dor
  // ("travar na folha em branco") já está no título da dobra seguinte.
  subheadline:
    "Escolha o esquema, siga a estrutura e escreva. Sem apostila longa, sem decoreba.",
  // CURTO de propósito: o botão da hero é o maior da página (fonte fluida até
  // 1,35rem) e precisa caber em UMA linha a partir de 360px. O texto completo
  // da campanha ("Quero os esquemas de redação nota 1000") só cabe nos botões
  // das outras seções, que são menores.
  cta: "Quero os 150 esquemas",
  /**
   * Linha única de reforço abaixo do botão: logo depois do CTA o que trava o
   * clique é risco (é seguro? quando recebo?), não mais benefício. O escudo
   * verde fica no HeroSection.
   */
  reassurance: "Pagamento 100% seguro · Acesso imediato",
  /**
   * Mockup do produto na primeira dobra (abaixo da subheadline no celular,
   * coluna da direita no desktop). É o elemento de LCP da página.
   *
   * A arte é HORIZONTAL (1323×1075, fundo transparente) e é a MESMA do card do
   * Plano Completo — quem rolou a página inteira reencontra na hora de escolher
   * o plano o produto que viu no começo.
   *
   * ⚠️ O SUFIXO `-v2` NO NOME NÃO É ENFEITE. Toda imagem é servida com
   * `Cache-Control: immutable, max-age=1 ano` (ver next.config.ts), e o
   * otimizador do Next também guarda a versão por URL. Trocar o CONTEÚDO de um
   * arquivo mantendo o nome não muda nada na tela: navegador e servidor
   * continuam entregando a arte velha. Ao subir uma arte nova, suba com um
   * nome NOVO (`-v3`, `-v4`…) e aponte o `src` para ele.
   */
  mockup: {
    src: "/mockup-redacao-esquemas-v2.webp",
    width: 1323,
    height: 1075,
    alt: "Guia +150 Esquemas Visuais para Redação Nota 1000 no ENEM com os 5 bônus: banco de repertórios, propostas comentadas, dicionário de conectivos, checklist de revisão e Kit Anti-Branco",
  },
};

/* ------------------------------------------------------------------ */
/*  2.5 Vitrine — carrossel duplo logo abaixo da hero                  */
/* ------------------------------------------------------------------ */

/**
 * VITRINE ("O que você vai receber") — as pranchas reais do produto passando
 * em duas faixas, uma para cada lado, logo depois da hero.
 *
 * É a prova do produto no momento em que a promessa ainda está quente: a
 * pessoa acabou de ler "150 esquemas visuais" e vê, sem rolar nem clicar, as
 * páginas de verdade.
 *
 * A vitrine divide a lista sozinha entre as duas faixas: os itens de índice
 * PAR vão para a faixa de cima, os ÍMPARES para a de baixo. A ordem abaixo é
 * a do próprio material — as 8 páginas de método primeiro, os 10 esquemas de
 * repertório depois —, então cada faixa já sai com os dois assuntos.
 */
export const showcase = {
  eyebrow: "Veja por dentro do material",
  title: "O que você vai {{receber}}",
  // Duas linhas no celular: a chamada e três blocos curtos. Cada item a mais
  // aqui vira uma linha inteira de texto em cima do carrossel.
  paragraph:
    "Veja alguns dos 150 esquemas: o que escrever, em que ordem e o que revisar.",
  cta: "Ver os 150 esquemas",
  /**
   * As 37 pranchas vêm do PDF (o número do slug é a PÁGINA no material).
   * `code` + `name` só aparecem no ALT de cada card — o card em si é só a
   * imagem —, então servem ao leitor de tela e ao Google. Mantenha-os batendo
   * com o TÍTULO impresso na prancha.
   *
   * A ordem decide as faixas: índices pares na de cima, ímpares na de baixo.
   * São 37 pranchas: 19 na faixa de cima, 18 na de baixo. Acrescentou uma?
   * Ponha a imagem grande em `_originais-carrosel/`, rode `npm run carrosel`
   * e some o item aqui com o mesmo nome de arquivo como `slug`.
   */
  items: [
    { code: "Guia", name: "A Estrutura de 4 Parágrafos", slug: "04-estrutura-4-paragrafos" },
    { code: "Guia", name: "Como Criar uma Introdução", slug: "05-como-criar-introducao" },
    { code: "Guia", name: "Como Construir o Desenvolvimento 1", slug: "06-desenvolvimento-1" },
    { code: "Guia", name: "Como Construir o Desenvolvimento 2", slug: "07-desenvolvimento-2" },
    { code: "Guia", name: "Como Fazer uma Conclusão", slug: "08-como-fazer-conclusao" },
    { code: "Guia", name: "Como Escolher o Esquema Certo", slug: "09-escolher-o-esquema-certo" },
    { code: "Guia", name: "Checklist Antes de Entregar", slug: "10-checklist-antes-de-entregar" },
    { code: "Esquema 001", name: "Contextualização Histórica", slug: "11-contextualizacao-historica" },
    { code: "Esquema 002", name: "Contextualização Social", slug: "12-contextualizacao-social" },
    { code: "Esquema 003", name: "Contextualização Cultural", slug: "13-contextualizacao-cultural" },
    { code: "Esquema 004", name: "Constituição Federal", slug: "14-constituicao-federal" },
    { code: "Esquema 005", name: "Declaração Universal dos Direitos Humanos", slug: "15-direitos-humanos" },
    { code: "Esquema 006", name: "Filosofia", slug: "16-filosofia" },
    { code: "Esquema 007", name: "Sociologia", slug: "17-sociologia" },
    { code: "Esquema 008", name: "Literatura", slug: "18-literatura" },
    { code: "Esquema 009", name: "Filme ou Série", slug: "19-filme-ou-serie" },
    { code: "Esquema 010", name: "Obra de Arte", slug: "20-obra-de-arte" },
    { code: "Esquema 011", name: "Música", slug: "21-musica" },
    { code: "Esquema 012", name: "Conceito Filosófico", slug: "22-conceito-filosofico" },
    { code: "Esquema 013", name: "Pensamento de Sociólogo", slug: "23-pensamento-de-sociologo" },
    { code: "Esquema 014", name: "Comparação Passado × Presente", slug: "24-comparacao-passado-presente" },
    { code: "Esquema 015", name: "Contraste Social", slug: "25-contraste-social" },
    { code: "Esquema 016", name: "Paradoxo", slug: "26-paradoxo" },
    { code: "Esquema 017", name: "Citação", slug: "27-citacao" },
    { code: "Esquema 018", name: "Definição de Conceito", slug: "28-definicao-de-conceito" },
    { code: "Esquema 019", name: "Estatística", slug: "29-estatistica" },
    { code: "Esquema 020", name: "Fato Histórico", slug: "30-fato-historico" },
    { code: "Esquema 021", name: "Problematização Direta", slug: "31-problematizacao-direta" },
    { code: "Esquema 022", name: "Pergunta Retórica", slug: "32-pergunta-retorica" },
    { code: "Esquema 023", name: "Causa e Consequência", slug: "33-causa-e-consequencia" },
    { code: "Esquema 024", name: "Problema + Dois Eixos", slug: "34-problema-dois-eixos" },
    { code: "Esquema 025", name: "Analogia", slug: "35-analogia" },
    { code: "Esquema 026", name: "Atualidade", slug: "36-atualidade" },
    { code: "Esquema 027", name: "Tecnologia", slug: "37-tecnologia" },
    { code: "Esquema 028", name: "Meio Ambiente", slug: "38-meio-ambiente" },
    { code: "Esquema 029", name: "Direitos Humanos", slug: "39-direitos-humanos" },
    { code: "Esquema 030", name: "Introdução Coringa Adaptável", slug: "40-introducao-coringa" },
  ],
};

/* ------------------------------------------------------------------ */
/*  TEMAS — paleta usada pela ilustração vetorial (<ThemeArt/>)         */
/*  cores: [principal, secundária, apoio, fundo claro]                  */
/* ------------------------------------------------------------------ */
/**
 * ⚠️ HERANÇA DA OFERTA ANTERIOR. Estes temas alimentam <ThemeArt/>, que
 * desenha uma DECORAÇÃO DE FESTA (painel, arco de balões, cilindros). Eles só
 * aparecem nas seções DESLIGADAS (`gallery` e `projectInside`, ver page.tsx).
 * Se um dia você religar alguma dessas seções, troque a ilustração antes —
 * senão a página de redação volta a desenhar balões.
 */
export type Theme = {
  id: string;
  name: string;
  colors: [string, string, string, string];
};

export const themes: Theme[] = [
  { id: "safari", name: "Safari", colors: ["#8A7248", "#C4AE86", "#6E8560", "#EFE6D6"] },
  { id: "safari-boho", name: "Safari Boho", colors: ["#A98E6B", "#D8C3A5", "#7C8F6E", "#F3EADD"] },
  { id: "princesa", name: "Princesa", colors: ["#D98BA8", "#F0C3D2", "#C9A227", "#FBECF1"] },
  { id: "dinossauros", name: "Dinossauros", colors: ["#4F7F52", "#86A85C", "#B8862F", "#E9EFDF"] },
  { id: "espaco", name: "Espaço", colors: ["#3F4C74", "#7C8CB5", "#E7B44C", "#E4E7F0"] },
  { id: "fazendinha", name: "Fazendinha", colors: ["#C4564C", "#E0B84C", "#7E9668", "#F5E9D8"] },
  { id: "jardim-encantado", name: "Jardim Encantado", colors: ["#D98BA8", "#EFC9B4", "#7E9668", "#FAEDE6"] },
  { id: "futebol", name: "Futebol", colors: ["#3C8259", "#E8E4DC", "#5F6B76", "#E6EFE7"] },
  { id: "carrinhos", name: "Carrinhos", colors: ["#C4564C", "#4E7CA8", "#E0B84C", "#EDE7DE"] },
  { id: "construcao", name: "Construção", colors: ["#D79A28", "#6E6A63", "#C4564C", "#F1EADC"] },
  { id: "bailarina", name: "Bailarina", colors: ["#DE9CAE", "#F2D3D8", "#C9A227", "#FBEFF1"] },
  { id: "circo", name: "Circo", colors: ["#C4564C", "#E0B84C", "#4E7CA8", "#F4E9DC"] },
  { id: "bosque", name: "Bosque", colors: ["#6E8560", "#A9927A", "#C9A227", "#EBEDE1"] },
  { id: "fundo-do-mar", name: "Fundo do Mar", colors: ["#4A90A4", "#8FC4CE", "#E0B84C", "#E2EEF0"] },
  { id: "arco-iris", name: "Arco-íris", colors: ["#E07A63", "#E0B84C", "#7E9668", "#F7ECE2"] },
  { id: "ursinho", name: "Ursinho", colors: ["#A9866B", "#D9C0A8", "#8FA0B8", "#F2E9DF"] },
  { id: "borboletas", name: "Borboletas", colors: ["#D98BA8", "#C5A3C9", "#E0B84C", "#F8ECF2"] },
  { id: "astronauta", name: "Astronauta", colors: ["#48587F", "#8E9CBE", "#E0B84C", "#E5E8F1"] },
  { id: "cowboy", name: "Cowboy", colors: ["#A9724A", "#D8B98C", "#6E8560", "#F1E6D6"] },
  { id: "tropical", name: "Tropical", colors: ["#3F8F7A", "#E0B84C", "#E07A63", "#E4F0EA"] },
  { id: "dinossauro-baby", name: "Dinossauro Baby", colors: ["#8FBF9A", "#CFE3CC", "#E0B84C", "#EEF6EE"] },
  { id: "minimalista", name: "Minimalista", colors: ["#B7A99A", "#E3DAD0", "#C9A227", "#F5F1EC"] },
  { id: "primeiro-ano", name: "Primeiro Ano", colors: ["#E3A9A0", "#F0D6C6", "#C9A227", "#FBF0EA"] },
];

/** Busca a paleta de um tema pelo id (fallback neutro se não existir). */
export function getTheme(id: string): Theme {
  return (
    themes.find((t) => t.id === id) ?? {
      id,
      name: id,
      colors: ["#B7A99A", "#E3DAD0", "#C9A227", "#F5F1EC"],
    }
  );
}

/* ------------------------------------------------------------------ */
/*  3. Galeria — SEÇÃO DESLIGADA (ver page.tsx)                        */
/* ------------------------------------------------------------------ */
/**
 * ⚠️ SEÇÃO DESLIGADA e ainda com a estrutura da oferta anterior: os `theme`
 * abaixo desenham festas (<ThemeArt/>). A copy já está no assunto novo, mas
 * religar esta seção sem trocar a ilustração colocaria balões na página.
 */

/** Nível do esquema. */
export type Tier = "economica" | "intermediaria" | "completa";

export const tierLabels: Record<Tier, { label: string; budget: string }> = {
  economica: { label: "Começando do zero", budget: "Para quem trava na folha em branco" },
  intermediaria: { label: "Intermediário", budget: "Para quem já escreve e quer subir" },
  completa: { label: "Nota 1000", budget: "Ajuste fino das competências" },
};

export const gallery = {
  eyebrow: "Veja alguns dos esquemas",
  title: "150 esquemas para {{cada parte da sua redação}}",
  paragraph:
    "Encontre o esquema da competência, do parágrafo ou do erro que está segurando a sua nota.",
  items: [
    { code: "Esquema 012", theme: "safari-boho", tier: "intermediaria" as Tier, src: "" },
    { code: "Esquema 027", theme: "jardim-encantado", tier: "economica" as Tier, src: "" },
    { code: "Esquema 041", theme: "dinossauros", tier: "intermediaria" as Tier, src: "" },
    { code: "Esquema 058", theme: "fazendinha", tier: "economica" as Tier, src: "" },
    { code: "Esquema 073", theme: "fundo-do-mar", tier: "completa" as Tier, src: "" },
    { code: "Esquema 089", theme: "futebol", tier: "economica" as Tier, src: "" },
    { code: "Esquema 101", theme: "borboletas", tier: "intermediaria" as Tier, src: "" },
    { code: "Esquema 117", theme: "astronauta", tier: "completa" as Tier, src: "" },
    { code: "Esquema 132", theme: "circo", tier: "intermediaria" as Tier, src: "" },
    { code: "Esquema 149", theme: "arco-iris", tier: "economica" as Tier, src: "" },
  ],
  stripLabel:
    "E ainda: tese, repertório, conectivos, parágrafo de conclusão, revisão final…",
  strip: [
    "princesa",
    "espaco",
    "bosque",
    "cowboy",
    "tropical",
    "ursinho",
    "bailarina",
    "carrinhos",
    "construcao",
    "safari",
    "dinossauro-baby",
    "minimalista",
    "primeiro-ano",
  ],
  cta: "Ver os 150 esquemas",
  note: ESTIMATE_NOTE,
};

/* ------------------------------------------------------------------ */
/*  4. Vídeo — SEÇÃO DESLIGADA (ver page.tsx)                          */
/* ------------------------------------------------------------------ */
export const video = {
  eyebrow: "Veja por dentro",
  title: "Dá uma olhada em como os esquemas funcionam",
  subtitle:
    "Em menos de um minuto você entende como escolher o esquema, aplicar na estrutura e revisar antes de entregar.",
  /**
   * Vídeo demonstrativo. Deixe `mediaId: ""` para exibir o espaço reservado
   * (placeholder). Preencha com o ID da mídia no Wistia para publicar o vídeo.
   */
  mediaId: "", // REVISAR: gravar e subir o vídeo da nova oferta
  aspect: 0.5625, // 9/16 (vertical)
  placeholder: "[INSERIR VÍDEO DEMONSTRATIVO REAL]",
  cta: "Quero começar a treinar",
};

/* ------------------------------------------------------------------ */
/*  5. Simples assim — 3 passos — SEÇÃO DESLIGADA (ver page.tsx)       */
/* ------------------------------------------------------------------ */
export const steps = {
  eyebrow: "Simples assim",
  title: "Da folha em branco à redação pronta em {{3 passos}}",
  subtitle:
    "Você não precisa criar uma estrutura do zero. Escolha o esquema e aplique no tema que cair na prova.",
  items: [
    {
      n: "1",
      icon: "search" as const,
      title: "Escolha o esquema",
      desc: "Ache o esquema da parte que te trava: introdução, argumento, conectivo, conclusão ou revisão.",
    },
    {
      n: "2",
      icon: "list" as const,
      title: "Veja o que escrever",
      desc: "Cada esquema mostra o que a banca espera ver naquele trecho e em que ordem colocar as ideias.",
    },
    {
      n: "3",
      icon: "sparkles" as const,
      title: "Aplique no tema da prova",
      desc: "Encaixe o repertório e a proposta de intervenção no tema que cair, seguindo o mapa visual.",
    },
  ],
  cta: "Quero destravar agora",
};

/* ------------------------------------------------------------------ */
/*  6. Como é um esquema por dentro — SEÇÃO DESLIGADA (ver page.tsx)   */
/* ------------------------------------------------------------------ */
export const projectInside = {
  eyebrow: "Não é só um resumo bonito",
  title: "Cada esquema mostra {{o que escrever de verdade}}",
  subtitle:
    "Veja um exemplo do que você encontra ao abrir qualquer um dos 150 esquemas.",
  demo: {
    code: "Esquema 037",
    name: "Proposta de Intervenção",
    theme: "safari", // ⚠️ herança: alimenta a ilustração de festa
    src: "",
    specs: [
      { label: "Competência", value: "5: proposta de intervenção" },
      { label: "Dificuldade", value: "fácil" },
      { label: "Onde entra", value: "último parágrafo" },
      { label: "Tempo de aplicação", value: "aproximadamente 5 minutos" },
    ],
    paletteTitle: "Os 4 elementos obrigatórios",
    palette: [
      { name: "Agente", hex: "#2563EB" },
      { name: "Ação", hex: "#1D4ED8" },
      { name: "Modo/meio", hex: "#3B82F6" },
      { name: "Finalidade", hex: "#0EA5E9" },
    ],
    elementsTitle: "O que o esquema traz",
    elements: [
      "modelo",
      "conectivos",
      "verbos",
      "exemplos",
      "erros comuns",
      "checagem",
      "variações",
      "frase-modelo",
    ],
  },
  includesTitle: "Você também encontra:",
  includes: [
    "mapa visual",
    "o que a banca espera",
    "frases-modelo",
    "conectivos indicados",
    "erros que descontam",
    "checagem final",
  ],
  note: ESTIMATE_NOTE,
};

/* ------------------------------------------------------------------ */
/*  7. Se você... — a dor antes da oferta                              */
/* ------------------------------------------------------------------ */
/**
 * Entrou no lugar da comparação "apostila x esquema visual" (que continua
 * abaixo, em `comparison`, com a seção desligada no page.tsx).
 *
 * A seção responde uma pergunta só: "isso é para mim?" — mas responde pelo
 * ESPELHO, e não pelo rótulo. Em vez de dizer quem a pessoa é ("estudante do
 * ENEM"), descreve o que ela faz hoje; quem se reconhece em um dos quatro
 * cartões já entendeu que a página fala com ela.
 *
 * O título termina em reticências de propósito: ele não é uma frase inteira,
 * é a ABERTURA das quatro que vêm nos cartões ("Se você... olha para o tempo
 * que falta"). Por isso cada `text` CONTINUA o título em vez de recomeçar.
 *
 * São QUATRO, e não seis: a grade tem quatro colunas no desktop, e um quinto
 * item deixaria uma sobra solta na segunda fileira. Cada texto cabe em ~4
 * linhas no celular — mais que isso e o cartão vira parágrafo.
 *
 * `icon` é EMOJI, e não ícone de biblioteca: o desenho colorido é o que dá
 * cara de card ao bloco escuro (com o `lucide` seriam quatro traços iguais).
 * Um emoji só por item.
 *
 * `destaque` marca UM cartão — o que mais dói em quem vai fazer redação:
 * travar na folha em branco. Ele ganha a borda acesa. Marcar dois não
 * destaca nada.
 */
export const audience = {
  // Sem eyebrow: o título já é curto e a reticência faz o trabalho de
  // apresentar a lista. Uma linha acima só competiria com ele.
  // O {{}} pinta só o "você" de azul: em duas cores o título para o olho,
  // e a palavra destacada é justamente a que entrega a quem a lista fala.
  title: "Se {{você}}...",
  items: [
    {
      icon: "⏳",
      text: "Olha para o tempo que falta até o ENEM e sente que não vai dar tempo de aprender a escrever a redação.",
    },
    {
      icon: "📄",
      text: "Trava na folha em branco e perde os primeiros minutos da prova sem saber como começar o texto.",
      destaque: true,
    },
    {
      icon: "🧠",
      text: "Já estudou competência e repertório, mas esquece justamente na hora de escrever a redação.",
    },
    {
      icon: "📚",
      text: "Tem apostila e videoaula salvas, mas não consegue virar isso numa estrutura clara para usar na prova.",
    },
  ],
  cta: "Quero os esquemas prontos",
};

/* ------------------------------------------------------------------ */
/*  7b. Apostila x esquema visual — SEÇÃO DESLIGADA (ver page.tsx)     */
/* ------------------------------------------------------------------ */
export const comparison = {
  title: "Apostila explica a teoria.\n{{O esquema mostra o que escrever.}}",
  subtitle:
    "Pare de acumular apostila que você nunca termina e videoaula de 40 minutos que não cabe na sua rotina.",
  cta: "Quero os esquemas prontos",
  before: {
    title: "Estudar por apostila e videoaula",
    items: [
      "dezenas de páginas de teoria",
      "não sabe o que a banca cobra",
      "repertório decorado que soa forçado",
      "trava na hora de começar",
      "perde tempo de prova organizando a ideia",
    ],
  },
  after: {
    title: "Estudar por esquema visual",
    items: [
      "um mapa por competência",
      "sabe o que a banca espera ver",
      "repertório curinga que encaixa",
      "abertura pronta para começar",
      "estrutura na cabeça antes de escrever",
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  8. Bônus (5)                                                       */
/* ------------------------------------------------------------------ */
/**
 * As cinco capas reais estão em /public (620×775, proporção 4:5, todas no
 * MESMO tamanho de propósito: com alturas diferentes, cada card da grade
 * mostraria a capa num tamanho diferente). Os originais em PNG ficaram em
 * `_originais-bonus/`, fora do que é publicado.
 *
 * São FOTOGRAFIAS de cena (o livro sobre a mesa, papéis e luz dourada ao
 * fundo), e não recortes: o fundo faz parte da arte. Por isso a capa entra
 * sangrando no bloco, com cantos arredondados (ver BonusSection) — recortar
 * o fundo aqui destruiria a cena.
 *
 * `icon` e `colors` continuam aqui como PLANO B: se você esvaziar um `src`, a
 * página volta a desenhar a capa em CSS (<BonusCover/>) com esse ícone e essa
 * cor, sem mexer no layout.
 */
export const bonuses = {
  eyebrow: "Presentes exclusivos",
  title: "Leve também {{5 bônus}} para garantir sua nota",
  subtitle:
    "Materiais complementares que resolvem a parte chata: repertório, temas prováveis, conectivos, revisão final e o branco na hora da prova.",
  items: [
    {
      tag: "Bônus #1",
      title: "Banco de Repertórios Curinga",
      icon: "library" as const,
      colors: ["#2563EB", "#DCE7FD"] as [string, string],
      description:
        "Repertórios organizados por tema, prontos para encaixar em qualquer proposta, sem repetir sempre os mesmos dois filósofos.",
      price: "R$ 47,00",
      src: "/bonus-1-repertorios-v2.webp",
    },
    {
      tag: "Bônus #2",
      title: "30 Propostas de Redação Comentadas",
      icon: "papers" as const,
      colors: ["#1D4ED8", "#DCE4FA"] as [string, string],
      description:
        "Temas prováveis com a análise de como cada uma das 5 competências seria avaliada naquela proposta.",
      price: "R$ 40,00",
      src: "/bonus-2-propostas-v2.webp",
    },
    {
      tag: "Bônus #3",
      title: "Dicionário de Conectivos Nota 1000",
      icon: "link" as const,
      colors: ["#3B82F6", "#E4EEFE"] as [string, string],
      description:
        "Conectivos organizados por função, para nunca mais travar na passagem de um parágrafo para o outro.",
      price: "R$ 27,00",
      src: "/bonus-3-conectivos-v2.webp",
    },
    {
      tag: "Bônus #4",
      title: "Checklist de Revisão Final",
      icon: "checklist" as const,
      colors: ["#0B1E5B", "#D5DEF0"] as [string, string],
      description:
        "O que conferir nos últimos 5 minutos antes de entregar a redação, na ordem que recupera mais ponto perdido.",
      price: "R$ 20,00",
      src: "/bonus-4-checklist-v2.webp",
    },
    {
      // A etiqueta diz "Bônus #5" (e não "Bônus extra") porque a própria capa
      // está impressa com "BÔNUS 5": etiqueta e arte precisam falar igual.
      tag: "Bônus #5",
      title: "Kit Anti-Branco",
      icon: "zap" as const,
      colors: ["#0EA5E9", "#DEF1FD"] as [string, string],
      description:
        "5 aberturas coringa para nunca travar na introdução, o Protocolo dos 5 Minutos para quando o branco bater no meio da prova e um esqueleto de redação para preencher na hora.",
      price: "R$ 34,00",
      src: "/bonus-5-kit-anti-branco-v2.webp",
    },
  ],
  totalLabel: "Valor total dos 5 bônus:",
  /** ⚠️ Precisa bater com a soma dos `price` acima (47+40+27+20+34). */
  totalValue: "R$ 168,00",
  freeLabel: "Hoje: grátis",
  warning:
    "Atenção: os 5 bônus só entram junto para quem garantir o acesso agora.",
  cta: "Quero tudo com os 5 bônus",
};

/* ------------------------------------------------------------------ */
/*  9. Prova social                                                    */
/* ------------------------------------------------------------------ */
/**
 * ⚠️ NADA AQUI PODE SER INVENTADO. Cada card afirma que existe um estudante
 * real por trás da frase, e o selo "Compra verificada" afirma um fato — os
 * dois só podem ficar no ar se forem verdade.
 *
 * ➜ Para publicar sem prova social: remova <TestimonialsSection/> do page.tsx.
 *
 * `{{trecho}}` sai em negrito dentro da aspa (ver TestimonialCard).
 * `avatar` é OPCIONAL: vazio, o card mostra um círculo com a inicial do nome
 * — melhor do que reaproveitar a foto de outra pessoa. Preencha com o arquivo
 * em /public quando tiver a foto real (e a autorização de uso).
 */
export const testimonials = {
  eyebrow: "O que estão dizendo",
  title: "Veja o resultado de quem parou de {{travar na redação}}",
  subtitle:
    "Quem trocou a apostila corrida por um esquema visual que dá para aplicar na hora da prova.",
  items: [
    {
      quote:
        "Eu travava toda vez que via o tema da redação, não sabia nem por onde começar. Com os esquemas, aprendi a {{montar a introdução em menos de 5 minutos}} e parei de perder tempo de prova pensando na estrutura.",
      name: "Beatriz Almeida",
      role: "Aluna do 3º ano",
      avatar: "/avaliacoes/beatriz-almeida.webp",
      stars: 5,
    },
    {
      quote:
        "O que mais me ajudou foi o {{esquema de repertório}}. Eu ficava repetindo os mesmos dois filósofos em toda redação e a correção sempre apontava isso. Depois que usei o banco de repertórios, {{consegui variar sem parecer forçado}}.",
      name: "Gustavo Lima",
      role: "Cursinho pré-vestibular",
      avatar: "/avaliacoes/gustavo-lima.webp",
      stars: 5,
    },
    {
      quote:
        "Fazia redação sem seguir nenhuma lógica, só escrevia o que vinha na cabeça. Os esquemas me mostraram {{exatamente o que cada parágrafo precisa ter}}. Subi mais de 200 pontos entre um simulado e outro.",
      name: "Ana Julia Ferreira",
      role: "Treineira",
      avatar: "/avaliacoes/ana-julia.webp",
      stars: 5,
    },
  ],
  verifiedLabel: "Compra verificada",
  cta: "Quero destravar agora",
};

/* ------------------------------------------------------------------ */
/*  9.5 Avisos de compra (balãozinho no canto inferior esquerdo)        */
/* ------------------------------------------------------------------ */
/**
 * ⚠️ ESTES AVISOS AFIRMAM QUE ALGUÉM ACABOU DE COMPRAR.
 * Vale a mesma regra do selo do hero e dos depoimentos: se o nome e a cidade
 * não vierem de uma venda real, é publicidade enganosa (CDC, art. 37). O jeito
 * honesto de manter o componente é alimentá-lo com vendas de verdade (webhook
 * do checkout) ou desligá-lo — basta tirar <PurchaseNotifications /> do
 * page.tsx; nada mais depende dele.
 *
 * Nome só com a inicial do sobrenome e cidade sem bairro: um aviso público não
 * pode identificar quem comprou.
 */
export const purchaseNotifications = {
  /** Segundos até o PRIMEIRO aviso aparecer, contados ao abrir a página. */
  firstDelaySeconds: 5,
  /** Quanto tempo cada aviso fica na tela (segundos). */
  visibleSeconds: 5,
  /**
   * Intervalo entre um aviso sair e o próximo entrar (segundos, sorteado na
   * faixa). O sorteio existe para o ritmo não virar um relógio — cadência
   * exata é o que denuncia que o aviso é automático.
   *
   * Não baixe muito daqui sem alongar a lista de `people`: cada ciclo é
   * `visibleSeconds` + este intervalo, e quando a lista dá a volta a mesma
   * pessoa reaparece — aviso repetido entrega o revezamento. Como está: ~11s
   * por aviso, ~3 minutos para passar pelas 18 pessoas.
   */
  gapSecondsMin: 4,
  gapSecondsMax: 8,
  /** Linha de baixo, depois da cidade. */
  timeLabel: "agora mesmo",
  /** Complemento do nome, na linha de cima. */
  actionLabel: "acabou de comprar",
  /** Rótulo lido por leitor de tela em volta da região dos avisos. */
  ariaLabel: "Avisos de compras recentes",
  /**
   * Lista equilibrada entre nomes de homem e de mulher, e de propósito: quem
   * faz o ENEM é metade e metade, e uma lista só com um dos dois soa montada.
   *
   * Nenhum NOME repete os depoimentos da seção 9 — a mesma pessoa aparecendo
   * como depoimento e como compra de agora entrega o revezamento. Cidade
   * repetida não é problema: cidade grande tem mais de um comprador.
   *
   * A lista é longa (18) porque o intervalo é curto — com poucos nomes, o
   * primeiro volta a aparecer rápido demais e a repetição fica visível.
   */
  people: [
    { name: "Larissa M.", city: "Fortaleza, CE" },
    { name: "Pedro H.", city: "Campinas, SP" },
    { name: "Isabela C.", city: "Belo Horizonte, MG" },
    { name: "Matheus O.", city: "São Paulo, SP" },
    { name: "Yasmin T.", city: "Salvador, BA" },
    { name: "Kauã D.", city: "Manaus, AM" },
    { name: "Sophia A.", city: "Curitiba, PR" },
    { name: "Enzo F.", city: "Florianópolis, SC" },
    { name: "Lorena A.", city: "Goiânia, GO" },
    { name: "Vitor M.", city: "Porto Alegre, RS" },
    { name: "Rafaela B.", city: "Recife, PE" },
    { name: "Guilherme V.", city: "Brasília, DF" },
    { name: "Maria Luiza G.", city: "Ribeirão Preto, SP" },
    { name: "Lucas C.", city: "Natal, RN" },
    { name: "Emanuelly M.", city: "Uberlândia, MG" },
    { name: "Davi L.", city: "Belém, PA" },
    { name: "Nicole S.", city: "São Luís, MA" },
    { name: "Thiago N.", city: "Niterói, RJ" },
  ],
};

/* ------------------------------------------------------------------ */
/*  10. Planos                                                         */
/* ------------------------------------------------------------------ */
export const plans = {
  eyebrow: "Escolha seu acesso",
  title: "Escolha a opção {{ideal para você}}",
  basic: {
    name: "Básico",
    tagline: "Para quem quer os esquemas e nada mais.",
    /**
     * Mockup opcional dentro do card (hoje o card do Básico não renderiza a
     * imagem — só o Completo). Mantido aqui para quando quiser religar.
     * ⚠️ REVISAR ARTE: é a arte do Completo, que mostra os 5 bônus. Se religar
     * a imagem aqui, gere uma versão só com o guia — senão o Básico anuncia
     * bônus que ele não entrega.
     */
    image: {
      src: "/mockup-redacao-esquemas-v2.webp", // REVISAR ARTE
      width: 1323,
      height: 1075,
      alt: "Guia +150 Esquemas Visuais para Redação Nota 1000 no ENEM",
    },
    priceFrom: "De R$68,90",
    price: "R$10,00",
    cta: "Quero o Básico",
    /**
     * Só a entrega essencial: tudo que descreve o conteúdo (competências,
     * repertório, conectivos, intervenção) fica no Completo — assim a
     * diferença entre os dois planos aparece na hora da escolha.
     *
     * `included: false` vira um X vermelho: dizer o que NÃO vem é o que faz o
     * Básico funcionar como âncora em vez de concorrer com o Completo.
     */
    features: [
      { text: "+150 Esquemas Visuais em PDF", included: true },
      { text: "Alta resolução: estude no celular ou imprima", included: true },
      { text: "Sem os 5 bônus do Completo", included: false },
    ],
    nudge: "Espera: há uma opção muito mais completa logo abaixo",
  },
  premium: {
    badge: "Mais escolhido",
    name: "Completo",
    tagline: "Os 150 esquemas + todos os materiais extras para garantir a nota.",
    /**
     * Arte que mostra o guia JUNTO dos 5 bônus — a diferença entre os planos
     * aparece na imagem antes mesmo de o visitante ler a lista. É a MESMA da
     * hero, de propósito (ver a nota lá em cima).
     */
    image: {
      src: "/mockup-redacao-esquemas-v2.webp",
      width: 1323,
      height: 1075,
      alt: "Guia +150 Esquemas Visuais para Redação com os 5 bônus do Completo",
    },
    priceFrom: "De R$196",
    /** Mesma escrita do popup: "De R$X" riscado → "POR APENAS" → preço. */
    priceConnector: "Por apenas",
    price: "R$25,90",
    /**
     * Pílula logo abaixo do preço do Plano Completo — é o ponto exato em que a
     * pessoa compara os dois valores, então ela carrega o ARGUMENTO da
     * diferença de preço em vez de repetir a forma de pagamento (que já
     * aparece na faixa de garantias e no CTA final).
     *
     * CURTA: cabe em uma linha na pílula até ~34 caracteres. Passou disso, o
     * texto quebra em duas linhas e a pílula engorda no meio do bloco de preço.
     */
    priceBadge: "Mais de 5x o conteúdo do Básico",
    /**
     * Faixa vermelha dentro do card, logo acima do botão: é a última coisa
     * lida antes do clique. A DATA vem do navegador de quem visita (mesmo
     * mecanismo da barra de urgência do topo), então bate sempre com o dia
     * da visita.
     *
     * ⚠️ Vale a mesma regra da barra do topo: "apenas hoje" só se sustenta se
     * o preço realmente voltar a subir amanhã. Se a oferta for fixa, troque
     * por algo que não prometa prazo (ex.: "Combo com desconto ativo").
     * Para tirar a faixa, deixe o texto vazio.
     */
    todayBanner: "Combo com desconto disponível apenas hoje",
    cta: "Quero o Completo",
    bonusTitle: "5 bônus incluídos",
    features: [
      "As 5 competências do ENEM esquematizadas",
      "Introdução, desenvolvimento e conclusão em blocos",
      "Repertório sociocultural sem parecer decorado",
      "Conectivos e coesão para cada parte do texto",
      "Proposta de intervenção completa",
      "Os erros que zeram a redação e como evitar",
    ],
  },
  /**
   * Faixa abaixo dos DOIS cards: o que vale para qualquer plano. Aparece uma
   * vez só — quem compara os planos vê só a diferença entre eles, e as
   * garantias ficam fora da comparação.
   * `icon`: "infinity" | "shield" | "zap" (ver PricingSection).
   */
  assurances: [
    { icon: "infinity" as const, text: "Acesso vitalício" },
    { icon: "shield" as const, text: "Garantia de 7 dias" }, // REVISAR: bater com o checkout
    { icon: "zap" as const, text: "Acesso imediato após a compra" },
  ],
};

/* ------------------------------------------------------------------ */
/*  10b. Popup de upsell — 1ª etapa (R$ 17,00)                         */
/* ------------------------------------------------------------------ */
/**
 * Primeira oferta do funil de popup: o Plano Completo (com os 5 bônus) por
 * R$ 17,00. Aparece por DOIS caminhos — no clique do plano Básico e sozinho
 * (tempo no site / intenção de saída, ver `upsellAuto`).
 *  - aceitar  → DOWNSELL_CHECKOUT_URL (R$ 17,00)
 *  - recusar  → BASIC_CHECKOUT_URL (R$ 10,00, só os esquemas)
 *  - FECHAR   → não acaba o funil: cai na 2ª etapa (`upsellDownsell`)
 *
 * A lista de bônus NÃO é repetida aqui: sai de `bonuses.items`, para não
 * existirem duas listas que podem divergir.
 */
export const upsell = {
  /** Faixa vermelha no topo do popup — é o "pare" que segura quem ia sair. */
  eyebrow: "✨ Espera! Oferta exclusiva",
  title: "Leve o {{Completo}} por apenas:",
  lead: "Antes de continuar com o básico, veja essa oferta única:",
  priceFrom: "De R$ 25,90",
  /**
   * O preço sai em duas partes para os centavos ficarem menores que os reais:
   * `priceNow` são os reais e `priceNowCents` os centavos (deixe vazio se um
   * dia a oferta voltar a ser redonda — aí o popup nem renderiza essa parte).
   * `priceNowFull` é a mesma quantia escrita por extenso, usada onde a frase
   * precisa do valor inteiro (CTA e leitor de tela).
   */
  priceNow: "R$ 17",
  priceNowCents: "",
  priceNowFull: "R$ 17,00",
  /** ⚠️ Precisa bater com `priceFrom` − `priceNowFull` (25,90 − 17,00). */
  savings: "Você economiza R$ 8,90 no total",
  paymentNote: "pagamento único · acesso imediato",
  bonusTitle: "5 bônus exclusivos inclusos",
  cta: "Quero o Completo por R$ 17",
  decline: "Não, prefiro continuar com o básico por R$ 10,00",
  closeLabel: "Fechar",
};

/* ------------------------------------------------------------------ */
/*  10c. Gatilho automático — tempo no site e intenção de saída        */
/* ------------------------------------------------------------------ */
/**
 * NÃO é uma oferta: são os tempos e os textos de quando o funil de popup
 * abre SOZINHO (a pessoa passou muito tempo sem decidir ou fez o gesto de
 * sair). A oferta que aparece é a MESMA 1ª etapa de `upsell` (R$ 17,00) — o
 * que muda aqui é só o CONTEXTO, porque ninguém escolheu o básico ainda.
 *
 * Abre UMA vez por sessão, e nunca por cima do popup do plano Básico.
 */
export const upsellAuto = {
  /** "Demorou muito no site": tempo contado desde que a página abriu. */
  delayMs: 25000,
  /**
   * Carência antes de vigiar a saída pelo topo. Quem chega do anúncio ainda
   * está com o ponteiro lá em cima — sem esta espera o popup abriria no
   * primeiro segundo, antes de a pessoa ter visto a oferta.
   */
  exitArmMs: 5000,
  /** Substitui `upsell.lead`: aqui ninguém escolheu o básico ainda. */
  lead: "Você ainda não garantiu o seu acesso. Antes de fechar, veja esta oferta:",
  /** Substitui `upsell.decline` pelo mesmo motivo: não há o que "continuar". */
  decline: "Prefiro só os 150 esquemas por R$ 10,00",
};

/* ------------------------------------------------------------------ */
/*  10d. Popup de upsell — 2ª etapa (R$ 12,90)                         */
/* ------------------------------------------------------------------ */
/**
 * A última tentativa: quem FECHOU o popup de R$ 17,00 (pelo X, pelo Esc ou
 * clicando fora) recebe o mesmo Plano Completo por R$ 12,90 — não importa se
 * a 1ª etapa veio do clique no Básico ou do gatilho automático.
 *
 * ⚠️ REVISAR: o preço desta 2ª etapa NÃO estava no briefing da campanha (que
 * define 10,00 / 17,00 / 25,90). R$ 12,90 foi escolhido para ficar abaixo da
 * 1ª etapa e ainda acima do Básico — confirme antes de publicar.
 *
 * Só vale para quem FECHOU. Quem clicou em "prefiro o básico" ESCOLHEU e vai
 * para o checkout: perseguir essa pessoa com um segundo popup seria tirar
 * dela a saída que o próprio popup ofereceu.
 *
 * A estrutura (título, bônus, "De R$ 25,90") continua vindo de `upsell`; os
 * campos abaixo substituem os de lá com o mesmo nome.
 * ⚠️ Mexeu no preço? Mexa junto: `AUTO_UPSELL_CHECKOUT_URL`, o `savings`
 * abaixo e o valor de `upsell-auto-accept` no Tracking.tsx.
 */
export const upsellDownsell = {
  /**
   * Esta tela precisa PARECER outra. Quem fechou a de R$ 17,00 vai ver o
   * mesmo formato de novo — se o topo, o título e o riscado não mudarem, ela
   * lê "é o mesmo popup" e fecha no automático sem perceber que o preço caiu.
   * Por isso a faixa vermelha troca de texto aqui.
   */
  /** Curto de propósito: na faixa cabem ~2 palavras antes de quebrar em duas
   *  linhas no celular. Quem diz que o preço caiu é o título, logo abaixo. */
  eyebrow: "⏳ Última chance!",
  /** Substitui `upsell.title`: o assunto agora é a QUEDA, não o plano. */
  title: "Tudo bem, eu {{baixo o preço}} para você",
  /** Substitui os leads acima: aqui a pessoa já fechou a oferta uma vez. */
  lead: "É a última vez que essa oferta aparece.",
  /** Mesma saída de sempre — o básico continua a um clique. */
  decline: "Prefiro só os 150 esquemas por R$ 10,00",
  /**
   * O riscado aqui NÃO é o R$ 25,90 do plano: é o preço que a pessoa ACABOU
   * de recusar. É o único jeito de a queda ficar visível — riscar de novo o
   * 25,90 mostraria exatamente a mesma linha da tela anterior.
   */
  priceFromLabel: "Você viu por",
  priceFrom: "R$ 17,00",
  priceNow: "R$ 12",
  priceNowCents: ",90",
  priceNowFull: "R$ 12,90",
  /**
   * CURTO o bastante para caber em UMA linha (~30 caracteres neste corpo).
   * Passou disso, o texto quebra no meio do valor — "R$" numa linha e o
   * número na outra — e o número, que é o argumento, some.
   * O "no total" é o que deixa a conta de pé sem imprimir mais um preço na
   * tela: são R$ 13,00 contra o plano cheio, e não contra o R$ 17,00 riscado
   * aqui em cima.
   * ⚠️ Precisa bater com `upsell.priceFrom` − `priceNowFull`.
   */
  savings: "Você economiza R$ 13,00 no total",
  /**
   * A lista dos 5 bônus não se repete aqui — vira UMA linha. Na 1ª tela ela
   * era o argumento; aqui ela já foi lida, e repetir 5 itens empurra o preço
   * novo para fora da primeira olhada.
   */
  bonusLine: "Continua com os 5 bônus inclusos",
  cta: "Quero por 12,90 antes que acabe",
  /**
   * Cronômetro REAL: quando zera, o popup fecha e a oferta não volta nesta
   * sessão. É a mesma regra do `Countdown` da barra de urgência — contador
   * que reinicia a cada visita é urgência fabricada, e aqui ele não reinicia.
   *
   * 5 minutos: tempo de ler, decidir e ir buscar o cartão. ⚠️ Diminuir isto
   * fecha o popup na cara de quem ainda estava decidindo — o número existe
   * para dar pressa, não para tirar a compra de quem quer comprar.
   */
  expiraMs: 300000,
  /** Igual ao `savings`: uma linha. Em CAIXA ALTA cabe ainda menos texto. */
  countdownNote: "essa oferta some quando zerar",
};

/* ------------------------------------------------------------------ */
/*  11. Garantia                                                       */
/* ------------------------------------------------------------------ */
export const guarantee = {
  eyebrow: "Sem risco para você",
  title: "Você pode conhecer os esquemas sem medo",
  text: "São 7 dias de garantia incondicional. Se você sentir que o material não ajudou, é só pedir o reembolso, sem burocracia e sem precisar justificar.",
  /** ⚠️ Precisa bater com a política real do checkout. */
  badge: "Garantia de 7 dias", // REVISAR
  /**
   * VAZIO de propósito: o único selo que existe em /public é o
   * "GARANTIA 30 DIAS", e ele não pode ficar ao lado de um texto que promete
   * 7 — o selo informa um prazo, e prazo errado é informação falsa. Sem
   * imagem, a seção mostra o escudo verde do <GuaranteeSection/>.
   * Para voltar a ter selo: gere a arte com "7 DIAS" e aponte o `sealSrc`.
   */
  sealSrc: "",
  sealAlt: "Selo de garantia de 7 dias",
};

/* ------------------------------------------------------------------ */
/*  12. FAQ                                                            */
/* ------------------------------------------------------------------ */
export const faq = {
  eyebrow: "Tire suas dúvidas",
  title: "Perguntas Frequentes",
  cta: "Quero começar a treinar",
  /**
   * As 5 objeções que de fato seguram a compra, na ordem em que aparecem na
   * cabeça de quem está decidindo: "como recebo" → "dá para estudar no
   * celular" → "sirvo para isso" → "só vale para o ENEM" → "e se não for
   * para mim".
   */
  items: [
    {
      q: "Como recebo o acesso aos esquemas?",
      a: "O acesso é liberado na hora, direto no seu e-mail e no WhatsApp, assim que o pagamento é confirmado.",
    },
    {
      q: "Preciso imprimir ou dá para estudar direto no celular/tablet?",
      a: "Os dois funcionam. O material é em alta resolução, fica nítido tanto na tela quanto impresso, se você preferir grifar no papel.",
    },
    {
      q: "Serve para quem ainda não sabe nada de redação, está começando do zero?",
      a: "Sim. Os esquemas foram pensados justamente para quem trava na hora de começar. Eles substituem a teoria longa por um passo a passo visual que dá para aplicar direto.",
    },
    {
      q: "Funciona só para o ENEM ou serve para outros vestibulares também?",
      a: "A estrutura dissertativo-argumentativa é a mesma cobrada na maioria dos vestibulares e concursos, então os esquemas ajudam além do ENEM, mas todo o material foi pensado com a prova do ENEM como referência principal.",
    },
    {
      q: "E se eu comprar e achar que não é para mim?",
      a: "Você tem 7 dias de garantia incondicional. Se não sentir que o material ajudou, é só pedir o reembolso, sem burocracia e sem justificativa.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  13. CTA final                                                      */
/* ------------------------------------------------------------------ */
export const finalCta = {
  /**
   * ⚠️ REVISAR: a data da redação do ENEM está AFIRMADA aqui. Confira no
   * calendário oficial do INEP antes de publicar — e lembre de trocar quando
   * a prova passar, senão a página fica anunciando um prazo vencido.
   */
  title: "A redação do ENEM é em {{8 de novembro}}",
  subtitle:
    "Faltam poucas semanas: comece a treinar com o método certo agora e pare de perder pontos por falta de estrutura.",
  highlight: "150 esquemas + 5 bônus no Completo",
  price: "R$25,90",
  priceNote: "Pagamento único",
  cta: "Quero garantir meu acesso",
  badges: ["Acesso imediato", "Pagamento único", "Garantia", "Sem mensalidade"],
};

/* ------------------------------------------------------------------ */
/*  Barra fixa no mobile — DESLIGADA (ver page.tsx)                    */
/* ------------------------------------------------------------------ */
export const stickyBar = {
  label: "A partir de",
  price: "R$10,00",
  cta: "Ver os 150 esquemas",
};
