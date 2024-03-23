import WaitingSymbol from "@/components/WaitingSymbol";

const PageLoader = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
          <WaitingSymbol color="primary" />
        </div>
    );
};

export default PageLoader;