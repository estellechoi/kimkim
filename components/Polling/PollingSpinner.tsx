import { NotiStatus } from "@/types/noti";
import { NOTI_COLOR_CLASSNAMES_DICT } from "@/components/styles";

type PollingSpinnerProps = { status?: NotiStatus; isMounting?: boolean };

const PollingSpinner = ({ status = 'neutral', isMounting = false }: PollingSpinnerProps) => {
    const { border: borderClassName } = NOTI_COLOR_CLASSNAMES_DICT[status];

    return (
      <div
        className={`border-solid ${
          isMounting ? 'animate-spinning border-l-2' : 'border-l-0'
        } relative -left-[3px] -top-[3px] w-3.5 h-3.5 rounded-full ${borderClassName} border-t border-r border-b border-t-transparent border-r-transparent border-b-transparent bg-transparent`}
      >
        <span className="sr-only">The data is fetching</span>
      </div>
    )
  }

  export default PollingSpinner;
