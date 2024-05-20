import A from '@/components/A';
import AlertBox from '@/components/AlertBox';
import Icon from '@/components/Icon';
import Link from 'next/link';
import TermsAndPolicyButton from './TermsAndPolicyButton';
import AppLogo from '@/components/AppLogo';

const AppFooter = () => {
  return (
    <footer className="relative flex flex-col items-center px-4 md:px-app_header_padding_x py-app_header_padding_y bg-ground_variant_dark text-body">
      <h2 className="sr-only">Summary of the App</h2>

      <div className="max-w-content_max_width grid grid-cols-1 gap-y-0">
        <div className="flex flex-col gap-20 justify-between items-stretch md:flex-row">
          <div className="basis-1/2 flex flex-col gap-y-3">
            <AppLogo size="sm" color="light" className="md:hidden" />
            <AppLogo size="md" color="light" className="hidden md:block" />

            <div className="flex items-center gap-x-4">
              <div className="Font_title_md text-body">KimKim</div>

              <Link href="/" className="flex items-center gap-x-1 bg-body text-ground px-3 py-0.5 rounded-full Font_label_12px">
                <span>by</span>
                <span>KimKim Foundation</span>
              </Link>
            </div>

            <AlertBox
              status="neutral"
              className="basis-1/4 mt-7"
              text="KimKim은 각 거래소의 현재가 데이터와 Forex API의 환율 데이터를 활용하여 김치 프리미엄 정보를 제공합니다. KimKim에서 제공하는 정보는 투자에 대한 조언이 아니며, 투자에 대한 모든 책임은 본인에게 있습니다."
            />
          </div>

          <div className="basis-1/2 space-y-4">
            <div className="Font_caption_xs text-body hidden md:block">커뮤니티</div>
            <ul className="flex justify-center items-center gap-4 md:justify-start">
              <li>
                <A href="https://open.kakao.com/o/gtrIKPrg">
                  <Icon size="xl" type="kakaotalk" className="text-body" />
                </A>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between gap-x-2 mt-20">
          <div className="Font_caption_xs text-caption px-3">© 2024 KimKim</div>
          <TermsAndPolicyButton />
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
