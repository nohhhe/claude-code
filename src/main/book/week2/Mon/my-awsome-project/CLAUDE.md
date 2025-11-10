# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

"my-awsome-project"는 현재 초기 설정 단계에 있는 최소한의 Node.js 프로젝트입니다. 기본적인 package.json 구성만 포함되어 있으며, 특정 프레임워크나 아키텍처는 아직 정의되지 않았습니다.

## 현재 상태

- **프로젝트 타입**: Node.js (최소 설정)
- **패키지 매니저**: npm (package.json에서 추론)
- **현재 스크립트**: 오류로 종료되는 플레이스홀더 테스트 스크립트만 존재
- **의존성**: 현재 설치된 패키지 없음

## 개발 명령어

```bash
# 의존성 설치 (패키지 추가 시)
npm install

# 테스트 실행 (현재 구현되지 않음)
npm test

# 필요에 따라 패키지 설치
npm install <패키지명>
npm install --save-dev <개발용-패키지명>
```

## 프로젝트 구조

현재 최소한의 구조:
```
.
├── package.json          # 기본 npm 설정
├── .git/                 # Git 저장소 (초기화됨, 커밋 없음)
└── CLAUDE.md            # 이 파일
```

## 설정 권장사항

최소한의 프로젝트 설정이므로 다음 사항들을 고려해보세요:

1. **프레임워크/런타임**: 특정 Node.js 프레임워크 결정 (Express, Next.js 등)
2. **TypeScript**: 더 나은 개발 경험을 위한 TypeScript 추가 고려
3. **테스팅**: 적절한 테스팅 프레임워크 설정 (Jest, Mocha 등)
4. **린팅**: 코드 품질을 위한 ESLint 및/또는 Prettier 추가
5. **빌드 프로세스**: 필요시 빌드 스크립트 구성
6. **디렉토리 구조**: src/, test/ 및 기타 표준 디렉토리 생성

## Git 워크플로우

- 저장소는 초기화되었지만 아직 커밋이 없음
- Node.js 프로젝트용 .gitignore 파일 추가 고려
- 현재 메인 브랜치는 "master"

## 개발 다음 단계

프로젝트 확장 시 이 CLAUDE.md 파일을 다음 내용으로 업데이트하세요:
- 특정 프레임워크 문서와 명령어
- 아키텍처 패턴 및 코딩 표준
- 빌드 및 배포 지침
- 테스팅 전략 및 명령어