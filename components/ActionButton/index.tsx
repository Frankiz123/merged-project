import React from 'react';

import { Button, CircularProgress, Box } from '@mui/material';

import styles from './actionButton.module.scss';

interface ActionButtonProps {
  loading?: boolean;
  buttonLabel: string;
  variant?: 'contained' | 'outlined' | 'text';
  isFull?: boolean;
  type?: 'submit' | 'button';
  color?: 'primary' | 'secondary';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  buttonClass?: string;
  showLoader?: boolean;
  loaderColor?: 'inherit' | 'info' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  onClick?: () => void;
  disableElevation?: boolean;
  disableRipple?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  loading = false,
  buttonLabel,
  isFull = true,
  variant = 'contained',
  type = 'submit',
  color = 'primary',
  loaderColor = 'primary',
  startIcon = null,
  endIcon = null,
  className = '',
  buttonClass = '',
  showLoader = true,
  onClick = () => {},
  disableElevation = false,
  disableRipple = false,
}) => (
  <Box className={[styles.buttonWrapper, className].join(' ')}>
    <Button
      disableElevation={disableElevation}
      disableRipple={disableRipple}
      fullWidth={isFull}
      className={buttonClass}
      variant={variant}
      disabled={loading}
      color={color}
      type={type}
      sx={{ textTransform: 'inherit' }}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}>
      {buttonLabel}
      {loading && showLoader && <CircularProgress size={20} className={styles.loading} color={loaderColor} />}
    </Button>
  </Box>
);

export default React.memo(ActionButton);
