'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format, parse } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { FlowIntensity, type Cycle, type CreateCycleRequest, type UpdateCycleRequest } from '@/types';
import { useCycleStore } from '@/store/cycleStore';

const cycleSchema = z.object({
  startDate: z.string().min(1, '시작일을 선택해주세요'),
  endDate: z.string().optional(),
  flowIntensity: z.nativeEnum(FlowIntensity).optional(),
  symptoms: z.array(z.string()),
  notes: z.string().optional(),
});

type CycleFormData = z.infer<typeof cycleSchema>;

const SYMPTOMS = [
  '복통',
  '두통',
  '피로',
  '기분 변화',
  '가슴 통증',
  '요통',
  '메스꺼움',
  '여드름',
];

const FLOW_INTENSITY_LABELS: Record<FlowIntensity, string> = {
  [FlowIntensity.LIGHT]: '가벼움',
  [FlowIntensity.MEDIUM]: '보통',
  [FlowIntensity.HEAVY]: '많음',
  [FlowIntensity.SPOTTING]: '극소량',
};

interface CycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycle?: Cycle;
  mode: 'create' | 'edit';
}

export default function CycleModal({ isOpen, onClose, cycle, mode }: CycleModalProps) {
  const { createCycle, updateCycle, fetchCycles, fetchStats } = useCycleStore();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [startDateObj, setStartDateObj] = useState<Date | null>(null);
  const [endDateObj, setEndDateObj] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CycleFormData>({
    resolver: zodResolver(cycleSchema),
    defaultValues: {
      symptoms: [],
    },
  });

  useEffect(() => {
    if (cycle && mode === 'edit') {
      reset({
        startDate: cycle.startDate,
        endDate: cycle.endDate || '',
        flowIntensity: cycle.flowIntensity,
        symptoms: cycle.symptoms,
        notes: cycle.notes || '',
      });
      setSelectedSymptoms(cycle.symptoms);
      setStartDateObj(parse(cycle.startDate, 'yyyy-MM-dd', new Date()));
      setEndDateObj(cycle.endDate ? parse(cycle.endDate, 'yyyy-MM-dd', new Date()) : null);
    } else {
      reset({
        startDate: '',
        endDate: '',
        flowIntensity: undefined,
        symptoms: [],
        notes: '',
      });
      setSelectedSymptoms([]);
      setStartDateObj(null);
      setEndDateObj(null);
    }
  }, [cycle, mode, reset]);

  const toggleSymptom = (symptom: string) => {
    const newSymptoms = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter((s) => s !== symptom)
      : [...selectedSymptoms, symptom];
    setSelectedSymptoms(newSymptoms);
    setValue('symptoms', newSymptoms);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDateObj(date);
    if (date) {
      setValue('startDate', format(date, 'yyyy-MM-dd'));
      // 종료일이 없거나 시작일보다 이전이면 시작일로 설정
      if (!endDateObj || endDateObj < date) {
        setEndDateObj(date);
        setValue('endDate', format(date, 'yyyy-MM-dd'));
      }
    } else {
      setValue('startDate', '');
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDateObj(date);
    if (date) {
      setValue('endDate', format(date, 'yyyy-MM-dd'));
    } else {
      setValue('endDate', '');
    }
  };

  const onSubmit = async (data: CycleFormData) => {
    try {
      const payload = {
        ...data,
        symptoms: selectedSymptoms,
        endDate: data.endDate || undefined,
        flowIntensity: data.flowIntensity || undefined,
      };

      if (mode === 'create') {
        await createCycle(payload as CreateCycleRequest);
      } else if (cycle) {
        await updateCycle(cycle.id, payload as UpdateCycleRequest);
      }

      await fetchCycles();
      await fetchStats();
      onClose();
      reset();
      setSelectedSymptoms([]);
      setStartDateObj(null);
      setEndDateObj(null);
    } catch (error) {
      console.error('주기 저장 실패:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === 'create' ? '새 주기 기록' : '주기 수정'}
              </h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  시작일 <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={startDateObj}
                  onChange={handleStartDateChange}
                  dateFormat="yyyy-MM-dd"
                  locale={ko}
                  placeholderText="시작일을 선택하세요"
                  className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  종료일 (선택)
                </label>
                <DatePicker
                  selected={endDateObj}
                  onChange={handleEndDateChange}
                  dateFormat="yyyy-MM-dd"
                  locale={ko}
                  placeholderText="종료일을 선택하세요"
                  className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                  minDate={startDateObj || undefined}
                  openToDate={startDateObj || undefined}
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                {startDateObj && (
                  <p className="mt-1 text-xs text-gray-500">
                    시작일({format(startDateObj, 'yyyy-MM-dd')}) 이후 날짜만 선택 가능
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생리량 강도
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(FLOW_INTENSITY_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center">
                      <input
                        {...register('flowIntensity')}
                        type="radio"
                        value={key}
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  증상
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  메모
                </label>
                <textarea
                  {...register('notes')}
                  id="notes"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                  placeholder="추가 메모를 입력하세요..."
                />
              </div>

              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting ? '저장 중...' : mode === 'create' ? '저장' : '수정'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
