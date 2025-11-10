/**
 * 가격에 할인율을 적용하여 할인된 가격을 계산합니다.
 * @param price 원래 가격 (0 이상이어야 함)
 * @param discountRate 할인율 (0-100 사이의 값)
 * @returns 할인이 적용된 최종 가격
 * @throws Error 유효하지 않은 입력값이 전달된 경우
 */
export function calculateDiscount(price: number, discountRate: number): number {
  // 입력값 유효성 검증
  if (price < 0 || discountRate < 0 || discountRate > 100) {
    throw new Error('Invalid input');
  }
  
  // 할인된 가격 계산: 원가 * (1 - 할인율/100)
  return price * (1 - discountRate / 100);
}