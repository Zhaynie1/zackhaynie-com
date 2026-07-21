/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when the env var
 * is set. Without a secret these endpoints would be open to the internet —
 * and they cost money to run — so refuse to serve unless it's configured.
 */
export function isAuthorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Allow unauthenticated runs locally so you can test with curl.
    return process.env.NODE_ENV !== "production";
  }
  return request.headers.get("authorization") === `Bearer ${secret}`;
}
