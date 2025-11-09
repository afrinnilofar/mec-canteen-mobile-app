import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, session } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const VALID_STATUSES = ['received', 'preparing', 'ready', 'collected', 'cancelled'];

async function authenticateRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    const sessionResult = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionResult.length === 0) {
      return null;
    }

    const userSession = sessionResult[0];

    // Check if session is expired
    if (new Date(userSession.expiresAt) < new Date()) {
      return null;
    }

    return userSession.userId;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Validate ID format
    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Query order by ID and userId
    const order = await db.select()
      .from(orders)
      .where(
        and(
          eq(orders.id, parseInt(id)),
          eq(orders.userId, userId)
        )
      )
      .limit(1);

    if (order.length === 0) {
      // Check if order exists but belongs to different user
      const orderExists = await db.select()
        .from(orders)
        .where(eq(orders.id, parseInt(id)))
        .limit(1);

      if (orderExists.length > 0) {
        return NextResponse.json(
          { error: 'Access forbidden', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: 'Order not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Parse items JSON field
    const orderData = order[0];
    const parsedOrder = {
      ...orderData,
      items: typeof orderData.items === 'string' 
        ? JSON.parse(orderData.items) 
        : orderData.items
    };

    return NextResponse.json(parsedOrder, { status: 200 });
  } catch (error) {
    console.error('GET order error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Validate ID format
    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validate status field
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required', code: 'MISSING_STATUS' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { 
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 
          code: 'INVALID_STATUS' 
        },
        { status: 400 }
      );
    }

    // Check if order exists and belongs to user
    const existingOrder = await db.select()
      .from(orders)
      .where(
        and(
          eq(orders.id, parseInt(id)),
          eq(orders.userId, userId)
        )
      )
      .limit(1);

    if (existingOrder.length === 0) {
      // Check if order exists but belongs to different user
      const orderExists = await db.select()
        .from(orders)
        .where(eq(orders.id, parseInt(id)))
        .limit(1);

      if (orderExists.length > 0) {
        return NextResponse.json(
          { error: 'Access forbidden', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: 'Order not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Update order status
    const updated = await db.update(orders)
      .set({
        status,
        updatedAt: new Date().toISOString()
      })
      .where(
        and(
          eq(orders.id, parseInt(id)),
          eq(orders.userId, userId)
        )
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update order', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    // Parse items JSON field
    const updatedOrder = {
      ...updated[0],
      items: typeof updated[0].items === 'string' 
        ? JSON.parse(updated[0].items) 
        : updated[0].items
    };

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('PATCH order error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}