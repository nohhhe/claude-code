# Strategy Pattern 리팩토링 예시

복잡한 조건문을 Strategy 패턴으로 리팩토링한 결제 처리 시스템 예시입니다.

## Before (리팩토링 전)

### 문제점
- `PaymentProcessor` 클래스에 모든 결제 로직이 집중됨
- 복잡한 if-else 조건문으로 가독성 저하
- 새로운 결제 방식 추가 시 기존 코드 수정 필요 (OCP 위반)
- 각 결제 방식별 테스트가 어려움
- 코드 중복 발생 가능성

### 파일 구조
```
paymentProcessor.ts    # 모든 로직이 하나의 파일에 집중
```

## After (리팩토링 후)

### 개선점
- 각 결제 방식별로 독립적인 전략 클래스 분리
- 새로운 결제 방식 추가 시 기존 코드 수정 불필요 (OCP 준수)
- 각 전략별 독립적 테스트 가능
- 코드 가독성 및 유지보수성 향상
- 런타임에 전략 변경/추가/제거 가능

### 파일 구조
```
after/
├── types.ts                           # 공통 인터페이스
├── PaymentProcessor.ts                 # 컨텍스트 클래스
├── strategies/
│   ├── PaymentStrategy.ts             # 전략 인터페이스
│   ├── CardPaymentStrategy.ts         # 카드 결제 전략
│   ├── TransferPaymentStrategy.ts     # 계좌이체 전략
│   └── PointsPaymentStrategy.ts       # 포인트 결제 전략
├── index.ts                           # 모듈 내보내기
└── example.ts                         # 사용 예시 (확장 포함)
```

## 핵심 개념

### Strategy Pattern 구성 요소

1. **Strategy (전략)**: `PaymentStrategy` 추상 클래스
   - 모든 구체적 전략이 구현해야 할 공통 인터페이스 제공

2. **ConcreteStrategy (구체적 전략)**: 
   - `CardPaymentStrategy`: 카드 결제 구현
   - `TransferPaymentStrategy`: 계좌이체 구현  
   - `PointsPaymentStrategy`: 포인트 결제 구현

3. **Context (컨텍스트)**: `PaymentProcessor`
   - 전략 객체를 참조하고 실행하는 클래스

### 확장성 예시

새로운 암호화폐 결제 방식을 추가하는 예시:

```typescript
class CryptoPaymentStrategy extends PaymentStrategy {
  processPayment(request: PaymentRequest): PaymentResult {
    // 암호화폐 결제 로직 구현
  }
}

// 런타임에 새 전략 등록
processor.registerStrategy('crypto', new CryptoPaymentStrategy());
```

## 실행 방법

```bash
# TypeScript 컴파일 후 실행 (Node.js 환경에서)
tsc after/example.ts
node after/example.js
```

## 장점 요약

1. **개방-폐쇄 원칙 (OCP)**: 확장에는 열려있고 수정에는 닫혀있음
2. **단일 책임 원칙 (SRP)**: 각 전략이 하나의 결제 방식만 담당
3. **런타임 유연성**: 전략을 동적으로 변경/추가/제거 가능
4. **테스트 용이성**: 각 전략을 독립적으로 테스트 가능
5. **코드 재사용**: 공통 기능은 부모 클래스에서 제공
