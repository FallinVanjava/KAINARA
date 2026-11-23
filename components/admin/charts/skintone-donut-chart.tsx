'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Palette } from 'lucide-react';
import type { SkintoneDistItem } from '@/lib/queries/admin-stats';

interface SkintoneDonutChartProps {
  data: SkintoneDistItem[];
}

export function SkintoneDonutChart({ data }: SkintoneDonutChartProps) {
  const totalProfilesWithSkintone = data.reduce(
    (acc, curr) => acc + Number(curr.total),
    0
  );

  return (
    <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 sm:p-6 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] space-y-4">
      <div>
        <h3 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
          Distribusi Skintone Pengguna
        </h3>
        <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] mt-0.5">
          Proporsi warna kulit pengguna berdasarkan hasil deteksi terakhir.
        </p>
      </div>

      {totalProfilesWithSkintone > 0 ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Donut Chart */}
          <div className="h-60 w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="nama"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.skintone_id}
                      fill={entry.hex_color}
                      stroke="#E8D8C8"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF8F0',
                    borderColor: '#E8D8C8',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val, name) => [`${val} pengguna`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legenda Custom */}
          <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2 text-xs">
            {data.map((item) => (
              <div key={item.skintone_id} className="flex items-center gap-2">
                <span
                  className="size-3.5 rounded-full border border-black/15 shadow-2xs shrink-0"
                  style={{ backgroundColor: item.hex_color }}
                />
                <span className="truncate text-[#5E0F11] dark:text-[#F6E9DC]">
                  {item.nama}{' '}
                  <strong className="text-[#7A3A3A] dark:text-[#D9C3B5]">
                    ({item.total})
                  </strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dotted border-[#E8D8C8] p-8 text-center text-xs text-[#7A3A3A] dark:bg-[#3A1D1E]/20 dark:border-[rgba(246,233,220,0.12)] dark:text-[#D9C3B5]">
          <Palette className="size-6 text-[#96640F] mb-2 opacity-40 dark:text-[#E8C36A]" />
          <p className="font-semibold text-sm text-[#5E0F11] dark:text-[#F6E9DC]">
            Belum ada sebaran skintone pengguna
          </p>
          <p className="mt-1 max-w-xs">
            Diagram donat warna kulit akan terbentuk ketika pengguna menyimpan hasil deteksi skintone ke profil mereka.
          </p>
        </div>
      )}
    </div>
  );
}
