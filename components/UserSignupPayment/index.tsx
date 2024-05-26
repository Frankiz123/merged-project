import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { MERGE_LINKS } from '@utils/mergeLinks';

import styles from './userSignupPayment.module.scss';
import PlansComponent from '@components/Plans';

const UserSignUpPayment: React.FC = () => {
  const [isiPhone, setIsiPhone] = useState(false);

  useEffect(() => {
    setIsiPhone(/iPhone|ipad/i.test(window.navigator.userAgent));
  }, []);

  return (
    <div className={styles.paymentRoot}>
      <div className={styles.main_logo_conatiner}>
        <Link href='/'>
          <img src='/images/mainLogo.svg' className={styles.main_logo} />
        </Link>
      </div>

      <div className={styles.paymentContainer}>
        <PlansComponent showBottomLinks={false} />
      </div>
      <div className={isiPhone ? styles.allRightsWrapperIphone : styles.allRightsWrapper}>
        <p className={styles.allRights}>© All right reserved.</p>
        <div>
          <a href={MERGE_LINKS.terms} target='_blank' rel='noopener noreferrer'>
            TAC
          </a>
          <a href={MERGE_LINKS.imprint} target='_blank' rel='noopener noreferrer'>
            Imprint
          </a>
          <a href={MERGE_LINKS.privacy} target='_blank' rel='noopener noreferrer'>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserSignUpPayment;
