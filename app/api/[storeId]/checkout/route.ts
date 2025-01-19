import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';

const allowedOrigins = [
    'https://ecommerce-store-lqt4-g7t31x5xv-yash-kumars-projects-e8a8ecbb.vercel.app',
    'https://ecommerce-store-lqt4-dgr2j4b5e-yash-kumars-projects-e8a8ecbb.vercel.app',
];

export async function OPTIONS(req: Request) {
    const origin = req.headers.get('origin');
    const isAllowedOrigin = allowedOrigins.includes(origin || '');

    const headers = {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    return NextResponse.json({}, { headers });
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const origin = req.headers.get('origin');
        const isAllowedOrigin = allowedOrigins.includes(origin || '');

        const { productIds, userId } = await req.json();

        if (!productIds?.length || !userId) {
            return NextResponse.json(
                { message: "Missing 'productIds' or 'userId'" },
                {
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                }
            );
        }

        const products = await prismadb.product.findMany({
            where: { id: { in: productIds } },
        });

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map(
            (product) => ({
                quantity: 1,
                price_data: {
                    currency: 'USD',
                    product_data: { name: product.name },
                    unit_amount: product.price.toNumber() * 100,
                },
            })
        );

        const order = await prismadb.order.create({
            data: {
                storeId: params.storeId,
                userId, // Add userId here
                isPaid: false,
                orderItems: {
                    create: productIds.map((productId: string) => ({
                        product: { connect: { id: productId } },
                    })),
                },
            },
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            billing_address_collection: 'required',
            phone_number_collection: { enabled: true },
            success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
            cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
            metadata: {
                orderId: order.id, // Pass orderId
                userId, // Pass userId
            },
        });

        return NextResponse.json(
            { url: session.url },
            {
                headers: {
                    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    } catch (error) {
        console.error('CHECKOUT_POST_ERROR', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }
}
