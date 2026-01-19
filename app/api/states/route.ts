import { NextResponse } from 'next/server';
import { db } from '../../config/db';
import { StateRow, StatesResponse } from '../../types/abn.types';

async function handleGetStates(): Promise<NextResponse<StatesResponse | { message?: string }>> {
  try {
    const [rows] = await db.execute(
      `SELECT DISTINCT state 
      FROM address 
      WHERE state IS NOT NULL AND state != ''
      ORDER BY state ASC`
    ) as [StateRow[], unknown];

    const states = rows.map((row: StateRow) => row.state).filter((state): state is string => Boolean(state));

    const response: StatesResponse = {
      states,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        message: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse<StatesResponse | { message?: string }>> {
  return handleGetStates();
}

