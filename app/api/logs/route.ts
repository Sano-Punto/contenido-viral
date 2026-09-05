import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ logs: [] });
    }

    const { data: logs, error } = await supabaseServer
      .from('viral_generation_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching logs from Supabase:', error);
      return NextResponse.json({ logs: [], error: error.message });
    }

    return NextResponse.json({ logs: logs || [] });
  } catch (error: any) {
    return NextResponse.json({ logs: [], error: error.message }, { status: 500 });
  }
}
