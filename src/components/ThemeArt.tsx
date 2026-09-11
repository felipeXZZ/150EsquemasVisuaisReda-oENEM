import { cn } from "@/lib/utils";
import { getTheme } from "@/content";

/**
 * ILUSTRAÇÃO DA FESTA (vetorial, sem imagem externa).
 *
 * Desenha uma composição de decoração — painel, arco de balões, cilindros,
 * mesa, bolo e folhagens — usando a PALETA DO TEMA. Serve como arte oficial
 * enquanto não há foto real do projeto: a página fica visualmente completa,
 * carrega instantâneo (é SVG inline, zero request) e cada card já comunica a
 * paleta daquela festa.
 *
 * ➜ Para usar a FOTO REAL: preencha o campo `src` do item no content.ts.
 *    O <Media/> passa a renderizar a foto e esta ilustração sai de cena.
 *
 * Nada aqui é fotografia — é ilustração declarada, para não passar por
 * registro real de uma festa montada.
 */

/** Variante de composição derivada do id do tema (estável entre renders). */
function variantOf(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return h;
}

export function ThemeArt({
  theme,
  className,
  label,
}: {
  /** id do tema em `themes` (content.ts) — define a paleta. */
  theme: string;
  className?: string;
  /** texto alternativo. Padrão: "Ilustração da festa <tema>". */
  label?: string;
}) {
  const t = getTheme(theme);
  const [c1, c2, c3, bg] = t.colors;
  const v = variantOf(t.id);

  // ---- Arco de balões: arco real (cos/sin), sem números mágicos soltos ----
  const BALLOONS = 19;
  const balloons = Array.from({ length: BALLOONS }, (_, i) => {
    // 188° → 352°: varre a lateral esquerda, passa por cima e desce à direita.
    const deg = 188 + (164 * i) / (BALLOONS - 1);
    const rad = (deg * Math.PI) / 180;
    // Duas fileiras alternadas dão volume ao arco (como um arco desconstruído).
    const radius = i % 2 === 0 ? 112 : 129;
    const size = [12, 8.5, 14, 9.5][i % 4];
    return {
      x: 150 + radius * Math.cos(rad),
      y: 182 + radius * Math.sin(rad),
      r: size,
      fill: [c1, c2, c3][(i + v) % 3],
    };
  });

  // ---- Confete de fundo (posições fixas, derivadas do tema) ----
  const confetti = Array.from({ length: 10 }, (_, i) => ({
    x: 18 + ((v * (i + 3) * 37) % 264),
    y: 22 + ((v * (i + 5) * 53) % 300),
    r: 1.6 + ((i + v) % 3) * 0.7,
  }));

  const painelVariant = v % 3;

  return (
    <svg
      viewBox="0 0 300 380"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label ?? `Ilustração de decoração de festa — tema ${t.name}`}
      className={cn("block h-full w-full", className)}
    >
      {/* Fundo */}
      <rect width="300" height="380" fill={bg} />
      {/* Halo suave atrás do painel (dá profundidade sem gradiente/id) */}
      <circle cx="150" cy="168" r="150" fill="#FFFFFF" opacity="0.38" />

      {/* Confete */}
      {confetti.map((d, i) => (
        <circle key={`cf${i}`} cx={d.x} cy={d.y} r={d.r} fill={c3} opacity="0.28" />
      ))}

      {/* ---------------- Painel de fundo ---------------- */}
      {painelVariant === 0 && (
        <>
          <circle cx="150" cy="172" r="86" fill={c1} />
          <circle cx="150" cy="172" r="66" fill="#FFFFFF" opacity="0.22" />
        </>
      )}
      {painelVariant === 1 && (
        // Painel em arco (formato "porta") — o mais comum em festas montadas.
        <>
          <path d="M66 262V158a84 84 0 0 1 168 0v104z" fill={c1} />
          <path d="M88 262V160a62 62 0 0 1 124 0v102z" fill="#FFFFFF" opacity="0.22" />
        </>
      )}
      {painelVariant === 2 && (
        // Painel duplo (círculo grande + círculo menor sobreposto).
        <>
          <circle cx="134" cy="168" r="80" fill={c1} />
          <circle cx="212" cy="212" r="44" fill={c2} />
          <circle cx="134" cy="168" r="60" fill="#FFFFFF" opacity="0.22" />
        </>
      )}

      {/* ---------------- Arco de balões ---------------- */}
      {balloons.map((b, i) => (
        <g key={`b${i}`}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={b.fill} />
          {/* brilho do balão */}
          <circle
            cx={b.x - b.r * 0.3}
            cy={b.y - b.r * 0.35}
            r={b.r * 0.24}
            fill="#FFFFFF"
            opacity="0.4"
          />
        </g>
      ))}

      {/* ---------------- Folhagens na base do painel ---------------- */}
      <g fill={c3} opacity="0.85">
        <ellipse cx="72" cy="296" rx="26" ry="11" transform="rotate(-18 72 296)" />
        <ellipse cx="228" cy="296" rx="26" ry="11" transform="rotate(18 228 296)" />
        <ellipse cx="96" cy="308" rx="18" ry="8" transform="rotate(-8 96 308)" />
      </g>

      {/* ---------------- Cilindros ---------------- */}
      {[
        { x: 40, w: 38, h: 72, fill: c2 },
        { x: 84, w: 28, h: 48, fill: c3 },
        { x: 192, w: 26, h: 44, fill: c3 },
        { x: 222, w: 38, h: 80, fill: c2 },
      ].map((cy, i) => (
        <g key={`cil${i}`}>
          <rect x={cy.x} y={330 - cy.h} width={cy.w} height={cy.h} rx="3" fill={cy.fill} />
          {/* tampo do cilindro */}
          <ellipse
            cx={cy.x + cy.w / 2}
            cy={330 - cy.h}
            rx={cy.w / 2}
            ry="4.5"
            fill="#FFFFFF"
            opacity="0.55"
          />
          {/* item em cima do cilindro */}
          <circle cx={cy.x + cy.w / 2} cy={330 - cy.h - 9} r="6" fill={c1} />
        </g>
      ))}

      {/* ---------------- Mesa ---------------- */}
      <path d="M104 292h92l8 38H96z" fill={c2} />
      <rect x="98" y="284" width="104" height="9" rx="4.5" fill={c1} />

      {/* Bolo */}
      <rect x="136" y="252" width="28" height="32" rx="4" fill="#FFFFFF" opacity="0.92" />
      <rect x="136" y="252" width="28" height="9" rx="4" fill={c3} />
      <circle cx="150" cy="245" r="4.5" fill={c1} />

      {/* Docinhos / bandejas */}
      <circle cx="118" cy="277" r="6.5" fill={c3} />
      <circle cx="182" cy="277" r="6.5" fill={c3} />
      <rect x="108" y="282" width="22" height="3" rx="1.5" fill={c1} opacity="0.7" />
      <rect x="170" y="282" width="22" height="3" rx="1.5" fill={c1} opacity="0.7" />

      {/* Chão */}
      <rect x="0" y="330" width="300" height="50" fill={c1} opacity="0.12" />
    </svg>
  );
}
