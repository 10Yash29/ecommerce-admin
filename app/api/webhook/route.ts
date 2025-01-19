import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        console.error('WEBHOOK_SIGNATURE_ERROR', err);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;
        const userId = session.metadata?.userId;

        if (!orderId || !userId) {
            console.error('Missing orderId or userId in metadata');
            return new NextResponse('Missing metadata', { status: 400 });
        }

        const order = await prismadb.order.update({
            where: { id: orderId },
            data: { isPaid: true },
            include: { orderItems: true },
        });

        await Promise.all(
            order.orderItems.map((item) =>
                prismadb.userProductInteraction.create({
                    data: {
                        userId,
                        productId: item.productId,
                        interactionType: 'purchase',
                    },
                })
            )
        );
    }

    return new NextResponse(null, { status: 200 });
}
