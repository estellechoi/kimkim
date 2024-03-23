type FluidGlowProps = {
  className?: string;
  style?: React.CSSProperties;
};

const FluidGlow = ({ className = '', style }: FluidGlowProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1332"
      height="900"
      viewBox="0 0 1332 900"
      fill="none"
      className={`Component blur-[200px] ${className}`}
      style={style}
    >
      <g filter="url(#filter0_f_531_18741)">
        <path
          d="M788.544 14.0095C867.062 -76.9809 933.485 -223.543 931.534 -343.711C925.32 -726.375 75.226 -377.188 -106.519 -40.381C-261.187 246.248 -415.972 817.336 -91.1599 841.33C114.822 856.547 338.328 789.572 426.861 602.966C479.407 492.211 458.456 309.931 532.058 211.898C589.633 135.212 725.896 86.6095 788.544 14.0095Z"
          fill="#FFF"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_531_18741"
          x="-682.279"
          y="-910.768"
          width="2013.86"
          height="2154.18"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_531_18741" />
        </filter>
      </defs>
    </svg>
  );
};

export default FluidGlow;
