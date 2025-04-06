/**
 * Token entity for database storage
 */
export interface TokenEntity {
  id: string;
  access_token: string;
  refresh_token?: string | null;
  token_type: string;
  expires_at: Date;
  scope: string;
  id_token?: string | null;
  contract_id: string;
  created_at: Date;
  updated_at: Date;
}
