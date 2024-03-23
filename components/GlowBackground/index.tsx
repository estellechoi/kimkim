 type GlowBackgroundColor = 'primary' | 'secondary' | 'sky';

 const BACKGROUND_STYLE_DICT: Record<GlowBackgroundColor, string> = {
    primary: 'radial-gradient(50% 50% at 50% 50%, var(--color-primary-o35) 0%, var(--color-white-o0) 100%)',
    secondary: 'radial-gradient(50% 50% at 50% 50%, var(--color-neon400-o40) 0%, var(--color-white-o0) 100%)',
    sky: 'radial-gradient(50% 50% at 50% 50%, var(--color-sky400) 0%, var(--color-white-o0) 100%)',
 };

 type GlowBackgroundProps = { 
    style?: { [key: string]: string };
    color?: GlowBackgroundColor;
 };
 
 const GlowBackground = ({ style, color = 'primary' }: GlowBackgroundProps) => {
    const background = BACKGROUND_STYLE_DICT[color];
    return (
      <div
        className="fixed top-0 right-0 left-0 bottom-0 max-w-full pointer-events-none"
        style={{
          width: '200vw',
          height: '200vh',
          background,
          ...style,
        }}
      ></div>
    )
  }

  export default GlowBackground;
  