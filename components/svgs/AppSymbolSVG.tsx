const AppSymbolSVG = ({ className = '' }: { className?: string }) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M11.2873 20.355C9.4131 18.5196 7.17451 17.1685 4.4332 16.017C7.15391 14.8819 9.36158 13.5206 11.2181 11.6709C13.1895 9.70685 14.692 7.26431 16.0272 4.13909C17.4321 7.32872 18.9786 9.79661 20.9643 11.7636C22.8085 13.5904 24.9697 14.9242 27.6019 16.0279C24.7554 17.2509 22.4956 18.6865 20.6247 20.5851C18.7294 22.5083 17.2995 24.8401 16.0366 27.7427C14.7475 24.6695 13.2545 22.2814 11.2873 20.355Z"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
};

export default AppSymbolSVG;
