import StatusDot from '@/components/StatusDot';

const NetworkFeeInfoTooltipContent = () => {
  return (
    <div className="flex flex-col gap-y-1 Font_body_xs">
      <div className="flex items-center gap-x-2">
        <StatusDot status="success" />
        <span>입/출금 가능</span>
      </div>
      <div className="flex items-center gap-x-2">
        <StatusDot status="error" />
        <span>입/출금 불가</span>
      </div>
    </div>
  );
};

export default NetworkFeeInfoTooltipContent;
