# Unoptimized Webpack Demo Project

이 프로젝트는 의도적으로 최적화되지 않은 webpack 설정을 가진 데모 프로젝트입니다. 다양한 최적화 기회를 학습하기 위해 만들어졌습니다.

## 최적화 문제점들

### 1. Bundle Size Issues (번들 크기 문제)
- **현재 번들 크기**: 2.89 MiB (개발 모드)
- 전체 라이브러리 임포트 (`import * as _`, `import moment` 전체)
- 사용하지 않는 코드 포함 (unused-module.js)
- 트리 셰이킹 미적용

### 2. Webpack Configuration Problems
```javascript
// webpack.config.js 문제점들:
- 파일명에 해시 없음 (캐싱 비효율)
- 코드 스플리팅 없음
- CSS 추출 없음 (style-loader만 사용)
- 소스맵 없음
- 성능 예산 설정 없음
- 최적화 설정 없음
```

### 3. Code Quality Issues
- 사용하지 않는 함수들
- 전체 라이브러리 임포트
- jQuery 사용 (vanilla JS로 대체 가능)
- moment.js 사용 (date-fns나 day.js로 대체 가능)
- 중복 CSS 스타일

### 4. Performance Issues
- Hot Module Replacement 미적용
- 이미지 최적화 없음
- CSS 압축 없음
- JS 압축 설정 없음

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 빌드
npm run build

# 프로덕션 빌드
npm run build:prod

# 개발 서버 실행
npm run dev
```

## 최적화 개선 방안

### 1. Bundle Size 최적화
```javascript
// 개선 전
import * as _ from 'lodash';
import moment from 'moment';

// 개선 후
import { map } from 'lodash-es';
import dayjs from 'dayjs';
```

### 2. Webpack 최적화 설정
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    usedExports: true,
    sideEffects: false,
  },
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

### 3. CSS 최적화
- MiniCssExtractPlugin 사용
- CSS 압축 적용
- 사용하지 않는 CSS 제거

### 4. 이미지 최적화
```javascript
{
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'images/[name].[hash][ext]'
  }
}
```

## 현재 상태
- ✅ 프로젝트 구조 생성
- ✅ 의도적으로 비최적화된 설정
- ✅ 대용량 의존성 포함
- ✅ 빌드 테스트 완료
- ❌ 최적화 미적용 (학습 목적)

이 프로젝트를 통해 webpack 최적화 기법들을 단계별로 적용해보며 번들 크기 및 성능 개선을 학습할 수 있습니다.