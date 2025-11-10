#!/bin/bash

# 코드 품질 분석 실행 스크립트

echo "=== 코드 품질 메트릭 분석 시작 ==="

# 1. 의존성 설치 확인
echo "1. 의존성 확인 중..."
if [ ! -d "node_modules" ]; then
    echo "의존성을 설치합니다..."
    npm install
fi

# 2. TypeScript 컴파일 확인
echo "2. TypeScript 컴파일 중..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript 컴파일 오류가 있습니다."
    exit 1
fi

# 3. ESLint 실행
echo "3. ESLint 분석 중..."
npm run lint
echo "✅ ESLint 분석 완료"

# 4. 테스트 및 커버리지 실행
echo "4. 테스트 및 커버리지 분석 중..."
npm run test:coverage
if [ $? -ne 0 ]; then
    echo "❌ 일부 테스트가 실패했지만 분석을 계속합니다."
fi

# 5. 커버리지 결과 확인
echo "5. 커버리지 결과:"
if [ -f "coverage/lcov-report/index.html" ]; then
    echo "✅ 커버리지 리포트가 생성되었습니다: coverage/lcov-report/index.html"
else
    echo "❌ 커버리지 리포트 생성에 실패했습니다."
fi

# 6. SonarQube 분석 (선택사항)
echo "6. SonarQube 분석..."
if command -v sonar-scanner &> /dev/null; then
    echo "SonarQube 분석을 실행합니다..."
    npm run sonar
    if [ $? -eq 0 ]; then
        echo "✅ SonarQube 분석이 완료되었습니다."
    else
        echo "❌ SonarQube 분석에 실패했습니다. SonarQube 서버가 실행 중인지 확인해주세요."
    fi
else
    echo "⚠️  sonar-scanner가 설치되어 있지 않습니다."
    echo "   SonarQube 분석을 건너뜁니다."
fi

echo ""
echo "=== 분석 결과 요약 ==="
echo "📊 커버리지 리포트: coverage/lcov-report/index.html"
echo "📋 ESLint 결과: 터미널에서 확인"
echo "🔍 SonarQube 결과: SonarQube 대시보드에서 확인"
echo ""
echo "예상되는 품질 이슈들:"
echo "- 🔴 높은 복잡도 (Cyclomatic Complexity > 10)"
echo "- 🔴 중복 코드 (Duplications > 3%)"
echo "- 🔴 낮은 커버리지 (Coverage < 80%)"
echo "- 🟡 사용되지 않는 코드"
echo "- 🟡 ESLint 규칙 위반"
echo ""
echo "=== 분석 완료 ==="