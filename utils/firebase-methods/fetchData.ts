/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs, getDoc, doc, Firestore, DocumentSnapshot } from 'firebase/firestore';

export const fetchAllCollections = async (db: Firestore, collectionName: string): Promise<any> =>
  await getDocs(collection(db, collectionName))
    .then(data => {
      const array: any[] = [];
      data.forEach(a => array.push(a.data()));
      return array;
    })
    .catch(() => []);

export const fetchSingleCollection = async (db: Firestore, collectionName: string, id: string): Promise<any> =>
  await getDoc(doc(db, collectionName, id))
    .then((data: DocumentSnapshot) => {
      if (data.exists()) {
        return data?.data();
      }
      return null;
    })
    .catch(() => null);
