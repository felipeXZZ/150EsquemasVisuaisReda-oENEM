# +150 Esquemas Visuais para Redação Nota 1000 no ENEM — landing page

Landing page de venda (Next.js 16 + Tailwind 4) para o produto digital
**"+150 Esquemas Visuais para Redação Nota 1000 no ENEM"**: 150 esquemas
visuais que cobrem as 5 competências, a estrutura do texto, repertório
sociocultural, conectivos, proposta de intervenção e os erros que zeram.

Promessa central: **pare de travar na folha em branco — estruture, argumente e
revise sua redação com um mapa visual** — "Apostila explica a teoria. O esquema
mostra o que escrever."

> **Troca de oferta.** Esta página era a "150 Festas Infantis Prontas para
> Copiar". Toda a **copy** já é da redação; as **imagens** ainda são as da
> oferta antiga. Ver "Arte a refazer", abaixo.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm run lint
```

---

## ⚠️ Antes de publicar

Os pontos abaixo estão marcados com `REVISAR` no código:

| O quê | Onde | Por quê |
|---|---|---|
| **Links de checkout** | `src/content.ts` → `CHECKOUT_URL`, `BASIC_CHECKOUT_URL`, `DOWNSELL_CHECKOUT_URL` | Ainda apontam para o checkout do produto **anterior** (festas) e com os preços antigos. Do jeito que estão, quem compra recebe o material errado. |
| **Data da prova** | `src/content.ts` → `finalCta.title` | A página **afirma** que a redação é em 8 de novembro. Conferir no calendário do INEP e trocar quando a prova passar. |
| **Domínio** | `src/content.ts` → `SITE_URL` | Usado em metadados, `robots.txt` e `sitemap.xml`. |
| **Pixel / Clarity** | `src/app/layout.tsx` | O `pixelId` da Utmify e o projeto do Clarity vieram da oferta anterior. |
| **Prazo da garantia** | `src/content.ts` → `guarantee.badge` e o selo | Precisa bater com a política real do checkout. |
| **Imagem de compartilhamento** | `src/app/layout.tsx` | Falta a imagem OG (1200×630). Sem ela o link não gera miniatura no WhatsApp/Instagram. |
| **Vídeo** | `src/content.ts` → `video.mediaId` | Vazio (a seção está desligada de qualquer forma). |
| **Prova social** | `src/content.ts` → `testimonials.items` e `purchaseNotifications` | Depoimentos, selo "Compra verificada", o número do selo da hero e os avisos de compra **afirmam fatos**. Só ficam no ar se forem reais. |

### Arte a refazer (marcada com `REVISAR ARTE`)

Copy e mockup do produto já são da redação. O que falta:

| Arquivo | Onde aparece | O que gerar |
|---|---|---|
| ~~mockup da hero~~ | hero (LCP) | ✅ feito: `/public/mockup-redacao-esquemas.webp` (1323×1075, fundo transparente) |
| ~~arte do Plano Completo~~ | card do Completo | ✅ feito: mesma arte da hero (já mostra o guia + os 5 bônus) |
| `/public/carrosel/*.webp` | vitrine em carrossel | 16 pranchas de esquema; jogar os originais em `_originais-carrosel/`, rodar `npm run carrosel` e trocar os `slug` em `showcase.items` |
| ~~capas dos bônus~~ | seção de bônus | ✅ feito: `/public/bonus-1-repertorios.webp` … `bonus-5-kit-anti-branco.webp` (620×775). PNGs originais em `_originais-bonus/` |
| selo da garantia | seção de garantia | o arquivo que existe (`selo-garantia-30dias.webp`) diz 30 dias e a oferta agora é de **7**. `guarantee.sealSrc` está vazio (entra o escudo verde) até haver um selo de 7 dias |


---

## Todo o texto vive em um arquivo só

`src/content.ts` é o único arquivo que precisa ser editado para mudar copy,
preços, temas, bônus e perguntas. **Nenhum componente tem texto fixo.**

Sintaxe usada nos títulos (componente `<Highlight/>`):

- `{{texto}}` → trecho colorido de destaque
- `[[150]]` → número em destaque, 1,5× maior
- `\n` → quebra de linha manual

---

## Imagens: como trocar

Cada item visual tem um campo `src` **opcional**:

1. `src` preenchido → mostra a **imagem real** (otimizada pelo `next/image`);
2. `src` vazio → entra o desenho em CSS/SVG do próprio componente
   (`BonusCover` nos bônus) ou o **espaço reservado** cinza com o rótulo do
   que falta.

Como o container tem proporção fixa, trocar desenho por imagem **não muda o
layout** (zero CLS). Exemplo, nos bônus:

```ts
// src/content.ts
{ tag: "Bônus #1", title: "Banco de Repertórios Curinga", icon: "library",
  src: "/bonus/repertorios.webp" },   // ← coloque o arquivo em /public/bonus
```

Prefira artes **verticais (2/3)** dos materiais: capa do PDF, páginas de
esquema, mockup no celular.

### Herança da oferta anterior

`themes` + `src/components/ThemeArt.tsx` desenham **decoração de festa**
(painel, arco de balões). Só alimentam as seções **desligadas** (`gallery` e
`projectInside`). Religar qualquer uma delas sem trocar a ilustração coloca
balões numa página de redação.

---

## Prova social — regra da seção

**Nada nesta seção pode ser inventado**: nem depoimento, nem nome, nem número
de compradores, nem nota de avaliação. Cada card afirma que existe um
estudante real por trás da frase, e o selo "Compra verificada" afirma um fato.

- o markup `Product` (JSON-LD) **não** declara `aggregateRating`;
- `avatar` é opcional: vazio, o card mostra um círculo com a inicial do nome —
  reaproveitar a foto de outra pessoa seria afirmar que ela é a autora;
- para publicar sem prova social, remova `<TestimonialsSection/>` de
  `src/app/page.tsx`.

A mesma regra vale para o selo do hero (`hero.badge`, "1.847+ estudantes") e
para os avisos de compra (`purchaseNotifications`) — ou vêm de venda real, ou
saem do ar.

---

## Estrutura

`src/app/page.tsx` monta as seções na ordem da jornada de decisão:

| # | Seção | Componente |
|---|---|---|
| 1 | Barra de urgência | `UrgencyBar` |
| 2 | Hero | `HeroSection` |
| 3 | Vitrine (carrossel duplo) | `ShowcaseCarousel` |
| 4 | Apostila × esquema visual | `PinterestComparison` |
| 5 | 5 bônus | `BonusSection` |
| 6 | Prova social | `TestimonialsSection` |
| 7 | Planos | `PricingSection` |
| 8 | Garantia | `GuaranteeSection` |
| 9 | FAQ | `FAQSection` |
| 10 | CTA final | `FinalCTA` |
| 11 | Rodapé | `Footer` |
| — | Popup de upsell (camada) | `AutoUpsellPopup` |
| — | Avisos de compra (camada) | `PurchaseNotifications` |

Desligados, mas ainda no repositório: `ProjectGallery`, `VideoSection`,
`ThreeSteps`, `ProjectInside` e `StickyMobileCTA` (ver o comentário no fim de
`page.tsx`).

Todos os CTAs levam para `#planos` (a seção de preços); só os botões dos cards
de plano vão direto ao checkout.

### Barra de urgência sem contador falso

`urgencyBar.deadline` é `null` por padrão: a barra mostra só o texto e a seção
não envia JS nenhum. Se a promoção tiver prazo **real**, coloque uma data ISO
(`"2026-08-31T23:59:59-03:00"`) e o contador aparece. Quando o prazo passa, ele
some — nunca reinicia sozinho a cada visita.

---

## Design

Tokens em `src/app/globals.css` (nenhuma cor fixa nos componentes):

| Token | Uso |
|---|---|
| `cream` / `sand` / `lilac` | fundos claros alternados (off-white → lilás) |
| `plum` / `plum-deep` | seções escuras e rodapé (roxo profundo) |
| `cta` / `cta-dark` | gradiente do botão principal |
| `purple` | roxo vivo decorativo (pontos, ícones, formas) |
| `purple-ink` | roxo escuro para **texto** destacado em fundo claro |
| `gold` | âmbar dos selos e do texto de destaque no escuro |
| `green` / `green-ink` / `green-soft` | confirmação (checks) e faixa da garantia |
| `ink` / `ink-soft` / `ink-invert` | texto |

Duas regras que evitam texto ilegível:

- **`purple` nunca carrega texto pequeno.** O roxo vivo é decorativo; para
  texto sobre fundo claro use `purple-ink` (8,4:1). O `cta` é um roxo mais
  fechado justamente para o branco do botão passar em 6,3:1.
- **`gold` só sobre fundo escuro.** Sobre creme o âmbar desaparece; em fundo
  claro o destaque é `purple-ink`.

Mobile em primeiro lugar: botões ocupando quase toda a largura, alvos de toque
de 52–60px, FAQ em `<details>` nativo e carrosséis com scroll-snap.

## Performance

- **Zero requisição de imagem** na primeira dobra: as ilustrações são SVG
  inline, então a página aparece completa já no HTML do servidor.
- HTML inicial ≈ **94 KB comprimido**, com o CSS embutido no `<head>`
  (`inlineCss`), sem CSS render-blocking.
- Client JS só onde é indispensável: contador (quando ligado), barra fixa do
  mobile, player de vídeo e rastreamento. O resto é Server Component.
- Scripts de terceiros (Utmify, Clarity) em `lazyOnload`; o player do vídeo só
  baixa quando a pessoa chega perto dele.
