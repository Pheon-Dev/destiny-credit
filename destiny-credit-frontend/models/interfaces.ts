export interface StkQueryInterface {
  BusinessShortCode: number;
  CheckoutRequestID: string;
  passKey: any;
}

export interface StkQueryResponseInterface {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

export interface CredentialInterface {
  clientKey: string;
  clientSecret: string;
  initiatorPassword: string;
  securityCredential?: string;
  certificatePath?: string | null;
}
