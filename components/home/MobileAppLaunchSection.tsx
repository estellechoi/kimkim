import Button from '@/components/Button';

const MobileAppLaunchSection = ({ onClickLaunch }: { onClickLaunch?: () => void }) => {
  return (
    <section className="md:hidden w-full h-screen flex items-end justify-center px-page_x_mobile pb-page_padding_safe_bottom">
      <Button size="lg" label="Launch app" className="w-full" onClick={onClickLaunch} />
    </section>
  );
};

export default MobileAppLaunchSection;
