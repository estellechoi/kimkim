import A from '@/components/A';
import TermsAndPolicyButton from './TermsAndPolicyButton';

const AppFooter = () => {
  return (
    <footer className="relative grid grid-cols-1 gap-y-20 px-app_header_padding_x py-app_header_padding_y bg-ground_variant_dark text-caption">
      <h2 className="sr-only">Summary of the App</h2>

      <section className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-2">
          <A href="/" className="flex items-center gap-x-1 bg-body text-ground px-3 py-0.5 rounded-full Font_label_12px">
            <span>by</span>
            <span>KimKim Foundation</span>
          </A>
        </div>

        <div className="flex items-center justify-between gap-x-2">
          <div className="Font_caption_xs">© 2024 KimKim</div>
          <TermsAndPolicyButton />
        </div>
      </section>
    </footer>
  );
};

export default AppFooter;
