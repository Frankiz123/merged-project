import { Timestamp } from 'firebase/firestore';

export interface Invoice {
  alert_id: number;
  alert_name: string;
  currency: string;
  email: string;
  event_time: Timestamp;
  status: string;
  subscription_id: string;
  subscription_plan_id: string;
  uid: string;
  unit_price: string;
  user_id: string;
  receipt_url?: string;
  order_id?: string;
  createdAt: Timestamp;
  paddle_user_id: string;
  next_bill_date?: string;
  planId?: string;
}
