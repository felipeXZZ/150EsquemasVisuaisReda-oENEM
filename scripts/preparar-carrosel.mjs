/**
 * PREPARA AS PRANCHAS DO CARROSSEL (vitrine abaixo da hero).
 *
 *   npm run carrosel
 *
 * Lê as imagens grandes de `_originais-carrosel/` (fora de /public — elas NÃO
 * vão para o ar) e gera em `public/carrosel/` duas larguras de cada uma:
 *
 *   <nome>-400.webp   celular  (card de 190px em telas 2x)
 *   <nome>-640.webp   desktop  (card de 290px em telas 2x)
 *
 * Por que duas cópias prontas em vez de deixar o next/image redimensionar:
 * o carrossel mostra 17 pranchas de uma vez, então o otimizador teria que
 * processar 17 imagens a cada `npm run dev` frio — é isso que derrubava o
 * servidor de desenvolvimento. Com os arquivos prontos, o navegador só baixa
 * arquivo estático e o dev não faz trabalho nenhum.
 *
 * PARA ACRESCENTAR UMA PRANCHA: coloque a imagem em `_originais-carrosel/`
 * com o nome que você quer na URL (ex.: `21-repertorio-coringa.png`), rode o
 * comando e acrescente o item na lista `showcase.items` do src/content.ts
 * usando esse mesmo nome como `slug`.
 *
 * Só o nível de cima da pasta é lido: o que está em `_originais-carrosel/
 * nao-usadas/` fica guardado sem virar arquivo no site.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGINAIS = path.join(root, "_originais-carrosel");
const DESTINO = path.join(root, "public", "carrosel");

/** Larguras geradas. Mudou o tamanho do card? Ajuste aqui e no componente. */
const LARGURAS = [400, 640];

if (!fs.existsSync(ORIGINAIS)) {
  console.error(`Pasta não encontrada: ${ORIGINAIS}`);
  process.exit(1);
}

fs.mkdirSync(DESTINO, { recursive: true });

const arquivos = fs
  .readdirSync(ORIGINAIS)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort();

if (arquivos.length === 0) {
  console.error(`Nenhuma imagem em ${ORIGINAIS}`);
  process.exit(1);
}

let total = 0;
for (const arquivo of arquivos) {
  const slug = path.basename(arquivo, path.extname(arquivo));
  const tamanhos = [];

  for (const largura of LARGURAS) {
    const saida = path.join(DESTINO, `${slug}-${largura}.webp`);
    await sharp(path.join(ORIGINAIS, arquivo))
      .resize({ width: largura })
      .webp({ quality: 72, effort: 6 })
      .toFile(saida);
    const kb = fs.statSync(saida).size / 1024;
    total += kb;
    tamanhos.push(`${largura}px: ${kb.toFixed(0)}KB`);
  }

  console.log(`${slug} — ${tamanhos.join(" · ")}`);
}

// Limpa sobras de execuções antigas (ex.: larguras que não usamos mais), para
// não subir para o ar arquivo que nenhuma tag <img> pede.
const esperados = new Set(
  arquivos.flatMap((a) => {
    const slug = path.basename(a, path.extname(a));
    return LARGURAS.map((l) => `${slug}-${l}.webp`);
  }),
);
for (const f of fs.readdirSync(DESTINO)) {
  if (/-\d+\.webp$/.test(f) && !esperados.has(f)) {
    fs.unlinkSync(path.join(DESTINO, f));
    console.log(`removido (sobra): ${f}`);
  }
}

console.log(
  `\n${arquivos.length} pranchas · ${LARGURAS.length} tamanhos · ${(total / 1024).toFixed(1)}MB em public/carrosel`,
);
