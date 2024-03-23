import Tag from "@/components/Tag";

const ErrorTag = ({ className = '' }: { className?: string }) => {
    return <Tag size="sm" color="danger" label="데이터 이상" className={className} />
}

export default ErrorTag;