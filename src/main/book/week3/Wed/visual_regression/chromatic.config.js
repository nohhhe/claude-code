module.exports = {
  // Chromatic 프로젝트 토큰
  projectToken: process.env.CHROMATIC_PROJECT_TOKEN,

  // 빌드 디렉토리
  buildScriptName: 'build-storybook',
  storybookBuildDir: 'storybook-static',

  // 자동 승인 설정
  autoAcceptChanges: false,
  
  // 브랜치별 설정
  skip: [
    'dependabot/**',
    'renovate/**'
  ].join(' '),

  // 무시할 파일 패턴
  ignoreLastBuildOnBranch: 'main',
  
  // 뷰포트 설정
  viewports: [
    {
      name: 'Desktop',
      width: 1280,
      height: 720
    },
    {
      name: 'Tablet',
      width: 768,
      height: 1024
    },
    {
      name: 'Mobile',
      width: 390,
      height: 844
    }
  ],

  // 성능 최적화
  uploadFiles: false,
  
  // 디버그 모드 (개발 시에만 사용)
  debug: process.env.NODE_ENV === 'development',
  
  // 진단 모드
  diagnostics: false,
  
  // 종료 설정
  exitZeroOnChanges: true,
  exitOnceUploaded: true,

  // 병렬 처리
  parallel: true
};