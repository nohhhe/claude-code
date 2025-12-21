'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

const registerSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  birthDate: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [error, setError] = useState<string>('');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      await register(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Period Tracker에 오신 것을 환영합니다
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                {...registerField('name')}
                id="name"
                type="text"
                className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="홍길동"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                {...registerField('email')}
                id="email"
                type="email"
                autoComplete="email"
                className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                {...registerField('password')}
                id="password"
                type="password"
                autoComplete="new-password"
                className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="8자 이상"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                생년월일 (선택)
              </label>
              <input
                {...registerField('birthDate')}
                id="birthDate"
                type="date"
                className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
            >
              {isSubmitting ? '가입 중...' : '회원가입'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
