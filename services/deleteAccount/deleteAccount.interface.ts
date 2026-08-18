export interface DeleteAccountRequestInterface {
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  reason: string;
  reason_detail?: string;
}
