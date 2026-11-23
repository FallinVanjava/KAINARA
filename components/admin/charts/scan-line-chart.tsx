'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Download, Sparkles } from 'lucide-react';
import type { ScanPerDayItem } from '@/lib/queries/admin-stats';

interface ScanLineChartProps {
  data: ScanPerDayItem[];
}

function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

export function ScanLineChart({ data }: ScanLineChartProps) {
  const totalScans = data.reduce(
    (acc, curr) => acc + Number(curr.scan_motif) + Number(curr.scan_skintone),
    0
  );

  const formattedData = data.map((item) => ({
    ...item,
    tanggalLabel: formatDateLabel(item.tanggal),
  }));

  const handleExportCSV = () => {
    if (data.length === 0) return;

    const headers = ['Tanggal', 'Scan Motif', 'Scan Skintone', 'Total'];
    const rows = data.map((d) => [
      d.tanggal,
      d.scan_motif,
      d.scan_skintone,
      Number(d.scan_motif) + Number(d.scan_skintone),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kainara-scan-per-hari.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-[#E8D8C8] bg-white p-5 sm:p-6 shadow-xs dark:bg-[#2A1415] dark:border-[rgba(246,233,220,0.16)] space-y-4">
      {/* Header Grafik & Tombol Ekspor CSV */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-base font-bold text-[#5E0F11] dark:text-[#F6E9DC]">
            Aktivitas Pemindaian Harian
          </h3>
          <p className="text-xs text-[#7A3A3A] dark:text-[#D9C3B5] mt-0.5">
            Tren harian deteksi motif tapis vs deteksi warna kulit (skintone).
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={data.length === 0}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#E8D8C8] bg-white px-3.5 text-xs font-semibold text-[#5E0F11] hover:bg-[#F5E9DC] transition-colors disabled:opacity-40 shrink-0 dark:bg-[#3A1D1E] dark:border-[rgba(246,233,220,0.16)] dark:text-[#F6E9DC]"
        >
          <Download className="size-3.5" />
          <span>Ekspor CSV</span>
        </button>
      </div>

      {/* Tampilan Grafik atau Keadaan Kosong */}
      {totalScans > 0 ? (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E8D8C8"
                className="opacity-50 dark:stroke-[rgba(246,233,220,0.1)]"
              />
              <XAxis
                dataKey="tanggalLabel"
                stroke="#7A3A3A"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E8D8C8' }}
              />
              <YAxis
                stroke="#7A3A3A"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E8D8C8' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF8F0',
                  borderColor: '#E8D8C8',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#5E0F11' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(value) => (
                  <span className="text-[#5E0F11] dark:text-[#F6E9DC] font-medium">
                    {value === 'scan_motif' ? 'Scan Motif' : 'Scan Skintone'}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="scan_motif"
                name="scan_motif"
                stroke="#7A1212"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#7A1212' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="scan_skintone"
                name="scan_skintone"
                stroke="#96640F"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#96640F' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dotted border-[#E8D8C8] p-8 text-center text-xs text-[#7A3A3A] dark:bg-[#3A1D1E]/20 dark:border-[rgba(246,233,220,0.12)] dark:text-[#D9C3B5]">
          <Sparkles className="size-6 text-[#96640F] mb-2 opacity-50 dark:text-[#E8C36A]" />
          <p className="font-semibold text-sm text-[#5E0F11] dark:text-[#F6E9DC]">
            Belum ada aktivitas scan pada rentang ini
          </p>
          <p className="mt-1 max-w-sm">
            Setelah pengguna melakukan scan motif atau skintone lewat aplikasi mobile, grafik garis aktivitas harian akan terisi secara otomatis.
          </p>
        </div>
      )}
    </div>
  );
}
