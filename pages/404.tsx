import React from 'react';
import { Card } from '@mui/material';
import Link from 'next/link';

import AuthWrapper from '@components/wrapper/AuthWrapper';
import ActionButton from '@components/ActionButton';

const PageNotFound: React.FC = () => (
  <AuthWrapper>
    <div className='page404'>
      <Card className='card404'>
        <h1>LINK/PAGE NOT FOUND</h1>
        <p>The link/page you&apos;re looking for doesn&apos;t exists.</p>
        <br />
        <br />
        <Link href='/'>
          <ActionButton buttonLabel='Back to Home' />
        </Link>
      </Card>
    </div>
  </AuthWrapper>
);

export default PageNotFound;
