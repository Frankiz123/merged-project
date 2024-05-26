/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Divider,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from '@mui/material';
import { Id, toast } from 'react-toastify';

import { Title, HeadingSection, paymentStyles as styles } from '@components/Settings';
import moment from 'moment';
import Text from '@components/Text';
import RadioButton from '@components/RadioButton/RadioButton';
import { saveRecord } from '@utils/firebase-methods/database';
import { useAuth } from '@context/AuthContext';
import { db } from '@config/firebase';
import { CardDetails } from '@utils/firebase-interfaces';
import { capitalize } from 'lodash';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';
import { axiosPost, axiosGet } from 'services/axios_get';

import { collection, query, where, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { useProtected } from '@context/ProtectedContext';
const RADIO_DATA = [
  [{ value: 'accountEmail', label: 'Sent to my account email' }],
  [{ value: 'alternativeEmail', label: 'Sent to alternative email' }],
  [{ value: 'payment', label: '' }],
];

interface PaddleWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Paddle: any;
  dataLayer: any;
}

declare const window: PaddleWindow;

const cancelToast: Id = 'subscriptionCancelToast';

const PaymentsSettings: React.FC = () => {
  const { user, userPlan } = useAuth();
  const { CardDetail } = useProtected();

  const [txn, setTxn] = useState();
  const [transactions, setTransactions] = useState<any | null>();
  const [editButtnEnable, setEditButtnEnable] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('payment');

  const radioButtonPaymentHandler = (event: string): void => {
    setSelectedPayment(event);
  };

  const checkoutCompleted = async (data: any): Promise<void> => {
    try {
      if (data.name === 'checkout.completed' && user) {
        const { data: paymentData } = data;
        const { customer, payment } = paymentData;
        if (payment.method_details && payment.method_details.type === 'card') {
          const { card } = payment.method_details;
          const cardDetails: CardDetails = {
            id: '',
            card_type: card.type,
            subscription_id: userPlan?.subscription_id || '',
            expiry_date: `${card.expiry_month}/${card.expiry_year}`,
            last_four_digits: card.last4,
            payment_method: 'card',
            paddle_user_id: customer.id,
          };
          const cardRef = collection(db, COLLECTION_NAME.cardDetails);
          const q = query(cardRef, where('paddle_user_id', '==', customer.id));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(docSnap => {
            deleteDoc(doc(db, COLLECTION_NAME.cardDetails, docSnap.id))
              .then(res => res)
              .catch(e => e);
          });
          void saveRecord(db, COLLECTION_NAME.cardDetails, cardDetails);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const paddleScript = document.createElement('script');
    paddleScript.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    paddleScript.async = true;
    if (user) {
      paddleScript.onload = () => {
        if (process.env.NEXT_PUBLIC_WEB_ENV !== 'prod') {
          window.Paddle.Environment.set('sandbox');
        }
        const paddleCustomer = {
          email: user.email,
        };
        window.Paddle.Setup({
          seller: Number(
            process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_VENDOR_ID : process.env.NEXT_PUBLIC_DEV_VENDOR_ID
          ),
          pwAuth: Number(
            process.env.NEXT_PUBLIC_WEB_ENV === 'prod' ? process.env.NEXT_PUBLIC_PROD_AUTH_CODE : process.env.NEXT_PUBLIC_DEV_AUTH_CODE
          ),

          pwCustomer: paddleCustomer,
          checkout: {
            settings: {
              displayMode: 'overlay',
              theme: 'light',
              locale: 'en',
            },
          },
          eventCallback: async (data: any) => {
            if (data.name === 'checkout.completed') {
              await checkoutCompleted(data);
            }
            if (data.name === 'checkout.loaded' || data.name === 'checkout.customer.created' || data.name === 'checkout.completed') {
              const dataLayerInfo = {
                event: data.name,
                ecommerce: {
                  transaction_id: data.data?.transaction_id,
                  affiliation: data.name,
                  value: data.data?.recurring_totals?.total,
                  currency: data.data?.currency_code,
                  items: data.data?.items,
                  customer_id: data.data?.customer?.id,
                  customer_email: data.data?.customer?.email,
                },
              };
              window.dataLayer = window.dataLayer || [];
              if (window.dataLayer) {
                window.dataLayer?.push(dataLayerInfo);
              }
            }
          },
        });
      };
      document.body.appendChild(paddleScript);
    }

    return () => {
      paddleScript.onload = null;
    };
  }, []);

  useEffect(() => {
    // getSubscriptionPayment(db, 'paymentEvents', userPlan?.paddle_user_id || '')
    //   .then(res => {
    //     const invoiceList: Invoice[] = [];
    //     res?.forEach(v => invoiceList.push(v.data() as Invoice));
    //     setInvoices(invoiceList);
    //   })
    //   .catch(e => e);

    axiosPost('/user/subscription/updateTransaction', {
      subscription_id: userPlan?.subscription_id,
    })
      .then((res: any) => {
        setEditButtnEnable(true);
        setTxn(res?.result?.data?.id);
      })
      .catch(e => {
        return e;
      });

    axiosGet(`/user/transactions/${user?.customer?.id}`, {})
      .then((res: any) => {
        setTransactions(res.result.data);
      })
      .catch(e => {
        return e;
      });
  }, []);

  const onEditButton = (): void => {
    window.Paddle.Checkout.open({
      transactionId: txn,
    });
  };

  const onCancelButton = (): void => {
    toast.loading('Cancelling your subscription', { toastId: cancelToast });
    axiosPost('/user/subscription/cancel', {
      subscription_id: userPlan?.subscription_id,
    })
      .then((res: any) => {
        if (res?.success) {
          setTimeout(() => {
            window.location.replace('/');
            toast.update(cancelToast, {
              render: 'Subscription Canceled successfully',
              type: 'success',
              isLoading: false,
              autoClose: 3000,
            });
          }, 2000);
          return;
        }
        toast.update(cancelToast, {
          render: 'Something went wrong. Please try again',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch(e => {
        toast.update(cancelToast, {
          render: 'Something went wrong. Please try again',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        return e;
      });
  };

  // const { handleSubmit, handleChange, errors, values, touched } = useFormik({
  //   initialValues: {
  //     email: '',
  //   },
  //   validationSchema: yup.object({
  //     email: yup
  //       .string()
  //       .email('Email must bs a valid email address')
  //       .required('Email is required'),
  //   }),
  //   onSubmit,
  // });
  const pdfDownload = (txn: string): void => {
    axiosGet(`/user/transactions/pdf/${txn}`, {})
      .then((res: any) => {
        if (res?.result?.data?.url) {
          window.open(res?.result?.data?.url, '_blank');
        }
      })
      .catch(e => {
        throw e;
      });
  };

  return (
    <form className={styles.form}>
      <Title text='Payments' />
      {/* <HeadingSection
        primary="Invoice Mail"
        secondary="Update your billing details and address."
      />
      <Box className={styles.accountEmail}>
        <RadioButton
          value={selectedRadioValue}
          onChange={radioButtonEmailHandler}
          data={RADIO_DATA[0]}
        />
      </Box>
      <Box className={styles.alternativeEmail}>
        <RadioButton
          value={selectedRadioValue}
          onChange={radioButtonEmailHandler}
          data={RADIO_DATA[1]}
        />
        <TextFieldBox
          className={styles.alternativeEmailTextField}
          name="email"
          label=""
          InputProps={{
            endAdornment: <FieldInputAdornment error={errors.email} />,
          }}
          value={values.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={!touched.email && errors.email ? errors.email : ''}
          disabled={loading}
        />
      </Box>
      <Divider /> */}
      <HeadingSection primary='Payment Method' secondary='Update or change your payment method.' />
      <Box className={styles.payment}>
        <Box className={styles.aboveDivider}>
          <RadioButton value={selectedPayment} onChange={radioButtonPaymentHandler} data={RADIO_DATA[2]} />
          {CardDetail && CardDetail?.card_type === 'visa' && <img src={'/images/visacard.png'} className={styles.textFieldIcons} />}
          {CardDetail && CardDetail?.card_type === 'paypal' && <img src={'/images/paypal.png'} className={styles.textFieldIcons} />}
          {CardDetail && CardDetail?.card_type !== 'paypal' && (
            <Text text={`${capitalize(CardDetail?.card_type)} **** ${CardDetail?.last_four_digits || ''}`} className={styles.paymentText} />
          )}
        </Box>
        <Divider className={styles.dividerPayment} />
        <Box className={styles.paymentButtonBox}>
          <Button className={styles.paymentButton} onClick={onEditButton} disabled={!editButtnEnable}>
            {editButtnEnable ? <img src='/images/edit.svg' /> : <img src='/images/edit1.svg' />}
            Edit
          </Button>
          <Text text='Cancel' className={styles.paymentButtonBoxText} onClick={onCancelButton} />
        </Box>
      </Box>

      {/* <Box className={styles.paypalPayment}>
        <RadioButton
          value={selectedPayment}
          onChange={radioButtonPaymentHandler}
          data={RADIO_DATA[2]}
        />
        <img src={'/images/paypal.png'} className={styles.textFieldIcons} />
        <Text
          text="PayPal - testmail@gmail.com"
          className={styles.paymentText}
        />
      </Box> */}

      {/* <Box className={styles.addButton}>
        <IconButton aria-label="delete" onClick={handleNewCustomDomain}>
          <AddCircleOutlineIcon color="secondary" />
        </IconButton>
        <Text
          text="Add Payment"
          variant={'subtitle1'}
          className={styles.addLinkStyle}
        />
      </Box> */}
      <Divider />
      <Text text='Billing History' className={styles.billingHistory} />
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: 'none',
            },
          }}>
          <TableHead>
            <TableRow sx={{ '& td': { border: 0 } }}>
              <TableCell align='left'>Date</TableCell>
              <TableCell align='center'>Invoices</TableCell>
              <TableCell align='center'>Amount</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align='right'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions?.map(invoice => (
              <TableRow key={invoice.alert_id}>
                <TableCell align='left'>{moment(invoice?.created_at).format('DD.MM.YYYY')}</TableCell>
                <TableCell align='center'>{invoice.invoice_number || '-'}</TableCell>
                <TableCell align='center'>{`€ ${invoice.payments[0]?.amount / 100 || 0}`}</TableCell>
                <TableCell align='center'>
                  <Box className={`subscription_status ${invoice.status}`}>
                    {/* {STATUS[invoice.alert_name]} */}
                    {invoice.status}
                  </Box>
                </TableCell>
                <TableCell align='right'>
                  <Box
                    className={styles.download}
                    onClick={() => {
                      pdfDownload(invoice?.id);
                    }}>
                    {/* {invoice?.receipt_url ? 'VIEW INVOICE' : '-'}
                    {invoice?.receipt_url ? <OpenInNewIcon /> : <></>} */}
                    {invoice.invoice_number ? <OpenInNewIcon /> : <></>}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  );
};

export default PaymentsSettings;
