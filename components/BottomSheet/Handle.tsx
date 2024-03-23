const Handle = ({ className = '' }: { className?: string }) => (
  <span className={`flex justify-center ${className}`} aria-hidden>
    <span className="w-8 h-1 rounded-button bg-caption"></span>
  </span>
);

export default Handle;
