import { useRouter } from 'next/router';
import AnimatedModal from '@/components/AnimatedModal';
import BottomSheet from '@/components/BottomSheet';
import DescriptionTexts from '@/components/DescriptionTexts/Container';
import useUserAgent from '@/hooks/useUserAgent';
import { DIALOG_TITLE, THRD_PARTY_SERVICES } from './constants';
import type { OverlayProps } from '@/components/types';
import CardLink from '@/components/CardLink';
import { useEffect } from 'react';

const TermsAndPolicyOverlay = (props: Omit<OverlayProps, 'ariaLabel'>) => {
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
      <CardLink color="on_primary" label="Terms of Use" href="/terms-of-use" className="mb-3" />
      <CardLink color="on_primary" label="Privacy Policy" href="/privacy-policy" className="mb-modal_gap" />

      <p className="text-caption_on_primary Font_body_sm mb-5">This app uses the following third party services:</p>

      <dl className="space-y-5">
        {THRD_PARTY_SERVICES.map(({ title, href, description }) => (
          <DescriptionTexts key={title}>
            <DescriptionTexts.Title href={href}>{title}</DescriptionTexts.Title>
            <DescriptionTexts.Block>{description}</DescriptionTexts.Block>
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

export default TermsAndPolicyOverlay;
