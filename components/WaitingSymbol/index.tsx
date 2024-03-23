import WaitingSymbolUnit from './WaitingSymbolUnit';
import type { WaitingSymbolColor } from './types';

type WaitingSymbolProps = {
  color?: WaitingSymbolColor;
};

const WaitingSymbol = ({ color = 'white' }: WaitingSymbolProps) => {
  return (
    <div className="flex justify-center items-center gap-x-0">
      <WaitingSymbolUnit color={color} className="animate-bouncing" />
      <WaitingSymbolUnit color={color} className="animate-bouncing_delayed_1" />
      <WaitingSymbolUnit color={color} className="animate-bouncing_delayed_2" />
      <WaitingSymbolUnit color={color} className="animate-bouncing_delayed_3" />
      {/* <WaitingSymbolUnit color={color} className="animate-bouncing_delayed_4" /> */}
    </div>
  );
};

export default WaitingSymbol;
