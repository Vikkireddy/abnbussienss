import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../config/db';

async function handleGetBusinessData(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (searchTerm.trim()) {
      conditions.push(`(a.abn LIKE ? OR bn.name LIKE ?)`);
      const searchPattern = `%${searchTerm.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    if (state && state !== 'All States') {
      conditions.push(`ad.state = ?`);
      params.push(state);
    }

    if (status && status !== 'All Status') {
      let dbStatus = status;
      if (status === 'Active') dbStatus = 'ACT';
      else if (status === 'Cancelled') dbStatus = 'CAN';
      
      conditions.push(`a.status = ?`);
      params.push(dbStatus);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let countRows: any;
    if (params.length > 0) {
      [countRows] = await db.execute(
        `SELECT COUNT(DISTINCT a.abn) as total
        FROM abn a
        LEFT JOIN business_name bn ON a.abn = bn.abn
        LEFT JOIN address ad ON a.abn = ad.abn
        ${whereClause}`,
        params
      );
    } else {
      [countRows] = await db.execute(
        `SELECT COUNT(*) as total FROM abn a`
      );
    }
    const total = countRows[0]?.total || 0;

    const safeLimit = Math.max(1, Math.min(limit, 1000));
    const safeOffset = Math.max(0, offset);
    
    let rows: any;
    if (params.length > 0) {
      [rows] = await db.execute(
        `SELECT 
          a.abn,
          a.status,
          a.status_date,
          a.entity_type,
          COALESCE(GROUP_CONCAT(DISTINCT bn.name SEPARATOR ', '), '') as business_name,
          MAX(ad.state) as state,
          MAX(ad.postcode) as postcode
        FROM abn a
        LEFT JOIN business_name bn ON a.abn = bn.abn
        LEFT JOIN address ad ON a.abn = ad.abn
        ${whereClause}
        GROUP BY a.abn, a.status, a.status_date, a.entity_type
        ORDER BY a.abn
        LIMIT ${safeLimit} OFFSET ${safeOffset}`,
        params
      );
    } else {
      [rows] = await db.execute(
        `SELECT 
          a.abn,
          a.status,
          a.status_date,
          a.entity_type,
          (SELECT bn.name FROM business_name bn WHERE bn.abn = a.abn LIMIT 1) as business_name,
          (SELECT ad.state FROM address ad WHERE ad.abn = a.abn LIMIT 1) as state,
          (SELECT ad.postcode FROM address ad WHERE ad.abn = a.abn LIMIT 1) as postcode
        FROM abn a
        ORDER BY a.abn
        LIMIT ${safeLimit} OFFSET ${safeOffset}`
      );
    }

    const mappedRows = (rows as any[]).map((row: any) => ({
      ...row,
      status: row.status === 'ACT' ? 'Active' : row.status === 'CAN' ? 'Cancelled' : row.status || 'Unknown',
    }));

    return NextResponse.json({
      data: mappedRows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Failed to fetch business data',
        message: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleGetBusinessData(request);
}

