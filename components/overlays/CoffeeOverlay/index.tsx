import { useRouter } from 'next/router';
import AnimatedModal from '@/components/AnimatedModal';
import BottomSheet from '@/components/BottomSheet';
import DescriptionTexts from '@/components/DescriptionTexts/Container';
import useUserAgent from '@/hooks/useUserAgent';
import { DIALOG_TITLE, DONATE_ADDRESSES } from './constants';
import type { OverlayProps } from '@/components/types';
import CardLink from '@/components/CardLink';
import { useEffect } from 'react';
import Coin from '@/components/Coin';
import CopyHelper from '@/components/CopyHelper';
import { shortenText } from '@/utils/text';

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
      <CardLink color="on_primary" label="LinkedIn" href="https://www.linkedin.com/in/yujin-choi-460a931b2/" passHref className="mb-3" />

      <p className="text-on_primary Font_body_xs my-5">기부금으로 전송하실 코인의 네트워크를 반드시 확인해주세요.</p>

      <dl className="space-y-5">
        {DONATE_ADDRESSES.map(({ symbol, network, address }) => (
          <DescriptionTexts key={symbol}>
            <DescriptionTexts.Title>
              <div className="flex items-center gap-x-2">
                <Coin symbol={symbol} size="sm" />
                <div className="Font_label_14px">{symbol}</div>
              </div>
            </DescriptionTexts.Title>
            <DescriptionTexts.Block>
              <div className="flex items-center gap-x-2 text-body">
                <div className="Font_caption_xs">{network}</div>
                <CopyHelper toCopy={address}>
                  {shortenText(address, 10)}
                </CopyHelper>
              </div>  
            </DescriptionTexts.Block>
          </DescriptionTexts>
        ))}
      </dl>
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
