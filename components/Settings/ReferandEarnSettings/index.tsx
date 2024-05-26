import React, { useEffect, useState } from 'react';

import { InputAdornment, Box, Link, Divider } from '@mui/material';
import { TwitterShareButton, WhatsappShareButton, EmailShareButton } from 'react-share';

import Text from '@components/Text';
import styles from './refer.module.scss';
import ActionButton from '@components/ActionButton';
import TextFieldBox from '@components/TextFieldBox';
import { Title, HeadingSection } from '@components/Settings';
import { useAuth } from '@context/AuthContext';
import { MERGE_LINKS } from '@utils/mergeLinks';
import IconButton from '@components/IconButton';
import { getReferrals } from '@utils/firebase-methods/database';

// svgIcons
const GiftIcon = '/images/setting/gift.svg';
const ShareIcon = '/images/setting/share-2.svg';
const UserCheckIcon = '/images/setting/user-check.svg';
const LinkIcon = '/images/setting/link.svg';
const copyIcon = '/images/copy.svg';
const copiedIcon = '/images/check.svg';

const ReferandEarnSettings: React.FC = () => {
  const { user } = useAuth();
  const serverAddress = process.env.NEXT_PUBLIC_WEB_ENV === 'dev' ? process.env.NEXT_PUBLIC_DEV_URL : process.env.NEXT_PUBLIC_PROD_URL;

  const [textCopied, setTextCopied] = useState<boolean>(false);
  const [referral, setReferral] = useState({ earnReferal: 0, notEarnYet: 0 });

  useEffect(() => {
    if (user?.invitationLink) {
      getReferrals(user?.invitationLink)
        .then(invitaions => {
          invitaions.forEach(data => {
            if (data.isPaid) {
              setReferral(prevReferral => ({
                ...prevReferral,
                earnReferal: prevReferral.earnReferal + 1,
              }));
            } else {
              setReferral(prevReferral => ({
                ...prevReferral,
                notEarnYet: prevReferral.notEarnYet + 1,
              }));
            }
          });
        })
        .catch(e => e);
    }
  }, []);

  const onChange = (): void => {};

  const onCopyClick = (): void => {
    if (user?.invitationLink && navigator.clipboard && navigator.clipboard.writeText) {
      void navigator.clipboard.writeText(`${serverAddress}/invitation/${user?.invitationLink}`);
      setTextCopied(true);
      setTimeout(() => {
        setTextCopied(false);
      }, 3000);
    }
  };

  return (
    <>
      <Title text='Refer & Earn' />
      <HeadingSection
        className={styles.heading}
        primary={`${user?.fullName}, earn 30 € for everyone you refer`}
        secondary='When a contract uses your link to sign up for a paid account, you will get 30 €.'
      />

      <Text text='How it works' className={styles.refText4} variant={'subtitle1'} />
      <Box className={styles.box1}>
        <IconButton buttonClass={styles.button1} Icon={<img src={ShareIcon} />} />
        <Text text='Share your unique referral link.' className={styles.refText5} variant={'subtitle1'} />
      </Box>
      <Box className={styles.box1}>
        <IconButton buttonClass={styles.button1} Icon={<img src={UserCheckIcon} />} />
        <Text text='Your contract uses it to create a paid account.' className={styles.refText5} variant={'subtitle1'} />
      </Box>
      <Box className={styles.box1}>
        <IconButton buttonClass={styles.button1} Icon={<img src={GiftIcon} />} />
        <Text text='We´ll give you 30 €. Amazing!' className={styles.refText5} variant={'subtitle1'} />
      </Box>
      <Box className={styles.referral}>
        <Box className={styles.referCounts}>
          <Text text='REFERRALS' className={styles.texttitle} />
          <Text text={`${referral.earnReferal}`} className={styles.textcount} />
        </Box>
        <Divider orientation='vertical' variant='middle' flexItem />
        <Box className={styles.referCounts}>
          <Text text='EARNINGS' className={styles.texttitle} />
          <Text text={`${referral.earnReferal * 30} €`} className={styles.textcount} />
        </Box>
        <Divider orientation='vertical' variant='middle' flexItem />
        <Box className={styles.referCounts}>
          <Text text='STILL OPEN' className={styles.texttitle} />
          <Text text={`${referral.notEarnYet * 30} €`} className={styles.textcount} />
        </Box>
      </Box>
      <Box className={styles.box2}>
        <TextFieldBox
          className={styles.textField}
          name=''
          label=''
          value=''
          placeholder={`${serverAddress}/invitaion/${user?.invitationLink}`}
          disabled={true}
          onChange={onChange}
          InputProps={{
            startAdornment: <InputAdornment position='start'>{<img src={LinkIcon} />}</InputAdornment>,
          }}
        />
        <ActionButton
          disableElevation={true}
          disableRipple={true}
          className={styles.button2}
          startIcon={
            <>
              <span className={[styles.copyText, textCopied ? styles.fadeOut : ''].join(' ')}>
                <img src={copyIcon} />
              </span>
              <span className={[styles.copiedText, textCopied ? styles.fadeIn : ''].join(' ')}>
                <img src={copiedIcon} />
              </span>
            </>
          }
          variant='contained'
          isFull={false}
          buttonLabel={textCopied ? 'Copied' : 'Copy'}
          onClick={onCopyClick}
        />
      </Box>
      <Box className={styles.boxLink}>
        <Link href='#' underline='none'>
          <WhatsappShareButton url={`${serverAddress}/invitaion/${user?.invitationLink}`} title={'Refferal Link'}>
            {'Share'}
          </WhatsappShareButton>
        </Link>
        <Link href='#' underline='none'>
          <TwitterShareButton url={`${serverAddress}/invitaion/${user?.invitationLink}`} title={'Refferal Link'}>
            Tweet
          </TwitterShareButton>
        </Link>
        <Link href='#' underline='none'>
          <EmailShareButton url={`${serverAddress}/invitaion/${user?.invitationLink}`} title={'Refferal Link'}>
            {'Mail'}
          </EmailShareButton>
        </Link>
      </Box>
      <Box className={styles.link}>
        <a href={MERGE_LINKS.terms} target='_blank' rel='noopener noreferrer'>
          Terms & Conditions
        </a>
      </Box>
    </>
  );
};

export default ReferandEarnSettings;
