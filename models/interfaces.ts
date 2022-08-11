import { IncomingHttpHeaders } from "http";

export type TransactionType =
  | 'CustomerPayBillOnline'
  | 'CustomerBuyGoodsOnline';

export interface HttpServiceConfig {
  baseURL: string;
  headers: Record<string, any>;
}

export interface HttpServiceResponse<T extends any = any> {
  protocol: string;
  hostname: string;
  path: string;
  method: string;
  headers: IncomingHttpHeaders;
  statusCode: number;
  statusMessage: string;
  data: T;
}

export interface StkQueryInterface {
  BusinessShortCode: number;
  CheckoutRequestID: string;
  passKey: any;
}

export interface StkPushInterface {
  BusinessShortCode: number;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  passKey: string;
  TransactionType?: TransactionType;
  TransactionDesc?: string;
}

export interface StkPushResponseInterface {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface StkQueryResponseInterface {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

export interface CredentialsInterface {
  clientKey: string;
  clientSecret: string;
  initiatorPassword: string;
  securityCredential?: string;
  certificatePath?: string | null;
}

export interface C2BSimulateInterface {
  CommandID: TransactionType;
  Amount: number;
  Msisdn: number;
  BillRefNumber?: any;
  ShortCode: number;
}

export interface C2BSimulateResponseInterface {
  ConversationID: string;
  OriginatorCoversationID: string;
  ResponseDescription: string;
}

export interface C2BRegisterResponseInterface {
  ConversationID: string;
  OriginatorCoversationID: string;
  ResponseDescription: string;
}

export interface AuthorizeResponseInterface {
  access_token: string;
  expires_in: string;
}