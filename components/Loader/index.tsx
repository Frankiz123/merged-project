import React from 'react';

import { CircularProgress } from '@mui/material';

import styles from './Loader.module.scss';

interface LoaderComponentProps {
  loading?: boolean;
}

const LoaderComponent: React.FC<LoaderComponentProps> = ({ loading = false }) => {
  return <div className={styles.conatiner}>{loading && <CircularProgress className={styles.progressBar} />}</div>;
};

export default LoaderComponent;
