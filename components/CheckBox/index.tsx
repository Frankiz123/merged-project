import React, { ChangeEventHandler } from 'react';

import { Checkbox } from '@mui/material';

import styles from './checkBox.module.scss';

interface CheckBoxProps {
  isEnable?: boolean;
  color?: 'primary' | 'secondary';
  className?: string;
  name?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const CheckBox: React.FC<CheckBoxProps> = ({ isEnable = false, color = 'primary', className = '', name = '', onChange }) => (
  <Checkbox className={[styles.CheckBox, className].join(' ')} color={color} defaultChecked={isEnable} name={name} onChange={onChange} />
);
export default React.memo(CheckBox);
