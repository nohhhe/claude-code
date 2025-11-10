# Dev Container for Claude Code

## Current files on .devcontainer 
```
$ ls -1 .devcontainer
Dockerfile                 # Node.js 20 기반의 개발 컨테이너 이미지 빌드 설정 파일
devcontainer-cursor.json   # Cursor 에디터용 Claude Code Sandbox 개발 컨테이너 설정 파일
devcontainer-on-k8s.json   # k8s 환경에서 실행되는 Claude Code Sandbox 개발 컨테이너 설정 파일
devcontainer.json          # 기본 Claude Code Sandbox 개발 컨테이너 설정 파일 
init-firewall.sh           # Docker DNS 정보 추출 및 방화벽 초기화를 위한 bash 스크립트
```

## Deploy devcontainer by devpod 
```
$ brew install --cask devpod
$ devpod up .
```

