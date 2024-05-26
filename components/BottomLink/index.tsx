import React from 'react';

import { Link } from '@mui/material';

import Text from '@components/Text';

import styles from './BottomLink.module.scss';

interface BottomLinnkComponentProps {
  secondaryText?: string | null;
  primaryText?: string | null;
  leftAlign?: boolean;
  verticalLink?: boolean;
  rightBlock?: boolean;
  containerClass?: string;
  onPrimaryTextClick?: () => void;
}

const BottomLinkComponent: React.FC<BottomLinnkComponentProps> = ({
  secondaryText = null,
  primaryText = null,
  leftAlign = false,
  verticalLink = false,
  rightBlock = false,
  containerClass = '',
  onPrimaryTextClick = () => {},
}) => (
  <div
    className={[
      styles.conatiner,
      verticalLink ? styles.column : styles.row,
      rightBlock ? styles.fixwidth : '',
      leftAlign ? styles.leftAlign : '',
      containerClass,
    ].join(' ')}>
    {secondaryText && <Text text={secondaryText} className={styles.secondaryText} variant={'subtitle1'} />}
    {primaryText && (
      <Link className={[styles.link, verticalLink ? '' : styles.margin].join(' ')} onClick={onPrimaryTextClick}>
        {primaryText}
      </Link>
    )}
  </div>
);

export default BottomLinkComponent;
