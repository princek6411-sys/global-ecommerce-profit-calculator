import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook verification is not configured.' }, { status: 503 });
  const rawBody = await request.text();
  const provided = request.headers.get('x-shopify-hmac-sha256') ?? '';
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');
  if (!provided || !safeEqual(provided, expected)) return NextResponse.json({ error: 'Invalid Shopify webhook signature.' }, { status: 401 });

  const webhookId = request.headers.get('x-shopify-webhook-id');
  const topic = request.headers.get('x-shopify-topic');
  const shop = request.headers.get('x-shopify-shop-domain');
  const apiVersion = request.headers.get('x-shopify-api-version');
  const triggeredAt = request.headers.get('x-shopify-triggered-at');

  // Do not acknowledge durably until we can store/process the event. Returning
  // 503 allows Shopify's delivery/retry machinery to retry later.
  return NextResponse.json({
    accepted: false,
    durablePersistence: false,
    webhookId,
    topic,
    shop,
    apiVersion,
    triggeredAt,
    error: 'BLOCKED: durable webhook persistence/queue is not configured in this baseline ZIP.',
  }, { status: 503 });
}
