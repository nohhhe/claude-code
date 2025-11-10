# 시스템 운영 Runbook

## 목차
1. [개요](#개요)
2. [모니터링 시스템 구성](#모니터링-시스템-구성)
3. [주요 알람별 대응책](#주요-알람별-대응책)
4. [장애 대응 절차](#장애-대응-절차)
5. [서비스 재시작 방법](#서비스-재시작-방법)
6. [성능 이슈 진단](#성능-이슈-진단)
7. [로그 분석 가이드](#로그-분석-가이드)
8. [비상 연락처](#비상-연락처)

## 개요

이 문서는 시스템 모니터링 환경에서 발생할 수 있는 각종 장애 상황에 대한 대응 절차를 정의합니다.

### 시스템 구성
- **모니터링**: Prometheus + Grafana + AlertManager
- **웹 서버**: Nginx
- **애플리케이션**: Java Spring Boot (포트: 8080)
- **데이터베이스**: PostgreSQL (포트: 5432)
- **캐시**: Redis

## 모니터링 시스템 구성

### Prometheus 설정 파일 위치
- 설정 파일: `/etc/prometheus/prometheus.yml`
- 알람 규칙: `/etc/prometheus/alerts.yml`
- 포트: 9090

### Grafana 대시보드
- URL: http://localhost:3000
- 기본 계정: admin/admin
- 주요 대시보드: System Monitoring Dashboard

### 모니터링 대상 서비스
- Node Exporter (시스템 메트릭): 9100
- Application: 8080/actuator/prometheus
- PostgreSQL Exporter: 9187

## 주요 알람별 대응책

### 🚨 CRITICAL 알람

#### 1. ServiceDown
**증상**: 서비스가 1분 이상 응답하지 않음

**즉시 대응**:
```bash
# 1. 서비스 상태 확인
systemctl status app nginx postgresql redis

# 2. 프로세스 확인
ps aux | grep -E "(java|nginx|postgres|redis)"

# 3. 포트 사용 확인
netstat -tulpn | grep -E "(8080|80|5432|6379)"

# 4. 서비스 재시작 (우선순위 순)
sudo systemctl restart postgresql
sleep 10
sudo systemctl restart redis
sleep 5
sudo systemctl restart app
sleep 5
sudo systemctl restart nginx
```

#### 2. HighMemoryUsage (85% 이상)
**증상**: 메모리 사용률이 85% 이상으로 5분간 지속

**즉시 대응**:
```bash
# 1. 메모리 사용 현황 확인
free -h
top -o %MEM

# 2. 메모리 사용량이 높은 프로세스 확인
ps aux --sort=-%mem | head -10

# 3. Java 힙 덤프 생성 (애플리케이션 문제인 경우)
sudo jcmd $(pgrep java) GC.run_finalization
sudo jcmd $(pgrep java) GC.run

# 4. 임시 파일 정리
sudo rm -rf /tmp/*
sudo journalctl --vacuum-time=1d

# 5. 메모리 사용률이 계속 높을 경우 서비스 재시작
./monitoring/scripts/restart-services.sh app
```

#### 3. DiskSpaceLow (90% 이상)
**증상**: 디스크 사용률이 90% 이상

**즉시 대응**:
```bash
# 1. 디스크 사용량 확인
df -h
du -sh /var/log/* | sort -hr

# 2. 큰 로그 파일 정리
sudo find /var/log -name "*.log" -size +100M -exec ls -lh {} \;
sudo logrotate -f /etc/logrotate.conf

# 3. 임시 파일 정리
sudo find /tmp -type f -atime +7 -delete
sudo find /var/tmp -type f -atime +7 -delete

# 4. 애플리케이션 로그 정리
sudo find /var/log/app -name "*.log.*" -mtime +7 -delete

# 5. Docker 정리 (해당하는 경우)
docker system prune -a -f
```

#### 4. HighErrorRate (10% 이상)
**증상**: HTTP 5xx 에러율이 10% 이상으로 2분간 지속

**즉시 대응**:
```bash
# 1. 에러 로그 확인
tail -f /var/log/nginx/error.log
tail -f /var/log/app/app.log | grep ERROR

# 2. 애플리케이션 상태 확인
curl -s http://localhost:8080/actuator/health | jq .

# 3. 데이터베이스 연결 확인
sudo -u postgres psql -c "SELECT 1;"

# 4. 서비스 순서대로 재시작
./monitoring/scripts/restart-services.sh
```

### ⚠️ WARNING 알람

#### 1. HighCpuUsage (80% 이상)
**대응 절차**:
```bash
# 1. CPU 사용률 높은 프로세스 확인
top -o %CPU
htop

# 2. I/O 대기 확인
iotop -o

# 3. 프로세스별 CPU 사용 패턴 분석
pidstat -u 5 3

# 4. 필요시 프로세스 우선순위 조정
sudo renice +10 $(pgrep java)
```

#### 2. HighResponseTime (2초 이상)
**대응 절차**:
```bash
# 1. 응답 시간 확인
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:8080/api/health

# 2. 데이터베이스 쿼리 성능 확인
sudo -u postgres psql -d myapp -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;"

# 3. 네트워크 지연 확인
ping -c 5 localhost
```

## 장애 대응 절차

### 단계 1: 상황 파악 (1-2분)
1. **알람 내용 확인**: Grafana 대시보드에서 메트릭 확인
2. **서비스 상태 점검**: `systemctl status` 명령으로 전체 서비스 상태 확인
3. **로그 확인**: 최근 5분간의 에러 로그 확인

### 단계 2: 긴급 복구 (5분 내)
```bash
# 표준 복구 스크립트 실행
cd /path/to/monitoring/scripts
sudo ./restart-services.sh

# 복구 확인
curl -f http://localhost/health
```

### 단계 3: 근본 원인 분석 (복구 후)
1. **로그 분석**: 에러 발생 시점 전후의 상세 로그 검토
2. **메트릭 분석**: Grafana에서 장애 시점의 시스템 메트릭 분석
3. **인시던트 리포트 작성**: 원인, 영향 범위, 대응 시간, 해결 방법 문서화

## 서비스 재시작 방법

### 자동 재시작 스크립트 사용
```bash
# 모든 서비스 재시작
sudo ./monitoring/scripts/restart-services.sh all

# 특정 서비스만 재시작
sudo ./monitoring/scripts/restart-services.sh nginx
sudo ./monitoring/scripts/restart-services.sh app
sudo ./monitoring/scripts/restart-services.sh postgresql
```

### 수동 서비스 재시작 (권장 순서)

#### 1. PostgreSQL
```bash
sudo systemctl stop postgresql
sudo systemctl start postgresql
sudo systemctl status postgresql

# 연결 확인
sudo -u postgres psql -c "SELECT version();"
```

#### 2. Redis
```bash
sudo systemctl restart redis
redis-cli ping  # PONG 응답 확인
```

#### 3. Application
```bash
sudo systemctl stop app
# 5초 대기 (Graceful Shutdown)
sleep 5
sudo systemctl start app

# 헬스체크 대기 (최대 30초)
for i in {1..30}; do
    if curl -f http://localhost:8080/actuator/health; then
        echo "Application is healthy"
        break
    fi
    sleep 1
done
```

#### 4. Nginx
```bash
# 설정 파일 검증
sudo nginx -t

# 재시작
sudo systemctl restart nginx
curl -I http://localhost/
```

### 무중단 재시작 (Rolling Restart)

#### Nginx 무중단 재시작
```bash
# 설정 리로드 (연결 유지)
sudo nginx -s reload

# 또는
sudo systemctl reload nginx
```

#### Application 무중단 재시작 (다중 인스턴스 환경)
```bash
# Blue-Green 배포 시뮬레이션
# 1. 새 인스턴스 시작 (포트 8081)
# 2. 헬스체크 통과 확인
# 3. 로드밸런서 설정 변경
# 4. 기존 인스턴스 종료
```

## 성능 이슈 진단

### 1. CPU 성능 이슈

#### 진단 명령어
```bash
# 전체 CPU 사용률
top -bn1 | grep "Cpu(s)"
vmstat 1 5

# 프로세스별 CPU 사용률
ps aux --sort=-%cpu | head -10

# CPU 대기 상태 분석
iostat -x 1 5

# Context Switch 확인
vmstat 1 5 | awk 'NR>2 {print $11, $12}'
```

#### 최적화 방법
```bash
# 1. 프로세스 우선순위 조정
sudo renice -n 10 $(pgrep java)

# 2. CPU Governor 설정 확인
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# 3. CPU 바인딩 (필요시)
taskset -cp 0-3 $(pgrep java)
```

### 2. 메모리 성능 이슈

#### 진단 명령어
```bash
# 메모리 사용량 상세 분석
free -h
cat /proc/meminfo

# 프로세스별 메모리 사용률
ps aux --sort=-%mem | head -10

# 메모리 누수 탐지
valgrind --tool=memcheck --leak-check=yes ./your-app

# Java 힙 분석
jstat -gc $(pgrep java) 5s
```

#### 메모리 최적화
```bash
# 1. Swap 사용률 확인
swapon --show
cat /proc/swaps

# 2. 캐시 정리 (주의: 성능 영향 있음)
echo 1 | sudo tee /proc/sys/vm/drop_caches

# 3. Java 힙 설정 최적화 (application.properties)
# -Xms2g -Xmx4g -XX:+UseG1GC
```

### 3. 디스크 I/O 성능 이슈

#### 진단 명령어
```bash
# I/O 통계
iostat -x 1 5

# 프로세스별 I/O 사용률
iotop -o

# 디스크 사용률
df -h
du -sh /var/log/* | sort -hr
```

#### I/O 최적화
```bash
# 1. 디스크 스케줄러 확인/변경
cat /sys/block/sda/queue/scheduler
echo mq-deadline | sudo tee /sys/block/sda/queue/scheduler

# 2. 로그 로테이션 강제 실행
sudo logrotate -f /etc/logrotate.conf

# 3. 임시 파일시스템 사용 (필요시)
sudo mount -t tmpfs -o size=1G tmpfs /tmp
```

### 4. 네트워크 성능 이슈

#### 진단 명령어
```bash
# 네트워크 인터페이스 통계
netstat -i
ip -s link

# 연결 상태 확인
ss -tuln
netstat -an | grep ESTABLISHED | wc -l

# 대역폭 사용률
iftop -i eth0

# 네트워크 지연 시간
ping -c 10 target-server
traceroute target-server
```

## 로그 분석 가이드

### 로그 파일 위치
```
monitoring/logs/
├── application/app.log          # 애플리케이션 로그
├── system/system.log           # 시스템 로그
├── database/postgres.log       # PostgreSQL 로그
└── web/
    ├── nginx-access.log        # Nginx 접근 로그
    └── nginx-error.log         # Nginx 에러 로그
```

### 1. 애플리케이션 로그 분석

#### 일반적인 분석 패턴
```bash
# 에러 발생 빈도 확인
grep -c "ERROR" monitoring/logs/application/app.log

# 특정 시간대 에러 확인
grep "2024-09-08 10:1[7-9]" monitoring/logs/application/app.log | grep ERROR

# 응답 시간 분석
grep "Response time" monitoring/logs/application/app.log | \
awk '{print $NF}' | sed 's/ms//' | \
awk '{sum+=$1; count++} END {print "Average:", sum/count, "ms"}'

# OutOfMemoryError 패턴 확인
grep -A 5 -B 5 "OutOfMemoryError" monitoring/logs/application/app.log
```

#### 주요 에러 패턴별 분석

**1. Database Connection Timeout**
```bash
# 패턴: java.sql.SQLException: Connection timeout
grep -n "Connection timeout" monitoring/logs/application/app.log

# 대응: 
# - 커넥션 풀 설정 확인
# - DB 서버 상태 점검
# - 네트워크 연결 확인
```

**2. OutOfMemoryError**
```bash
# 패턴: java.lang.OutOfMemoryError
grep -B 10 -A 5 "OutOfMemoryError" monitoring/logs/application/app.log

# 대응:
# - 힙 메모리 증가 (-Xmx 옵션)
# - 메모리 누수 분석
# - GC 튜닝 고려
```

### 2. 시스템 로그 분석

#### Systemd 로그 분석
```bash
# 서비스 실패 확인
grep "Failed with result" monitoring/logs/system/system.log

# 메모리 관련 킬 확인
grep "Out of memory" monitoring/logs/system/system.log

# 서비스 재시작 패턴 확인
grep "Scheduled restart" monitoring/logs/system/system.log
```

#### 주요 시스템 이벤트 패턴

**1. OOM Killer 활동**
```bash
# 패턴: Out of memory: Kill process
grep -A 3 "Out of memory" monitoring/logs/system/system.log

# 대응:
# - 메모리 사용량 모니터링 강화
# - 스왑 메모리 증가 검토
# - 메모리 사용 프로세스 최적화
```

**2. 서비스 시작 실패**
```bash
# 패턴: Failed with result 'start-limit-hit'
grep "start-limit-hit" monitoring/logs/system/system.log

# 대응:
# - 서비스 의존성 확인
# - 설정 파일 검증
# - 포트 충돌 확인
```

### 3. 데이터베이스 로그 분석

#### PostgreSQL 성능 분석
```bash
# 느린 쿼리 확인
grep "duration:" monitoring/logs/database/postgres.log | \
awk '$4 > 1000 {print}' | head -10

# 연결 실패 패턴
grep "authentication failed" monitoring/logs/database/postgres.log

# 메모리 부족 에러
grep "out of memory" monitoring/logs/database/postgres.log
```

#### 주요 데이터베이스 이슈 패턴

**1. Statement Timeout**
```bash
# 패턴: canceling statement due to statement timeout
grep -B 2 -A 2 "statement timeout" monitoring/logs/database/postgres.log

# 대응:
# - 쿼리 최적화
# - 인덱스 추가
# - statement_timeout 조정
```

**2. Disk Space Full**
```bash
# 패턴: No space left on device
grep "No space left" monitoring/logs/database/postgres.log

# 대응:
# - 디스크 공간 확보
# - WAL 로그 정리
# - VACUUM 실행
```

### 4. 웹 서버 로그 분석

#### Nginx 접근 로그 분석
```bash
# 응답 시간 통계
awk '{print $(NF)}' monitoring/logs/web/nginx-access.log | \
awk '{sum+=$1; count++} END {print "Average response time:", sum/count, "seconds"}'

# 상태 코드별 통계
awk '{print $9}' monitoring/logs/web/nginx-access.log | sort | uniq -c | sort -nr

# 에러율 계산 (5xx 에러)
awk '$9 >= 500 {error++} {total++} END {print "Error rate:", (error/total)*100 "%"}' \
monitoring/logs/web/nginx-access.log

# 느린 요청 확인 (2초 이상)
awk '$(NF) > 2.0 {print $0}' monitoring/logs/web/nginx-access.log
```

#### Nginx 에러 로그 분석
```bash
# 에러 레벨별 분류
awk '{print $4}' monitoring/logs/web/nginx-error.log | \
sed 's/\[//' | sed 's/\]//' | sort | uniq -c

# Upstream 에러 확인
grep "upstream" monitoring/logs/web/nginx-error.log

# 연결 제한 에러
grep "limiting requests" monitoring/logs/web/nginx-error.log
```

### 5. 로그 분석 자동화 스크립트

#### 종합 에러 리포트 생성
```bash
#!/bin/bash
# 파일명: generate-error-report.sh

REPORT_FILE="error-report-$(date +%Y%m%d-%H%M%S).txt"
LOG_DIR="monitoring/logs"

echo "=== 시스템 에러 리포트 ($(date)) ===" > $REPORT_FILE

echo -e "\n### 애플리케이션 에러 (최근 1시간)" >> $REPORT_FILE
grep "$(date --date='1 hour ago' '+%Y-%m-%d %H')" $LOG_DIR/application/app.log | \
grep ERROR | tail -10 >> $REPORT_FILE

echo -e "\n### 시스템 Critical 이벤트" >> $REPORT_FILE
grep -E "(Out of memory|Failed with result)" $LOG_DIR/system/system.log | \
tail -5 >> $REPORT_FILE

echo -e "\n### 데이터베이스 에러" >> $REPORT_FILE
grep ERROR $LOG_DIR/database/postgres.log | tail -5 >> $REPORT_FILE

echo -e "\n### 웹서버 5xx 에러" >> $REPORT_FILE
awk '$9 >= 500' $LOG_DIR/web/nginx-access.log | tail -10 >> $REPORT_FILE

echo "리포트 생성 완료: $REPORT_FILE"
```

#### 실시간 로그 모니터링
```bash
#!/bin/bash
# 파일명: live-log-monitor.sh

echo "실시간 로그 모니터링 시작..."

# 터미널을 4개 영역으로 분할하여 각각 다른 로그 표시
multitail \
  -l "tail -f monitoring/logs/application/app.log | grep -E 'ERROR|WARN'" \
  -l "tail -f monitoring/logs/system/system.log | grep -E 'error|failed'" \
  -l "tail -f monitoring/logs/database/postgres.log | grep -E 'ERROR|FATAL'" \
  -l "tail -f monitoring/logs/web/nginx-error.log"
```

## 비상 연락처

### 장애 레벨별 에스컬레이션

#### Level 1 - Service Impact (서비스 영향)
- **1차 담당자**: 운영팀 (24/7)
  - 핸드폰: 010-XXXX-XXXX
  - 이메일: ops@company.com
  - Slack: #ops-emergency

#### Level 2 - Critical System Failure (중요 시스템 장애)
- **2차 담당자**: 시니어 엔지니어
  - 핸드폰: 010-YYYY-YYYY
  - 대응 시간: 15분 이내

#### Level 3 - Major Incident (메이저 인시던트)
- **3차 담당자**: 팀 리더
  - 핸드폰: 010-ZZZZ-ZZZZ
  - 대응 시간: 30분 이내

### 외부 서비스 연락처
- **클라우드 서비스**: AWS Support (Business Plan)
- **네트워크**: ISP 기술 지원
- **하드웨어**: 벤더 기술 지원

## 체크리스트

### 장애 발생 시 점검 사항
- [ ] Grafana 대시보드에서 메트릭 확인
- [ ] 모든 서비스 상태 확인 (`systemctl status`)
- [ ] 디스크 사용량 확인 (`df -h`)
- [ ] 메모리 사용량 확인 (`free -h`)
- [ ] 최근 로그에서 에러 확인
- [ ] 네트워크 연결 상태 확인
- [ ] 복구 조치 실행
- [ ] 복구 확인 (헬스체크)
- [ ] 인시던트 리포트 작성
- [ ] 관련자 통보

### 정기 점검 사항 (주간)
- [ ] 로그 파일 크기 및 로테이션 상태
- [ ] 디스크 사용량 트렌드 확인
- [ ] 백업 정상 동작 확인
- [ ] 모니터링 시스템 정상 동작 확인
- [ ] 알람 규칙 검토 및 업데이트

---

**문서 버전**: 1.0  
**최종 수정일**: 2024-09-08  
**작성자**: 운영팀  
**승인자**: CTO