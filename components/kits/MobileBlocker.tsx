import Card from '@/components/Card';

const MobileBlocker = () => {
  return (
    <section className="md:hidden fixed inset-0 w-screen h-screen flex items-stretch justify-center px-page_x_mobile pt-app_header_height pb-page_padding_safe_bottom Bg_glass">
      <Card color="glass" className="w-full !h-full Font_display_sm text-body px-card_padding_x py-card_padding_y">
        Mobile support is coming soon.
      </Card>
    </section>
  );
};

export default MobileBlocker;
