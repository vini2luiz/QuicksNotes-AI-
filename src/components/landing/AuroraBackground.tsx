/**
 * Plano de fundo decorativo da landing page.
 * Reproduz as curvas de "vidro líquido" da paleta Mercury usando apenas SVG
 * e gradientes — sem imagens externas e sem custo de rede.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Brilhos ambiente */}
      <div className="absolute -top-40 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-aqua-500/10 blur-[140px] animate-float-slow" />
      <div className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-mercury-400/10 blur-[130px] animate-float-slower" />
      <div className="absolute bottom-0 -left-24 h-[420px] w-[420px] rounded-full bg-steel-500/20 blur-[120px]" />

      {/* Curvas metálicas */}
      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="curve-light" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e3ecec" stopOpacity="0" />
            <stop offset="45%" stopColor="#dfe9ea" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5ecdbe" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="curve-deep" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#36b3a4" stopOpacity="0" />
            <stop offset="50%" stopColor="#9fb5b8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0e1517" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="veil" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#2a3639" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0e1517" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1200" height="900" fill="url(#veil)" />

        <path
          d="M-80 250C180 120 420 430 650 330S1010 60 1290 180"
          stroke="url(#curve-light)"
          strokeWidth="1.5"
        />
        <path
          d="M-80 380C200 250 380 560 640 470S1040 200 1290 320"
          stroke="url(#curve-deep)"
          strokeWidth="1.2"
        />
        <path
          d="M-80 640C220 520 400 820 700 700S1060 460 1290 560"
          stroke="url(#curve-light)"
          strokeWidth="1.8"
        />
        <path
          d="M-80 780C240 680 460 930 760 830S1100 620 1290 700"
          stroke="url(#curve-deep)"
          strokeWidth="1"
        />
      </svg>

      {/* Vinheta inferior para fundir com o conteúdo */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-steel-950" />
    </div>
  );
}
