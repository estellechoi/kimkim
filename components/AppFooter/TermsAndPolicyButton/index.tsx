import Button from '@/components/Button';
import useModal from '@/hooks/useModal';
import { Suspense, lazy, useCallback } from 'react';

const TermsAndPolicyOverlay = lazy(() => import('@/components/overlays/TermsAndPolicyOverlay'));

const TermsAndPolicyButton = () => {
  const termsAndPolicyModal = useModal();

  const openTermsAndPolicyModal = useCallback(async () => {
    await termsAndPolicyModal.open((props) => (
      <Suspense>
        <TermsAndPolicyOverlay id={termsAndPolicyModal.id} {...props} />
      </Suspense>
    ));
  }, [termsAndPolicyModal]);

  return (
    <Button
      type="text"
      color="body"
      size="xs"
      label="이용약관 및 개인정보처리방침"
      aria-expanded={termsAndPolicyModal.isOpen}
      aria-controls={termsAndPolicyModal.id}
      onClick={openTermsAndPolicyModal}
    />
  );
};

export default TermsAndPolicyButton;
