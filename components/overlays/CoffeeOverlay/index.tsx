import { useRouter } from 'next/router';
import AnimatedModal from '@/components/AnimatedModal';
import BottomSheet from '@/components/BottomSheet';
import DescriptionTexts from '@/components/DescriptionTexts/Container';
import useUserAgent from '@/hooks/useUserAgent';
import { DIALOG_TITLE, DONATE_ADDRESSES } from './constants';
import type { OverlayProps } from '@/components/types';
import { useEffect } from 'react';
import Coin from '@/components/Coin';
import CopyHelper from '@/components/CopyHelper';
import { shortenText } from '@/utils/text';
import CardLink from '@/components/CardLink';
import Heading from '@/components/Heading';
import Icon from '@/components/Icon';

const CoffeeOverlay = (props: Omit<OverlayProps, 'ariaLabel'>) => {
  const { isOpen, onClose } = props;
  const { isMobile } = useUserAgent();

  const router = useRouter();

  /**
   *
   * @todo replace with remote hook
   */
  useEffect(() => {
    // alternatives: routeChangeComplete
    router.events.on('routeChangeStart', onClose);
  }, [router.events, onClose]);

  const Content = (
    <>
      <p className="text-caption Font_body_xs mb-5">KimKim 앱이 도움이 되셨다면, 커피 한 잔 사주세요! <br/> 기부금으로 <span className="text-body">전송하실 네트워크를 반드시 확인해주세요.</span></p>

      <dl className="space-y-5 mb-14">
        {DONATE_ADDRESSES.map(({ symbol, network, address }) => (
          <DescriptionTexts key={symbol}>
            <DescriptionTexts.Title>
              <div className="flex items-center gap-x-2 text-body">
                <Coin symbol={symbol} size="sm" />
                <div className="Font_label_14px">{symbol}</div>
              </div>
            </DescriptionTexts.Title>
            <DescriptionTexts.Block>
              <div className="flex justify-between items-baseline gap-x-2 text-body">
                <div className="Font_caption_xs text-caption">{network}</div>
                <CopyHelper toCopy={address} className="Font_label_12px">
                  {shortenText(address, 10)}
                </CopyHelper>
              </div>  
            </DescriptionTexts.Block>
          </DescriptionTexts>
        ))}
      </dl>

      <Heading tagName="h4" className="mb-5">KimKim Foundation</Heading>
      
      <p className="text-caption Font_body_xs mb-14">
        <span className="mb-2">우리는 새로운 사용자 경험을 설계하거나 개선하는 일에 관심이 많아요. 우리의 경쟁력:</span>
        
        <ul className="list-disc list-outside pl-4">
          <li>
            앱/웹사이트 프로덕트 전략
          </li>
          <li>
            브랜딩, 사용자 경험 리서치 및 프로덕트 디자인
          </li>
          <li>
            정보위계 설계
          </li>
          <li>
            디자인 시스템
          </li>
          <li>
            앱/웹사이트 개발
          </li>
          <li>
            블록체인 기술을 활용한 프로덕트 개발 (Ethereum, Cosmos 생태계 DeFi 및 CeFi)
          </li>
        </ul>
      </p>
      
      <Heading tagName="h4" className="mb-5">연락처</Heading>
      
      <CopyHelper toCopy="kimkim.found@gmail.com" className="mb-5">
        <div className="flex items-center gap-x-4">
          <Icon type="email" />
          <span className="Font_body_sm">kimkim.found@gmail.com</span>
        </div>
      </CopyHelper>


      <CardLink color="body" label="LinkedIn" href="https://www.linkedin.com/in/yujin-choi-460a931b2/" className="mb-3" />
    </>
  );

  return isMobile ? (
    <BottomSheet {...props} ariaLabel={DIALOG_TITLE} className="h-[80vh] Padding_modal space-y-modal_gap">
      <BottomSheet.Title>{DIALOG_TITLE}</BottomSheet.Title>
      <BottomSheet.Content>{Content}</BottomSheet.Content>
    </BottomSheet>
  ) : (
    <AnimatedModal ariaLabel={DIALOG_TITLE} className="h-[80vh] Padding_modal space-y-modal_gap" {...props}>
      <AnimatedModal.Title>{DIALOG_TITLE}</AnimatedModal.Title>
      <AnimatedModal.Content isOpen={isOpen}>{Content}</AnimatedModal.Content>
    </AnimatedModal>
  );
};

export default CoffeeOverlay;
