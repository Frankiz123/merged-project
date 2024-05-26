import React from 'react';

import { Typography } from '@mui/material';

interface TextProps {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  variant?: 'h1' | 'h2' | 'h3' | 'subtitle1';
  className?: string;
  startIcon?: React.ReactNode;
  align?: 'right' | 'left' | 'inherit' | 'center' | 'justify' | undefined;
}

const Text: React.FC<TextProps> = ({ text, variant = 'h1', className, startIcon = null, align = 'left', onClick }) => (
  <Typography variant={variant} className={className} align={align} onClick={onClick}>
    {startIcon}
    {text}
  </Typography>
);

export default Text;
