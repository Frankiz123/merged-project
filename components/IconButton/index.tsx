import React from 'react';

import { Button } from '@mui/material';

import styles from './iconButton.module.scss';

interface IIconButton {
  onClick?: () => void;
  Icon: React.ReactNode;
  buttonClass?: string;
}

const IconButton: React.FC<IIconButton> = ({ onClick, Icon, buttonClass }) => (
  <Button className={[styles.iconButton, buttonClass].join(' ')} variant='text' onClick={onClick} disableRipple={true}>
    {Icon}
  </Button>
);

export default IconButton;
