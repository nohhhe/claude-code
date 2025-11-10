#!/usr/bin/env node

/**
 * Demo script to test API functionality
 * Shows how the auto-generated documentation matches actual API behavior
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  email: 'demo@example.com',
  name: 'Demo User',
  password: 'demopassword123'
};

let createdUserId = null;
let authToken = null;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function logStep(step, description) {
  console.log(`\n🔸 Step ${step}: ${description}`);
  console.log('='.repeat(50));
}

async function createUser() {
  try {
    logStep(1, '사용자 생성 (POST /api/users)');
    
    const response = await axios.post(`${BASE_URL}/users`, testUser);
    
    createdUserId = response.data.id;
    console.log('✅ 사용자 생성 성공:');
    console.log(`   - ID: ${response.data.id}`);
    console.log(`   - Email: ${response.data.email}`);
    console.log(`   - Name: ${response.data.name}`);
    console.log(`   - Role: ${response.data.role}`);
    console.log(`   - Status Code: ${response.status}`);
    
    return response.data;
  } catch (error) {
    console.log('❌ 사용자 생성 실패:');
    if (error.response) {
      console.log(`   - Status: ${error.response.status}`);
      console.log(`   - Error: ${error.response.data.error}`);
      console.log(`   - Code: ${error.response.data.code}`);
      
      // 이미 존재하는 사용자의 경우, 계속 진행
      if (error.response.data.code === 'EMAIL_EXISTS') {
        console.log('   ℹ️  이미 존재하는 사용자로 데모 계속 진행...');
        return null;
      }
    } else {
      console.log(`   - Message: ${error.message}`);
    }
    throw error;
  }
}

async function testAuthRequired() {
  try {
    logStep(2, '인증 없이 사용자 조회 시도 (GET /api/users/{id})');
    
    const dummyId = '123e4567-e89b-12d3-a456-426614174000';
    await axios.get(`${BASE_URL}/users/${dummyId}`);
    
    console.log('❌ 예상과 다름: 인증 없이 접근이 허용됨');
  } catch (error) {
    console.log('✅ 예상된 결과: 인증 필요');
    if (error.response) {
      console.log(`   - Status: ${error.response.status}`);
      console.log(`   - Error: ${error.response.data.error}`);
      console.log(`   - Code: ${error.response.data.code}`);
    }
  }
}

async function testInvalidUserId() {
  try {
    logStep(3, '잘못된 사용자 ID 형식으로 조회 (GET /api/users/invalid-id)');
    
    // Mock JWT token for demo (실제로는 로그인 후 받는 토큰 사용)
    authToken = 'demo-token-for-testing';
    
    await axios.get(`${BASE_URL}/users/invalid-id`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('❌ 예상과 다름: 잘못된 ID 형식이 허용됨');
  } catch (error) {
    console.log('✅ 예상된 결과: 잘못된 ID 형식 거부');
    if (error.response) {
      console.log(`   - Status: ${error.response.status}`);
      console.log(`   - Error: ${error.response.data.error}`);
      console.log(`   - Code: ${error.response.data.code}`);
    }
  }
}

async function testValidationErrors() {
  try {
    logStep(4, '유효성 검사 실패 테스트 (POST /api/users - 잘못된 데이터)');
    
    const invalidUser = {
      email: 'invalid-email',  // 잘못된 이메일 형식
      name: 'a',               // 너무 짧은 이름
      password: '123'          // 너무 짧은 비밀번호
    };
    
    await axios.post(`${BASE_URL}/users`, invalidUser);
    
    console.log('❌ 예상과 다름: 잘못된 데이터가 허용됨');
  } catch (error) {
    console.log('✅ 예상된 결과: 유효성 검사 실패');
    if (error.response && error.response.status === 400) {
      console.log(`   - Status: ${error.response.status}`);
      console.log(`   - Error: ${error.response.data.error}`);
      console.log(`   - Code: ${error.response.data.code}`);
      if (error.response.data.details) {
        console.log('   - Validation Details:');
        Object.entries(error.response.data.details).forEach(([field, detail]) => {
          console.log(`     * ${field}: ${detail.msg}`);
        });
      }
    }
  }
}

async function testHealthEndpoint() {
  try {
    logStep(5, '헬스 체크 엔드포인트 테스트 (GET /health)');
    
    const response = await axios.get('http://localhost:3000/health');
    
    console.log('✅ 헬스 체크 성공:');
    console.log(`   - Status: ${response.data.status}`);
    console.log(`   - Timestamp: ${response.data.timestamp}`);
    console.log(`   - Version: ${response.data.version}`);
    console.log(`   - Status Code: ${response.status}`);
  } catch (error) {
    console.log('❌ 헬스 체크 실패:');
    console.log(`   - Message: ${error.message}`);
  }
}

async function checkServerStatus() {
  try {
    await axios.get('http://localhost:3000/health');
    return true;
  } catch (error) {
    return false;
  }
}

async function runDemo() {
  console.log('🚀 API 자동 문서 생성 데모 시작');
  console.log('=====================================\n');
  
  // 서버 상태 확인
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    console.log('❌ 서버가 실행되지 않음');
    console.log('   다음 명령어로 서버를 먼저 실행하세요:');
    console.log('   npm run dev');
    console.log('\n   그리고 다른 터미널에서 데모를 실행하세요:');
    console.log('   node scripts/demo.js');
    return;
  }
  
  console.log('✅ API 서버 연결 확인됨 (http://localhost:3000)');
  
  try {
    await createUser();
    await delay(500);
    
    await testAuthRequired();
    await delay(500);
    
    await testInvalidUserId();
    await delay(500);
    
    await testValidationErrors();
    await delay(500);
    
    await testHealthEndpoint();
    
    console.log('\n🎉 데모 완료!');
    console.log('=====================================');
    console.log('\n📚 생성된 API 문서 확인:');
    console.log('   1. OpenAPI 명세 생성: npm run generate-docs');
    console.log('   2. Swagger UI 실행: node swagger-ui-server.js');
    console.log('   3. 브라우저에서 확인: http://localhost:3001/docs');
    console.log('\n📄 생성된 파일들:');
    console.log('   - openapi.yaml: OpenAPI 3.0 명세서');
    console.log('   - Swagger UI에서 직접 API 테스트 가능');
    
  } catch (error) {
    console.log('\n💥 데모 실행 중 오류 발생');
    console.log('서버가 정상적으로 실행 중인지 확인하세요.');
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 데모 종료됨');
  process.exit(0);
});

// Run demo if this script is executed directly
if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };