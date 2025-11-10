#!/bin/bash

echo "🚀 SmallBiz Manager 개발환경 시작"
echo "=================================="

# 환경 변수 파일 복사
if [ ! -f backend/.env ]; then
    echo "📄 백엔드 환경변수 파일 생성 중..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "📄 프론트엔드 환경변수 파일 생성 중..."
    cp frontend/.env.example frontend/.env
fi

# Docker 컨테이너 시작
echo "🐳 Docker 컨테이너 시작 중..."
docker-compose up -d postgres redis

# 잠시 대기 (데이터베이스 준비 시간)
echo "⏳ 데이터베이스 준비 대기 중..."
sleep 5

# Prisma 설정
echo "🔧 Prisma 클라이언트 생성 중..."
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed

echo ""
echo "✅ 개발환경 준비 완료!"
echo ""
echo "🔴 백엔드 서버 실행: cd backend && npm run dev"
echo "🔵 프론트엔드 서버 실행: cd frontend && npm run dev"
echo ""
echo "📱 접속 주소:"
echo "   - 프론트엔드: http://localhost:3000"
echo "   - 백엔드 API: http://localhost:5000"
echo "   - Prisma Studio: cd backend && npm run db:studio"
echo ""
echo "🔑 테스트 로그인 정보:"
echo "   - 이메일: admin@test.com"
echo "   - 비밀번호: password123"
echo ""