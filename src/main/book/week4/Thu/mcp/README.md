# Simple File Server MCP

Claude Code 통합을 위한 기본 파일 작업을 제공하는 간단한 Model Context Protocol (MCP) 서버입니다.

## 기능

- **파일 읽기**: 모든 파일의 내용 읽기
- **파일 쓰기**: 새로운 내용으로 파일 생성 또는 덮어쓰기
- **파일 목록**: 파일 유형 정보와 함께 디렉토리 내용 탐색

## 설치

1. 이 저장소를 복제하거나 다운로드
2. 의존성 설치:
   ```bash
   cd simple-file-server
   npm install
   ```

## 사용법

### 독립 실행 테스트

```bash
cd simple-file-server
npm start
```

### Claude Code 통합

Claude Code 설정에 추가:

**전역 구성** (`~/.claude/settings.json`):
```json
{
  "mcpServers": {
    "simple-file-server": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/simple-file-server/index.js"],
      "env": {}
    }
  }
}
```

**프로젝트 구성** (`~/.claude.json`):
```json
{
  "/your/project/path": {
    "mcpServers": {
      "simple-file-server": {
        "type": "stdio",
        "command": "node",
        "args": ["/path/to/simple-file-server/index.js"],
        "env": {}
      }
    }
  }
}
```

구성 후 Claude Code를 재시작하세요. 다음 도구들을 사용할 수 있습니다:

- `mcp__simple-file-server__read_file`
- `mcp__simple-file-server__write_file`
- `mcp__simple-file-server__list_files`

## API

### read_file
파일의 내용을 읽습니다.

**매개변수:**
- `path` (문자열, 필수): 읽을 파일의 경로

### write_file
파일에 내용을 씁니다.

**매개변수:**
- `path` (문자열, 필수): 쓸 파일의 경로
- `content` (문자열, 필수): 파일에 쓸 내용

### list_files
경로의 파일과 디렉토리를 나열합니다.

**매개변수:**
- `path` (문자열, 선택적): 나열할 디렉토리 경로 (기본값: 현재 디렉토리)

## 요구사항

- Node.js >= 18
- `@modelcontextprotocol/sdk` ^0.6.0

## 라이선스

MIT