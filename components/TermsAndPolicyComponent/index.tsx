import React from 'react';

import { MERGE_LINKS } from '@utils/mergeLinks';

interface TermsAndPolicyComponentProps {
  label?: string;
  className?: string;
  textClassName?: string;
  linkClassName?: string;
}

const TermsAndPolicyComponent: React.FC<TermsAndPolicyComponentProps> = ({ className, textClassName, linkClassName }) => (
  <div className={className || 'links'}>
    <p className={textClassName}>
      <span className={textClassName}>
        By signing up, I agree to Merge´s{' '}
        <a className={linkClassName} href={MERGE_LINKS.terms} target='_blank' rel='noopener noreferrer'>
          Terms
        </a>{' '}
        and{' '}
        <a className={linkClassName} href={MERGE_LINKS.privacy} target='_blank' rel='noopener noreferrer'>
          Privacy Policy.
        </a>
      </span>
    </p>
  </div>
);

export default React.memo(TermsAndPolicyComponent);
