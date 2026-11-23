'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Layers } from 'lucide-react';
import type { TopMotifItem } from '@/lib/queries/admin-stats';

interface TopMotifsChartProps {
  data: TopMotifItem[];
}

export function TopMotifsChart({ data }: TopMotifsChartProps) {
  const hasData = data && data.length > 0;

  return (
    <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 sm:p-6 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] space-y-4">
      <div>
        <h3 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Motif Tapis Paling Populer
        </h3>
        <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] mt-0.5">
          10 motif tapis yang paling sering dipindai oleh pengguna.
        </p>
      </div>

      {hasData ? (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis
                type="number"
                stroke="#7A3A3A"
                fontSize={11}
                allowDecimals={false}
                axisLine={{ stroke: '#E8D8C8' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="nama"
                stroke="#5E0F11"
                fontSize={11}
                width={100}
                tickLine={false}
                axisLine={{ stroke: '#E8D8C8' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF8F0',
                  borderColor: '#E8D8C8',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(val) => [`${val} kali di-scan`, 'Total']}
              />
              <Bar
                dataKey="total"
                name="Total Scan"
                fill="#7A1212"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dotted border-[#E8D8C8] p-8 text-center text-xs text-[#7A3A3A] dark:bg-[#3A1D1E]/20 dark:border-[rgba(246,233,220,0.12)] dark:text-[#D9C3B5]">
          <Layers className="size-6 text-[#7A1212] mb-2 opacity-40 dark:text-[#E8C36A]" />
          <p className="font-semibold text-sm text-[#5E0F11] dark:text-[#F6E9DC]">
            Belum ada data scan motif pada rentang ini
          </p>
          <p className="mt-1 max-w-xs">
            Setelah motif kain tapis di-scan oleh pengguna, daftar peringkat popularitas motif akan otomatis muncul.
          </p>
        </div>
      )}
    </div>
  );
}
