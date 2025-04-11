/**
 * openid-auth.service.tsのcallbackメソッドをデバッグ強化するパッチ
 */

export const patchedCallback = `
callback: async (redirectUri: string, params: any, checks: any) => {
  // デバッグ情報を出力
  console.error(\`[DEBUG] Token exchange starting with: code=\${params.code?.substring(0, 5)}..., redirectUri=\${redirectUri}\`);
  console.error(\`[DEBUG] Checks: code_verifier=\${checks.code_verifier ? 'present' : 'missing'}, state=\${checks.state ? 'present' : 'missing'}\`);
  console.error(\`[DEBUG] Token endpoint: \${this.issuer.token_endpoint}\`);
  
  // トークンエンドポイントへリクエスト
  const formData = new URLSearchParams();
  formData.append('grant_type', 'authorization_code');
  formData.append('code', params.code);
  formData.append('redirect_uri', redirectUri);
  formData.append('client_id', this.issuer.client_id);
  
  if (checks.code_verifier) {
    formData.append('code_verifier', checks.code_verifier);
  }
  
  if (this.issuer.client_secret) {
    formData.append('client_secret', this.issuer.client_secret);
  }
  
  // リクエスト内容をデバッグ出力（機密情報は一部マスク）
  console.error(\`[DEBUG] Request form data: \${formData.toString().replace(/client_secret=[^&]+/, 'client_secret=***')}\`);
  
  const response = await fetch(this.issuer.token_endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  if (!response.ok) {
    // エラーレスポンスの詳細情報を取得して出力
    let errorBody = '';
    try {
      errorBody = await response.text();
    } catch (e) {
      errorBody = 'Error body could not be read';
    }
    
    console.error(\`[ERROR] Token request failed with status \${response.status}: \${response.statusText}\`);
    console.error(\`[ERROR] Request params: redirect_uri=\${redirectUri}, client_id=\${this.issuer.client_id?.substring(0, 8)}...\`);
    console.error(\`[ERROR] Response body: \${errorBody}\`);
    
    throw new Error(\`Token request failed: \${response.status} \${response.statusText} - \${errorBody}\`);
  }
  
  const tokenData = await response.json();
  console.error('[DEBUG] Token exchange successful');
  
  // expiresAtを計算
  if (tokenData.expires_in) {
    tokenData.expires_at = Math.floor(Date.now() / 1000) + tokenData.expires_in;
  }
  
  return tokenData;
},
`;