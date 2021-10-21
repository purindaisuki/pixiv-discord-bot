export type Auth = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  user: {
    profile_image_urls: {
      px_16x16: string;
      px_50x50: string;
      px_170x170: string;
    };
    id: string;
    name: string;
    account: string;
    mail_address: string;
    is_premium: boolean;
    x_restrict: number;
    is_mail_authorized: boolean;
    require_policy_agreement: boolean;
  };
};
