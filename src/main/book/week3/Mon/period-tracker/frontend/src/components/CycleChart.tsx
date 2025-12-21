'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Cycle, CycleStats } from '@/types';

interface CycleChartProps {
  cycles: Cycle[];
  stats: CycleStats | null;
}

export default function CycleChart({ cycles, stats }: CycleChartProps) {
  // Prepare data for cycle length chart (reverse for chronological order)
  const cycleLengthData = [...cycles]
    .reverse()
    .filter((cycle) => cycle.cycleLength)
    .map((cycle) => ({
      date: format(parseISO(cycle.startDate), 'M/d', { locale: ko }),
      cycleLength: cycle.cycleLength,
      periodLength: cycle.periodLength,
    }));

  // Prepare data for symptom chart
  const symptomData = stats?.commonSymptoms
    ? Object.entries(stats.commonSymptoms)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }))
    : [];

  if (cycles.length < 2) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">주기 분석</h2>
        <div className="flex h-48 items-center justify-center text-gray-500">
          차트를 표시하려면 최소 2개 이상의 주기 기록이 필요합니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cycle Length Chart */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">주기 길이 추세</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cycleLengthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                label={{
                  value: '일',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  `${value}일`,
                  name === 'cycleLength' ? '주기 길이' : '생리 기간',
                ]}
              />
              {stats?.averageCycleLength && (
                <ReferenceLine
                  y={stats.averageCycleLength}
                  stroke="#9333ea"
                  strokeDasharray="5 5"
                  label={{
                    value: `평균 ${stats.averageCycleLength.toFixed(1)}일`,
                    position: 'right',
                    fontSize: 11,
                    fill: '#9333ea',
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="cycleLength"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="cycleLength"
              />
              <Line
                type="monotone"
                dataKey="periodLength"
                stroke="#f472b6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f472b6', strokeWidth: 2, r: 3 }}
                name="periodLength"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 bg-pink-500" />
            <span className="text-gray-600">주기 길이</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 border-t-2 border-dashed border-pink-400" />
            <span className="text-gray-600">생리 기간</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 border-t-2 border-dashed border-purple-500" />
            <span className="text-gray-600">평균 주기</span>
          </div>
        </div>
      </div>

      {/* Symptom Chart */}
      {symptomData.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">자주 나타나는 증상</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}회`, '발생 횟수']}
                />
                <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
