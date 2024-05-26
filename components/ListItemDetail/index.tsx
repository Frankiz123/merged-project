import React, { useEffect, useState } from 'react';

import { Box, Button, Card, Grid } from '@mui/material';
import Link from 'next/link';
import { FieldValue, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import dynamic from 'next/dynamic';

import Text from '@components/Text';
import DropDownComponent from '@components/DropDown/DropDown';
import { getStatsByDateRange } from 'services';
import { GraphStat, MergeLink, MergedCampaign } from '@utils/firebase-interfaces';
import Loading from '@components/Loading';
import ActionButton from '@components/ActionButton';
import { getCampaignStatsByDateRange } from 'services/campaigns';
import { EditCampaignForm } from '@components/Campaign';
import EditLinkFormComponent from '@components/Links/EditLinkForm/EditLinkForm';
import QRCodeComponent from '@components/QRCode/QRCode';
import { useAuth } from '@context/AuthContext';

import styles from './listItemdetail.module.scss';
import { CampaignLink } from '@utils/firebase-interfaces/campaign';

const BarGraph = dynamic(async () => await import('../BarGraph/index'));

interface ListItemDetailProps {
  id: string;
  createdAt: FieldValue;
  totalClicks: number;
  primaryText: string;
  secondaryText?: string;
  name?: string;
  links: string[] | CampaignLink[];
  campaign?: MergedCampaign;
  isEdit?: boolean;
  cardDescriptionName?: string;
  onEditClick?: () => void;
  link?: MergeLink;
  shorlUrl: string;
  showStats?: boolean;
}

interface DateSelection {
  id: number;
  value: string;
  label: string;
  startOfMonth: string;
  endOfMonth: string;
}

/* eslint-disable @typescript-eslint/no-base-to-string */
const ListItemDetail: React.FC<ListItemDetailProps> = ({
  id,
  createdAt,
  totalClicks,
  primaryText,
  secondaryText = '',
  cardDescriptionName = 'Description',
  name,
  links,
  campaign,
  isEdit,
  showStats,
  link,
  shorlUrl,
  onEditClick = () => {},
}) => {
  const { isMobile } = useAuth();

  const linkDate =
    createdAt instanceof Timestamp
      ? moment(createdAt.toDate()).format('MM/DD/yyyy')
      : moment(createdAt.toString(), 'MM/DD/YYYY').format('MM/DD/yyyy');

  const [selectedValue, setSelectedValue] = useState<string>('This month');
  const [dates, setDates] = useState<DateSelection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statsData, setStatData] = useState<GraphStat[]>([]);
  const [maxDisplayCount, setMaxDisplayCount] = useState<number>(3);
  const [monthlyTotal, setMonthlyTotal] = useState<string>('-');
  const [textCopied, setTextCopied] = useState<boolean>(false);

  useEffect(() => {
    lastSixMonths();
  }, [createdAt]);

  useEffect(() => {
    const item = dates.find(date => date.value === selectedValue);
    if (item) {
      setLoading(true);
      const loadData = async (): Promise<void> => {
        if (name) {
          const data = await getStatsByDateRange(id, item.startOfMonth, item.endOfMonth);
          const sumOfClicks = data.reduce((total, obj: GraphStat) => total + obj.clicks, 0);
          setMonthlyTotal(sumOfClicks.toFixed());

          setStatData(data);
          setLoading(false);
        } else {
          const data = await getCampaignStatsByDateRange(id, item.startOfMonth, item.endOfMonth);
          const sumOfClicks = data.reduce((total, obj: GraphStat) => total + obj.clicks, 0);
          setMonthlyTotal(sumOfClicks.toFixed());

          setStatData(data);
          setLoading(false);
        }
      };
      void loadData();
    }
  }, [selectedValue, dates]);

  const handleSelectChange = (event: DateSelection): void => {
    setSelectedValue(event.value);
  };

  const onCopyClick = (): void => {
    if (shorlUrl && navigator.clipboard && navigator.clipboard.writeText) {
      void navigator.clipboard.writeText(`${shorlUrl}`);
      setTextCopied(true);
      setTimeout(() => {
        setTextCopied(false);
      }, 3000);
    }
  };

  const lastSixMonths = (): void => {
    const currentMonth = moment();
    const startOfMonth = currentMonth.startOf('month').format('YYYY-MM-DD');
    const endOfMonth = currentMonth.endOf('month').format('YYYY-MM-DD');
    const months: DateSelection[] = [
      {
        id: 0,
        value: 'This month',
        label: 'This month',
        startOfMonth,
        endOfMonth,
      },
    ];

    const linkCreationDate =
      createdAt instanceof Timestamp
        ? moment(createdAt.toDate()).format('MM/DD/yyyy')
        : moment(createdAt.toString(), 'MM/DD/YYYY').format('MM/DD/yyyy');

    let index = 0;
    let activeMonth = '';
    activeMonth = moment(currentMonth).subtract(index, 'month').format('MM/yyyy');
    while (moment(activeMonth, 'MM/yyyy').format('MM/yyyy') > moment(linkCreationDate.toString()).format('MM/yyyy')) {
      index++;
      activeMonth = moment(currentMonth).subtract(index, 'month').format('MM/yyyy');

      const month = moment(currentMonth).subtract(index, 'month');
      const startOfMonth = month.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = month.endOf('month').format('YYYY-MM-DD');
      months.push({
        id: index,
        value: month.format('MMMM, yyyy'),
        label: month.format('MMMM, yyyy'),
        startOfMonth,
        endOfMonth,
      });
    }

    setDates(months);
    setSelectedValue('This month');
  };

  const onLinkSeeMore = (): void => {
    setMaxDisplayCount(count => (count === links.length ? 3 : links.length));
  };

  return (
    <>
      <Box className={styles.detailWrapper}>
        {!isMobile && (
          <Card className={[styles.card, styles.detailCard].join(' ')}>
            <Box className={styles.row}>
              <Text text={cardDescriptionName} variant='subtitle1' className={styles.description} />
              <Box className={styles.iconContainer}>
                <span className={styles.centerRow}>
                  <img src='images/statsbar.svg' />
                  <Text text={`${totalClicks}`} variant='subtitle1' className={styles.boldText} />
                  <Text text='total clicks' variant='subtitle1' className={styles.normalText} />
                </span>
                <span className={styles.centerRow}>
                  <img src='images/calender.svg' />
                  <Text text={`${linkDate}`} variant='subtitle1' className={styles.normalText} />
                </span>
              </Box>
            </Box>

            {!name && isEdit && <EditCampaignForm campaign={campaign} onEditClick={onEditClick} />}
            {name && isEdit && <EditLinkFormComponent link={link} onEditClick={onEditClick} />}
            {!isEdit && (
              <>
                <div className={styles.detailContainer}>
                  <Box width={`${isMobile ? '100%' : '50%'}`}>
                    <Box className={styles.row}>
                      <p className={styles.primaryText}>
                        {primaryText}
                        {secondaryText && <span className={styles.secondaryText}>{secondaryText}</span>}
                      </p>
                      {secondaryText && name && (
                        <Button className={styles.copy} variant='text' onClick={onCopyClick} disableRipple={true}>
                          <>
                            <span className={[styles.copyText, textCopied ? styles.fadeOut : ''].join(' ')}>
                              <img src='/images/copy.svg' />
                              Copy
                            </span>
                            <span className={[styles.copiedText, textCopied ? styles.fadeIn : ''].join(' ')}>
                              <img src='/images/check.svg' />
                              Copied
                            </span>
                          </>
                        </Button>
                      )}
                    </Box>
                    <Box className={'linksContainer'}>
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
                            <span key={index} className={styles.link}>
                              <img src='images/corner-down-right.svg' />
                              <Link
                                className={styles.linkText}
                                href={{
                                  pathname: '/links',
                                  query: { linkId: link.id },
                                }}>
                                {link.title}
                              </Link>
                            </span>
                          );
                        }
                      })}
                      {links?.length > 3 && (
                        <ActionButton
                          buttonLabel={links.length === maxDisplayCount ? '...see less' : '...see more'}
                          variant={'text'}
                          isFull={false}
                          type={'button'}
                          color={'secondary'}
                          onClick={onLinkSeeMore}
                        />
                      )}
                    </Box>
                  </Box>
                  {name && link && (
                    <Box>
                      <QRCodeComponent url={link?.qrCodeUrl} shortUrl={link?.shortUrl} id={link.id} />
                    </Box>
                  )}
                </div>
              </>
            )}
          </Card>
        )}

        {isMobile && isEdit && (
          <Card className={[styles.card, styles.detailCard].join(' ')}>
            {!name && isEdit && <EditCampaignForm campaign={campaign} onEditClick={onEditClick} />}
            {name && isEdit && <EditLinkFormComponent link={link} onEditClick={onEditClick} />}
          </Card>
        )}

        {showStats && isMobile && (
          <Card className={styles.mobileGraphView}>
            <Box className={styles.cardHeader}>Statistics</Box>
            <Box className={styles.cardContent}>
              <Box className={styles.LinkDropDownSection}>
                <Box className={styles.dropDownSection}>
                  <DropDownComponent
                    selectedValue={selectedValue}
                    fullWidth={true}
                    data={dates}
                    handleChangeValue={handleSelectChange}
                    className={styles.dropDown}
                  />
                </Box>

                {name ? (
                  <Link className={styles.firstLink} href={{ pathname: '/dashboard', query: { linkId: id } }}>
                    {`Link detail statistic`}
                  </Link>
                ) : (
                  <></>
                )}
              </Box>
              <Box className={styles.statsClicks}>
                <span className={styles.center}>
                  <img src='/images/statsbar.svg' />
                  <Text text={`${monthlyTotal}`} className={styles.totalClicksText} />
                  <Text text='clicks' className={styles.ClicksText} />
                </span>
              </Box>
              <Box className={styles.graph}>
                {loading ? (
                  <Loading />
                ) : (
                  <Box className={styles.chartBox}>
                    <BarGraph stats={statsData} />
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        )}

        {!isMobile && (
          <Card className={styles.graphstatsCard}>
            <Grid container className={styles.graphstatsContainer}>
              <Grid item sm={12} xs={12} md={6}>
                <Box className={styles.statsBar}>
                  <Text text='Statistics' className={styles.statsText} />
                  <span className={styles.center}>
                    <img src='/images/statsbar.svg' />
                    <Text text={`${monthlyTotal}`} className={styles.totalClicksText} />
                    <Text text='clicks' className={styles.ClicksText} />
                  </span>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Box className={styles.dropDownSection}>
                  <DropDownComponent
                    selectedValue={selectedValue}
                    fullWidth={true}
                    data={dates}
                    handleChangeValue={handleSelectChange}
                    className={styles.dropDown}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} className={styles.graph}>
                {loading ? (
                  <Loading />
                ) : (
                  <Box className={styles.chartBox}>
                    <BarGraph stats={statsData} />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={12} className={styles.LinkText}>
                {name ? (
                  <Link className={styles.firstLink} href={{ pathname: '/dashboard', query: { linkId: id } }}>
                    {`Link detail statistic`}
                  </Link>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </Card>
        )}
      </Box>
    </>
  );
};

export default ListItemDetail;
