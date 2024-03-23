type EllipseGlowProps = {
  className?: string;
  style?: React.CSSProperties;
};

const EllipseGlow = ({ className = '', style }: EllipseGlowProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="777"
      height="806"
      viewBox="0 0 777 806"
      fill="none"
      className={`Component blur-[150px] ${className}`}
      style={style}
    >
      <g filter="url(#filter0_f_531_18743)">
        <circle cx="420" cy="386" r="120" fill="currentColor" />
      </g>
      <defs>
        <filter
          id="filter0_f_531_18743"
          x="0"
          y="-34"
          width="840"
          height="840"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_531_18743" />
        </filter>
      </defs>
    </svg>
  );
};

export default EllipseGlow;
