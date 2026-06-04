import axios from "axios";
import {
  AuthoriseUrlParams,
  ObtainTokensParams,
  RefreshTokensParams,
  TokenResponse,
} from "./types";

const OAUTH_BASE = "https://oauth.workflowmax.com";
const AUTH_ENDPOINT = `${OAUTH_BASE}/oauth/authorize`;
const TOKEN_ENDPOINT = `${OAUTH_BASE}/oauth/token`;

const DEFAULT_SCOPE =
  "openid email profile workflowmax offline_access";

/**
 * Build the OAuth 2.0 authorisation URL to redirect the user to.
 */
export function buildAuthoriseUrl(params: AuthoriseUrlParams): string {
  const url = new URL(AUTH_ENDPOINT);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", params.scope ?? DEFAULT_SCOPE);
  if (params.state) url.searchParams.set("state", params.state);
  return url.toString();
}

/**
 * Exchange an authorisation code for access + refresh tokens.
 * Access tokens expire in 30 minutes; refresh tokens in 60 days.
 */
export async function obtainTokens(
  params: ObtainTokensParams
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: params.redirectUri,
    client_id: params.clientId,
    client_secret: params.clientSecret,
  });

  const response = await axios.post<TokenResponse>(TOKEN_ENDPOINT, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
}

/**
 * Refresh an expired access token using a refresh token.
 * Include `offline_access` in scope to receive a new refresh token.
 */
export async function refreshTokens(
  params: RefreshTokensParams
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: params.refreshToken,
    client_id: params.clientId,
    client_secret: params.clientSecret,
    scope: params.scope ?? DEFAULT_SCOPE,
  });

  const response = await axios.post<TokenResponse>(TOKEN_ENDPOINT, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
}

/**
 * Decode the organisation ID from the JWT access token payload.
 * The org ID is required as the `account-id` header on all API requests.
 */
export function decodeOrgId(accessToken: string): string | null {
  try {
    const payload = accessToken.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    return (
      decoded.org_id ??
      decoded.organisation_id ??
      decoded.account_id ??
      null
    );
  } catch {
    return null;
  }
}
