import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, session } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return null;
    }

    const userSession = sessionRecord[0];
    
    // Check if session is expired
    if (userSession.expiresAt < new Date()) {
      return null;
    }

    return { userId: userSession.userId };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, subtotal, tax, discount, total, paymentMethod, promoCode } = body;

    // Validate required fields
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be a valid array', code: 'INVALID_ITEMS' },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Items array cannot be empty', code: 'EMPTY_ITEMS' },
        { status: 400 }
      );
    }

    if (typeof subtotal !== 'number') {
      return NextResponse.json(
        { error: 'Subtotal must be a number', code: 'INVALID_SUBTOTAL' },
        { status: 400 }
      );
    }

    if (typeof tax !== 'number') {
      return NextResponse.json(
        { error: 'Tax must be a number', code: 'INVALID_TAX' },
        { status: 400 }
      );
    }

    if (typeof discount !== 'number') {
      return NextResponse.json(
        { error: 'Discount must be a number', code: 'INVALID_DISCOUNT' },
        { status: 400 }
      );
    }

    if (typeof total !== 'number') {
      return NextResponse.json(
        { error: 'Total must be a number', code: 'INVALID_TOTAL' },
        { status: 400 }
      );
    }

    if (!paymentMethod || typeof paymentMethod !== 'string') {
      return NextResponse.json(
        { error: 'Payment method is required', code: 'MISSING_PAYMENT_METHOD' },
        { status: 400 }
      );
    }

    // Validate items structure
    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Each item must have id, name, price, and quantity', code: 'INVALID_ITEM_STRUCTURE' },
          { status: 400 }
        );
      }
    }

    // Generate unique order number
    const orderNumber = `ORD${Date.now()}`;

    const now = new Date().toISOString();

    // Create order
    const newOrder = await db.insert(orders)
      .values({
        userId: user.userId,
        orderNumber,
        items: JSON.stringify(items),
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        promoCode: promoCode || null,
        status: 'received',
        createdAt: now,
        updatedAt: now
      })
      .returning();

    if (newOrder.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create order', code: 'CREATE_FAILED' },
        { status: 500 }
      );
    }

    // Parse items JSON for response
    const orderResponse = {
      ...newOrder[0],
      items: JSON.parse(newOrder[0].items)
    };

    return NextResponse.json(orderResponse, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid limit parameter', code: 'INVALID_LIMIT' },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid offset parameter', code: 'INVALID_OFFSET' },
        { status: 400 }
      );
    }

    // Query orders for authenticated user
    const userOrders = await db.select()
      .from(orders)
      .where(eq(orders.userId, user.userId))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    // Parse items JSON for each order
    const ordersWithParsedItems = userOrders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    return NextResponse.json(ordersWithParsedItems, { status: 200 });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}