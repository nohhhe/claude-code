// BEFORE: Tree Shaking이 작동하지 않는 코드
// ❌ 전체 라이브러리 임포트
import * as lodash from 'lodash';
import * as moment from 'moment';

// ❌ CommonJS 스타일 임포트 (Tree shaking 불가)
const utils = require('./utils');

// ❌ 사이드 이펙트가 있는 임포트
import './styles.css';
import 'some-polyfill'; 

class BeforeOptimization {
  processData(data) {
    // lodash 전체가 번들에 포함됨 (몇 개 함수만 사용해도)
    return lodash.map(data, lodash.capitalize);
  }
  
  formatDate(date) {
    // moment.js 전체가 번들에 포함됨
    return moment(date).format('YYYY-MM-DD');
  }
}

// AFTER: Tree Shaking 최적화된 코드
// ✅ 필요한 함수만 명시적으로 임포트
import { map, capitalize, debounce, throttle } from 'lodash-es';
import { format, parseISO } from 'date-fns';

// ✅ 유틸리티 함수들을 개별적으로 임포트
import { validateEmail } from './utils/validation';
import { formatCurrency } from './utils/formatting';
import { apiCall } from './utils/api';

// ✅ CSS Modules 또는 명시적 사이드 이펙트 관리
import styles from './Component.module.css';

class AfterOptimization {
  processData(data) {
    // 필요한 함수만 번들에 포함
    return map(data, capitalize);
  }
  
  formatDate(date) {
    // date-fns는 tree shaking 지원, moment보다 작음
    return format(parseISO(date), 'yyyy-MM-dd');
  }
  
  // 디바운스된 API 호출
  debouncedApiCall = debounce(apiCall, 300);
  
  // 스로틀된 이벤트 핸들러
  throttledHandler = throttle(this.handleEvent, 100);
}

// package.json 설정 예시 (Tree Shaking 활성화)
const packageJsonExample = {
  "name": "bundle-optimization-example",
  "sideEffects": false, // 모든 파일에 사이드 이펙트가 없음을 명시
  // 또는 특정 파일들만 사이드 이펙트가 있다고 명시
  // "sideEffects": ["*.css", "*.scss", "./src/polyfills.js"],
  "type": "module", // ES modules 사용
};

// ✅ Tree Shaking 친화적인 유틸리티 라이브러리 작성
export const stringUtils = {
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  lowercase: (str) => str.toLowerCase(),
  trim: (str) => str.trim(),
  truncate: (str, length) => str.length > length ? str.slice(0, length) + '...' : str,
};

export const arrayUtils = {
  unique: (arr) => [...new Set(arr)],
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },
  flatten: (arr) => arr.flat(),
};

export const objectUtils = {
  pick: (obj, keys) => {
    const result = {};
    keys.forEach(key => {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  },
  omit: (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },
};

// ✅ 조건부 Tree Shaking (환경별 코드 제거)
export const createLogger = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      log: (...args) => console.log(...args),
      error: (...args) => console.error(...args),
      warn: (...args) => console.warn(...args),
    };
  }
  
  // 프로덕션에서는 빈 객체 반환 (로깅 코드 제거됨)
  return {
    log: () => {},
    error: () => {},
    warn: () => {},
  };
};

// ✅ 사이드 이펙트 최소화
export class PureComponent {
  constructor(props) {
    this.props = props;
  }
  
  // 순수 함수들
  render() {
    return this.processProps(this.props);
  }
  
  processProps(props) {
    // 사이드 이펙트 없는 처리
    return props;
  }
}

// ❌ 사이드 이펙트가 있는 코드 (Tree shaking 방해)
// window.myGlobalVariable = 'something';
// document.addEventListener('click', handler);

// ✅ 사이드 이펙트를 명시적으로 관리
export const initializeApp = () => {
  // 필요할 때만 사이드 이펙트 실행
  if (typeof window !== 'undefined') {
    window.myGlobalVariable = 'something';
    document.addEventListener('click', handler);
  }
};

// Tree Shaking 결과 분석
const optimizationResults = {
  before: {
    lodash: '70KB (전체 라이브러리)',
    moment: '68KB (전체 라이브러리)', 
    utils: '20KB (모든 유틸리티)',
    totalReduction: '0KB'
  },
  after: {
    lodashEs: '5KB (사용된 함수만)',
    dateFns: '12KB (사용된 함수만)',
    utils: '3KB (필요한 함수만)',
    totalReduction: '138KB (87% 감소)'
  }
};

export default AfterOptimization;