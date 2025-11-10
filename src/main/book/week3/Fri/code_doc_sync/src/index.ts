/**
 * @fileoverview 메인 엔트리 포인트
 */

export * from './api';
export { runAllExamples } from './example';

// 개발 모드에서 예제 실행
if (require.main === module) {
  console.log('API Documentation Example');
  console.log('Run examples with: npm run dev');
}