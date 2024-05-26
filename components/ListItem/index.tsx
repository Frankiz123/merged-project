import React, { useState } from 'react';

import { Timestamp } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { Box, Card, Divider, FormControlLabel, Menu, MenuItem, Radio } from '@mui/material';
import moment from 'moment';

import Text from '@components/Text';

import styles from './item.module.scss';
import { MergeLink, MergedCampaign } from '@utils/firebase-interfaces';
import { useAuth } from '@context/AuthContext';
import { CampaignLink } from '@utils/firebase-interfaces/campaign';
import Link from 'next/link';
import QRCodeComponent from '@components/QRCode/QRCode';
import ActionButton from '@components/ActionButton';

const ListItemDetail = dynamic(async () => await import('../ListItemDetail'));

interface LinkItemProps {
  id: string;
  createdAt: Timestamp | string;
  primaryText: string;
  secondaryText: string;
  totalClicks: number;
  currentLinkId: string;
  descriptionName?: string;
  onLinkChange: (id: string) => void;
  currentLink?: MergeLink | null;
  links?: string[] | CampaignLink[];
  isEdit?: boolean;
  shortUrl: string;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  currentCampaign?: MergedCampaign | null;
}

const LinkItem: React.FC<LinkItemProps> = ({
  id,
  shortUrl,
  currentLinkId,
  createdAt,
  primaryText,
  secondaryText,
  totalClicks,
  descriptionName = 'Description',
  onLinkChange,
  currentLink,
  links,
  isEdit = false,
  onDeleteClick = () => {},
  onEditClick = (_id = '') => {},
  currentCampaign,
}) => {
  const { isMobile } = useAuth();
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [textCopied, setTextCopied] = useState<boolean>(false);
  const [maxDisplayCount, setMaxDisplayCount] = useState<number>(2);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const linkDate = createdAt instanceof Timestamp ? moment(createdAt.toDate()).format('MM/DD/yyyy') : createdAt.toString();

  const onChange = (): void => {
    onLinkChange(id);
    setShowStats(false);
    setShowQRCode(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLImageElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleStatistics = (): void => {
    setAnchorEl(null);
    setShowStats(true);
    setShowQRCode(true);
  };

  const onCopyClick = (): void => {
    if (shortUrl && navigator.clipboard && navigator.clipboard.writeText) {
      void navigator.clipboard.writeText(shortUrl);
      setTextCopied(true);
      setTimeout(() => {
        setTextCopied(false);
      }, 3000);
    }
  };

  const onSee = (): void => {
    if (links) {
      setMaxDisplayCount(count => (count === links.length ? 2 : links.length));
    }
  };

  return (
    <>
      {isMobile && (
        <Card
          className={styles.mobileCardView}
          onClick={() => {
            if (id !== currentLinkId) {
              onChange();
            }
          }}>
          <Box className={styles.cardHeader}>
            <Box className={styles.headerContent}>
              <img src='images/calender.svg' />
              <Text text={`${linkDate}`} variant='subtitle1' />
            </Box>
            <Box className={styles.headerContent}>
              <img src='images/statsbar.svg' />
              <Text text={`${totalClicks}`} variant='subtitle1' />
            </Box>
          </Box>
          <Box className={styles.cardContent}>
            <Box>
              <FormControlLabel
                value={id}
                color='secondary'
                className={styles.radioText}
                control={<Radio color={'secondary'} checked={id === currentLinkId} onChange={onChange} />}
                label={''}
              />
            </Box>
            <Box className={styles.mainContent}>
              <Text text={descriptionName} variant='subtitle1' className={styles.description} />
              <Text text={`${primaryText}${secondaryText}`} className={styles.noOflinks} />
              <Box className={styles.linksWrapper}>
                {links?.slice(0, maxDisplayCount).map((link: string | CampaignLink, index: number) => {
                  if (typeof link === 'string') {
                    return (
                      <span key={index} className={styles.link}>
                        <img src='images/corner-down-right.svg' />
                        <Text text={link} className={styles.linkText} variant='subtitle1' />
                      </span>
                    );
                  } else {
                    return (
                      <Box key={index} className={styles.link}>
                        <img src='images/corner-down-right.svg' />
                        <Link
                          className={styles.linkText}
                          href={{
                            pathname: '/links',
                            query: { linkId: link.id },
                          }}>
                          {link.title}
                        </Link>
                      </Box>
                    );
                  }
                })}
                {links && links?.length > 2 && (
                  <ActionButton
                    buttonLabel={links.length === maxDisplayCount ? '...see less' : '...see more'}
                    variant={'text'}
                    isFull={false}
                    type={'button'}
                    color={'secondary'}
                    onClick={onSee}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {currentLink?.shortHandle === secondaryText && showQRCode && (
            <Box>
              <QRCodeComponent url={currentLink?.qrCodeUrl} shortUrl={currentLink?.shortUrl} id={currentLink?.id ?? ''} />
            </Box>
          )}

          <Divider sx={{ margin: '0 20px' }} />
          <Box className={styles.cardfFooter}>
            <Box className={styles.menu}>
              <img src='images/menuIcon.svg' onClick={handleClick} />
              <img
                src='images/edit1.svg'
                onClick={() => {
                  setTimeout(() => {
                    onEditClick(id);
                  }, 300);
                }}
              />
              <img src='images/delete.svg' onClick={onDeleteClick} />
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} onChange={onChange}>
                <MenuItem onClick={handleStatistics}>Detailed Description</MenuItem>
                <MenuItem onClick={handleStatistics}>Statistics</MenuItem>
                {secondaryText && <MenuItem onClick={handleStatistics}>QR Code</MenuItem>}
              </Menu>
            </Box>
            {shortUrl && (
              <Box className={styles.copy} onClick={onCopyClick}>
                {textCopied ? (
                  <>
                    <img src='/images/check.svg' />
                    copied
                  </>
                ) : (
                  <>
                    <img src='/images/copy.svg' />
                    copy
                  </>
                )}
              </Box>
            )}
          </Box>
        </Card>
      )}

      {!isMobile && (
        <Card
          key={id}
          className={[styles.card, styles.linkCard, id === currentLinkId ? styles.activeCard : ''].join(' ')}
          onClick={onChange}>
          <FormControlLabel
            value={id}
            color='secondary'
            className={styles.radioText}
            control={<Radio color={'secondary'} checked={id === currentLinkId} onChange={onChange} />}
            label={''}
          />
          <Box className={styles.descriptionWrapper}>
            <Text text={descriptionName} variant='subtitle1' className={styles.description} />
            <p className={styles.primaryText}>
              {primaryText}
              <span className={styles.secondaryText}>{secondaryText}</span>
            </p>
          </Box>
          <Box className={styles.dateWrapper}>
            <Text text={linkDate} variant='subtitle1' className={styles.date} />
            <span className={styles.totalClicks}>
              <img src='images/statsbar.svg' />
              <Text text={`${totalClicks}`} variant='subtitle1' />
            </span>
          </Box>
        </Card>
      )}
      {isMobile && id === currentLinkId && currentLink && (
        <>
          <ListItemDetail
            cardDescriptionName={currentLink?.title}
            id={currentLink?.id}
            name={'links'}
            totalClicks={currentLink?.totalClicks}
            createdAt={currentLink.createdAt}
            primaryText={`${currentLink.domain}/`}
            secondaryText={currentLink.shortHandle}
            shorlUrl={currentLink.shortUrl}
            links={links || []}
            isEdit={isEdit}
            onEditClick={onEditClick}
            link={currentLink}
            showStats={showStats}
          />
        </>
      )}
      {isMobile && id === currentLinkId && currentCampaign && (
        <>
          <ListItemDetail
            cardDescriptionName={currentCampaign.folderName}
            id={currentCampaign.id}
            totalClicks={currentCampaign?.totalClicks}
            createdAt={currentCampaign.createdAt}
            primaryText={''}
            secondaryText={`${currentCampaign?.links.length ?? 0} links`}
            links={currentCampaign.urls}
            campaign={currentCampaign}
            isEdit={isEdit}
            onEditClick={onEditClick}
            shorlUrl={''}
            showStats={showStats}
          />
        </>
      )}
    </>
  );
};

export default React.memo(LinkItem);
