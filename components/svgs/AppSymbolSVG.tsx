const AppSymbolSVG = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`Transition_500 transition-colors ${className}`}>
      <path
        d="M55.6062 83.0011C50.3009 77.8057 44.3013 73.6289 37.4921 70.0586C44.2214 66.4965 50.1325 62.293 55.3763 57.0686C61.2353 51.2313 65.9902 44.3879 70.1495 36.3141C74.4894 44.5893 79.3727 51.5395 85.3109 57.4216C90.4849 62.5468 96.2541 66.6588 102.76 70.1298C95.5941 73.9635 89.4161 78.4271 84.0122 83.9108C78.5283 89.4756 74.0759 95.8559 70.1934 103.207C66.1301 95.3432 61.4182 88.6928 55.6062 83.0011Z"
        stroke="currentColor"
        strokeWidth="20"
      />
    </svg>
  );
};

export default AppSymbolSVG;
