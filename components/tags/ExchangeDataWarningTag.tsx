import Tag from "@/components/Tag";

const ExchangeDataWarningTag = ({ className = '' }: { className?: string }) => {
    return <Tag size="sm" color="warning" label="거래소 데이터에 지연이 있습니다" className={className} />
}

export default ExchangeDataWarningTag;