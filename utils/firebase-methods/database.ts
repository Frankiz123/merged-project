/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  orderBy,
  query,
  QuerySnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, StorageReference, uploadString } from 'firebase/storage';

import moment from 'moment';
import { db, storage } from '@config/firebase';
import { MergedCampaign, MergeLink, Stat } from '@utils/firebase-interfaces';
import { COLLECTION_NAME } from '@utils/FirebaseConstants';
import { attachDomainAndUtm, generateQRCode } from '@utils/links';
import { MergeInvitation } from '@utils/firebase-interfaces/invitation';

export const saveRecordWithId = async (db: Firestore, collectionName: string, docData: any): Promise<boolean> => {
  const ref = doc(collection(db, collectionName), docData.id);
  return await setDoc(ref, docData)
    .then(_doc => true)
    .catch(_e => false);
};

export const saveRecord = async (db: Firestore, collectionName: string, docData: any): Promise<string | boolean> => {
  const ref = doc(collection(db, collectionName));
  docData.id = ref.id;
  return await setDoc(ref, docData)
    .then(_doc => docData.id)
    .catch(_e => false);
};

export const getuniqueId = async (db: Firestore, collectionName: string): Promise<string> => {
  let id = '';
  do {
    const ref = doc(collection(db, collectionName));
    id = ref.id;
    const isValid = await validateInvitationLink(db, id);
    if (isValid) {
      break;
    }
  } while (true);
  return id;
};

export const updateRecord = async (db: Firestore, collectionName: string, id: string, docData: any): Promise<boolean> => {
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, docData)
    .then(_doc => true)
    .catch(_e => false);
};

export const getMostRepeatedCountry = async (db: Firestore, linkId: string): Promise<Record<string, number>> => {
  const countryCounts: Record<string, number> = {};
  await getDocs(query(collection(db, 'stats'), where('linkid', '==', linkId))).then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const country = doc.data().countryName;
      countryCounts[country] = countryCounts[country] ? countryCounts[country] + 1 : 1;
    });
  });
  return countryCounts;
};

export const getBasicPlan = async (db: Firestore, collectionName: string): Promise<QuerySnapshot<DocumentData> | null> => {
  try {
    const linkQuery = query(collection(db, collectionName), where('planName', '==', 'Basic'));
    return await getDocs(linkQuery);
  } catch (_error) {
    return null;
  }
};

