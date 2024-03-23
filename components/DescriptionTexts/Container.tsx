import { ReactNode } from 'react';
import getReactElements from '../utils/getReactElements';
import A from '@/components/A';
import Icon from '../Icon';

const Title = ({ children, href }: { children: ReactNode; href?: string }) => {
  return (
    <dt className="text-ground Font_label_14px">
      {href ? (
        <A href={href} className="inline-flex items-center gap-x-1">
          {children}
          <Icon type="external_link" size="md" className="text-caption" />
        </A>
      ) : (
        children
      )}
    </dt>
  );
};

const Block = ({ children }: { children: ReactNode }) => {
  return <dd className="text-caption_on_primary Font_body_sm">{children}</dd>;
};

const getTitle = (children: ReactNode) => getReactElements(children, Title);
const getBlock = (children: ReactNode) => getReactElements(children, Block);

const Container = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {getTitle(children)}
      {getBlock(children)}
    </div>
  );
};

const DescriptionTexts = Object.assign(Container, {
  Title,
  Block,
});

export default DescriptionTexts;
