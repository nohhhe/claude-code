'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCycleStore } from '@/store/cycleStore';
import { Calendar, LogOut, Plus, Edit2, Trash2, CalendarDays, BarChart3, List } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import CycleModal from '@/components/CycleModal';
import CycleCalendar from '@/components/CycleCalendar';
import CycleChart from '@/components/CycleChart';
import type { Cycle } from '@/types';

type ViewMode = 'list' | 'calendar' | 'chart';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cycles, stats, fetchCycles, fetchStats, deleteCycle, isLoading } = useCycleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<Cycle | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchCycles();
    fetchStats();
  }, [isAuthenticated, router, fetchCycles, fetchStats]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleCreateClick = () => {
    setModalMode('create');
    setSelectedCycle(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (cycle: Cycle) => {
    setModalMode('edit');
    setSelectedCycle(cycle);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (cycleId: number) => {
    if (window.confirm('정말 이 기록을 삭제하시겠습니까?')) {
      try {
        await deleteCycle(cycleId);
        await fetchStats();
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCycle(undefined);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Period Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.name}님</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">총 기록</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats?.totalCycles || 0}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">평균 주기</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats?.averageCycleLength?.toFixed(1) || '-'}
              <span className="ml-1 text-lg text-gray-500">일</span>
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">평균 기간</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats?.averagePeriodLength?.toFixed(1) || '-'}
              <span className="ml-1 text-lg text-gray-500">일</span>
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">다음 예정일</h3>
            <p className="mt-2 text-xl font-bold text-primary-600">
              {stats?.nextPredictedStartDate
                ? format(new Date(stats.nextPredictedStartDate), 'M월 d일', {
                    locale: ko,
                  })
                : '-'}
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex rounded-lg bg-white p-1 shadow">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
              목록
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              달력
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'chart'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              분석
            </button>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
          >
            <Plus className="h-4 w-4" />
            새 기록
          </button>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'list' && (
          <div className="rounded-lg bg-white shadow">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">최근 기록</h2>
            </div>

            <div className="divide-y">
              {isLoading ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  로딩 중...
                </div>
              ) : cycles.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  아직 기록이 없습니다. 첫 번째 기록을 추가해보세요!
                </div>
              ) : (
                cycles.slice(0, 10).map((cycle) => (
                  <div key={cycle.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {format(new Date(cycle.startDate), 'yyyy년 M월 d일', {
                            locale: ko,
                          })}
                          {cycle.endDate &&
                            ` - ${format(new Date(cycle.endDate), 'M월 d일', {
                              locale: ko,
                            })}`}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {cycle.periodLength && `${cycle.periodLength}일 진행`}
                          {cycle.cycleLength &&
                            ` · 주기 ${cycle.cycleLength}일`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {cycle.flowIntensity && (
                          <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800">
                            {cycle.flowIntensity}
                          </span>
                        )}
                        <button
                          onClick={() => handleEditClick(cycle)}
                          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title="수정"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(cycle.id)}
                          className="rounded-md p-2 text-gray-400 hover:bg-red-100 hover:text-red-600"
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {cycle.symptoms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {cycle.symptoms.map((symptom, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {viewMode === 'calendar' && (
          <CycleCalendar
            cycles={cycles}
            stats={stats}
            onDateClick={(date) => {
              setModalMode('create');
              setSelectedCycle(undefined);
              setIsModalOpen(true);
            }}
          />
        )}

        {viewMode === 'chart' && (
          <CycleChart cycles={cycles} stats={stats} />
        )}
      </main>

      <CycleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        cycle={selectedCycle}
        mode={modalMode}
      />
    </div>
  );
}
