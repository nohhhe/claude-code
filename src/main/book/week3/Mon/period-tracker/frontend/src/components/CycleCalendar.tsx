'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Cycle, CycleStats } from '@/types';

interface CycleCalendarProps {
  cycles: Cycle[];
  stats: CycleStats | null;
  onDateClick?: (date: Date) => void;
}

export default function CycleCalendar({ cycles, stats, onDateClick }: CycleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const getDayStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    for (const cycle of cycles) {
      const startDate = parseISO(cycle.startDate);
      const endDate = cycle.endDate ? parseISO(cycle.endDate) : startDate;

      if (isWithinInterval(date, { start: startDate, end: endDate })) {
        return {
          type: 'period' as const,
          cycle,
          isStart: isSameDay(date, startDate),
          isEnd: isSameDay(date, endDate),
        };
      }
    }

    // Check for predicted period
    if (stats?.nextPredictedStartDate) {
      const predictedStart = parseISO(stats.nextPredictedStartDate);
      const predictedEnd = stats.averagePeriodLength
        ? addDays(predictedStart, Math.round(stats.averagePeriodLength) - 1)
        : predictedStart;

      if (isWithinInterval(date, { start: predictedStart, end: predictedEnd })) {
        return {
          type: 'predicted' as const,
          isStart: isSameDay(date, predictedStart),
          isEnd: isSameDay(date, predictedEnd),
        };
      }
    }

    return null;
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary-500" />
          <span className="text-gray-600">생리 기간</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary-200 border border-dashed border-primary-400" />
          <span className="text-gray-600">예정일</span>
        </div>
      </div>

      {/* Week Days */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500">
        {weekDays.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const status = getDayStatus(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={index}
              onClick={() => onDateClick?.(day)}
              className={`
                relative h-10 w-full rounded-md text-sm transition-colors
                ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                ${isToday ? 'font-bold' : ''}
                ${status?.type === 'period' ? 'bg-primary-500 text-white hover:bg-primary-600' : ''}
                ${status?.type === 'predicted' ? 'bg-primary-100 text-primary-800 border border-dashed border-primary-400' : ''}
                ${!status ? 'hover:bg-gray-100' : ''}
              `}
            >
              <span className="relative z-10">{format(day, 'd')}</span>
              {isToday && !status && (
                <span className="absolute inset-0 rounded-md ring-2 ring-primary-500 ring-offset-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