export const getRecordsByUser = async (
  db: Firestore,
  collectionName: string,
  userId: string
): Promise<QuerySnapshot<DocumentData> | null> => {
  try {
    const linkQuery = query(collection(db, collectionName), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    return await getDocs(linkQuery);
  } catch (_error) {
    return null;
  }
};

export const getSubscriptionPayment = async (
  db: Firestore,
  collectionName: string,
  userId: string
): Promise<QuerySnapshot<DocumentData> | null> => {
  try {
    const linkQuery = query(collection(db, collectionName), where('paddle_user_id', '==', userId), orderBy('createdAt', 'desc'));
    return await getDocs(linkQuery);
  } catch (_error) {
    return _error;
  }
};

export const getSubscriptionCreated = async (
  db: Firestore,
  collectionName: string,
  userId: string
): Promise<QuerySnapshot<DocumentData> | null> => {
  try {
    const linkQuery = query(collection(db, collectionName), where('uid', '==', userId), where('alert_name', '==', 'subscription_created'));
    return await getDocs(linkQuery);
  } catch (_error) {
    return null;
  }
};

export const whereUserId = async (
  db: Firestore,
  collectionName: string,
  userId: string,
  queryWhere: string
): Promise<QuerySnapshot<DocumentData> | null> => {
  try {
    const linkQuery = query(collection(db, collectionName), where(queryWhere, '==', userId));
    return await getDocs(linkQuery);
  } catch (_error) {
    return null;
  }
};

export const deleteSingleRecordsFirestore = async (db: Firestore, collectionName: string, id: string): Promise<boolean> => {
  return await deleteDoc(doc(db, collectionName, id))
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

export const singleImageUpload = async (CollectionName: string, base64: string | File, linkId?: string): Promise<string> => {
  try {
    let imgRef: StorageReference;

    if (linkId) {
      imgRef = ref(storage, `${CollectionName}/${linkId}/${linkId}`);
    } else {
      imgRef = ref(storage, `${CollectionName}/${new Date().getTime()}`);
    }

    const uploadTask = uploadString(imgRef, base64 as string, 'data_url');
    const result = await uploadTask;
    const downloadURL = await getDownloadURL(result.ref);
    return downloadURL;
  } catch (err) {
    return err;
  }
};

export const saveLink = async (db: Firestore, docData: MergeLink): Promise<string> => {
  let isValidLink = false;
  if (docData.shortHandle) {
    const isValid = await validateShortHandle(db, docData.shortHandle);
    if (isValid) {
      const ref = doc(collection(db, COLLECTION_NAME.link));
      docData.id = ref.id;
      docData = attachDomainAndUtm(docData);
      const qrRes = await generateQRCode(docData.shortUrl);
      const qrUrl = await singleImageUpload(COLLECTION_NAME.link, qrRes, docData.id);
      docData.qrCodeUrl = qrUrl;
      return await setDoc(ref, docData)
        .then(_doc => '1')
        .catch(_e => '-1');
    }
    return '-2';
  } else {
    do {
      const ref = doc(collection(db, COLLECTION_NAME.link));
      const id = ref.id;
      const shortHandle = id.slice(0, 7);
      isValidLink = await validateShortHandle(db, shortHandle);
      if (isValidLink) {
        docData.shortHandle = shortHandle;
        docData.id = id;
        docData = attachDomainAndUtm(docData);
        const qrRes = await generateQRCode(docData.shortUrl);
        const qrUrl = await singleImageUpload(COLLECTION_NAME.link, qrRes, docData.id);
        docData.qrCodeUrl = qrUrl;
        return await setDoc(ref, docData)
          .then(_doc => '1')
          .catch(_e => '-1');
      }
    } while (!isValidLink);
  }
  return '-1';
};

export const updateLink = async (db: Firestore, linkId: string, docData: any): Promise<string> => {
  let isValidLink = false;
  if (docData.shortHandle) {
    const isValid = await validateShortHandle(db, docData.shortHandle, linkId);
    if (isValid) {
      const ref = doc(db, COLLECTION_NAME.link, linkId);
      docData.id = ref.id;
      docData = attachDomainAndUtm(docData);
      const qrRes = await generateQRCode(docData.shortUrl);
      const qrUrl = await singleImageUpload(COLLECTION_NAME.link, qrRes, docData.id);
      docData.qrCodeUrl = qrUrl;
      return await updateDoc(ref, docData)
        .then(_doc => '1')
        .catch(_e => '-1');
    }
    return '-2';
  } else {
    do {
      const ref = doc(db, COLLECTION_NAME.link, linkId);
      const id = ref.id;
      const shortHandle = id.slice(0, 7);
      isValidLink = await validateShortHandle(db, shortHandle, linkId);
      if (isValidLink) {
        docData.shortHandle = shortHandle;
        docData.id = id;
        docData = attachDomainAndUtm(docData);
        const qrRes = await generateQRCode(docData.shortUrl);
        const qrUrl = await singleImageUpload(COLLECTION_NAME.link, qrRes, docData.id);
        docData.qrCodeUrl = qrUrl;
        return await updateDoc(ref, docData)
          .then(_doc => '1')
          .catch(_e => '-1');
      }
    } while (!isValidLink);
  }
  return '-1';
};

const validateShortHandle = async (db: Firestore, shortHandle: string, linkId?: string): Promise<boolean> => {
  let linkQuery;
  if (linkId) {
    linkQuery = query(collection(db, COLLECTION_NAME.link), where('shortHandle', '==', shortHandle), where('id', '!=', linkId));
  } else {
    linkQuery = query(collection(db, COLLECTION_NAME.link), where('shortHandle', '==', shortHandle));
  }
  const querySnapshot = await getDocs(linkQuery);
  return querySnapshot.size === 0;
};

export const getUserLinks = async (db: Firestore, userId: string): Promise<MergeLink[]> => {
  const data: MergeLink[] = [];
  try {
    const results = await getRecordsByUser(db, COLLECTION_NAME.link, userId);
    if (results && results.size > 0) {
      results.forEach(doc => {
        data.push(doc.data() as MergeLink);
      });
    }
    return data;
  } catch (error) {
    return data;
  }
};

export const getUserCampaigns = async (db: Firestore, userId: string): Promise<MergedCampaign[]> => {
  const data: MergedCampaign[] = [];
  try {
    const results = await getRecordsByUser(db, COLLECTION_NAME.campaign, userId);
    if (results && results.size > 0) {
      results.forEach(doc => {
        data.push(doc.data() as MergedCampaign);
      });
    }
    return data;
  } catch (error) {
    return data;
  }
};

export const validateInvitationLink = async (db: Firestore, invitationLink: string): Promise<boolean> => {
  const userQuery = query(collection(db, COLLECTION_NAME.user), where('invitationLink', '==', invitationLink));
  const querySnapshot = await getDocs(userQuery);
  return querySnapshot.size === 0;
};

export const checkInvitedUrlExistence = async (invitationLink: string): Promise<boolean> => {
  try {
    const q = query(collection(db, COLLECTION_NAME.user), where('invitationLink', '==', invitationLink));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking invited URL existence:', error);
    return false;
  }
};

export const saveInvitation = async (userID: string, refferalToken: string, refferedId: string, collection: string): Promise<void> => {
  const invitationData: MergeInvitation = {
    id: '',
    createdAt: Timestamp.fromDate(new Date()),
    userID,
    isPaid: false,
    referralToken: refferalToken,
    referredID: refferedId,
    planPurchased: false,
  };
  await saveRecord(db, collection, invitationData);
};

export const getDashboardLinkClicksData = async (userId: string, startDate: string, endDate: string): Promise<number> => {
  const parsedStartDate = moment.utc(new Date(startDate).setHours(0, 0, 0, 1)).toDate();

  const parsedEndDate = moment.utc(new Date(endDate).setHours(23, 59, 59, 999)).toDate();
  const stats: Stat[] = [];
  const stateQuery = query(
    collection(db, COLLECTION_NAME.stats),
    where('userId', '==', userId),
    where('createdAt', '>=', Timestamp.fromDate(parsedStartDate)),
    where('createdAt', '<=', Timestamp.fromDate(parsedEndDate))
  );
  const querySnapshot = await getDocs(stateQuery);
  querySnapshot.forEach(entry => {
    stats.push(entry.data() as Stat);
  });

  return stats.length;
};

export const getReferrals = async (invitationLink: string): Promise<MergeInvitation[]> => {
  const invitaions: MergeInvitation[] = [];
  const invitaionQuery = query(collection(db, COLLECTION_NAME.invitations), where('referralToken', '==', invitationLink));
  const querySnapshot = await getDocs(invitaionQuery);
  querySnapshot.forEach(entry => {
    invitaions.push(entry.data() as MergeInvitation);
  });

  return invitaions;
};
