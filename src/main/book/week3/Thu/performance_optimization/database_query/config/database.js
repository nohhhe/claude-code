const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'performance_test',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    
    // 성능 최적화 설정
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    
    // 로깅 설정 (개발 환경에서만)
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // 벤치마크 활성화 (쿼리 실행 시간 측정)
    benchmark: true,
    
    // 쿼리 최적화 옵션
    define: {
      freezeTableName: true,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    
    // 타임존 설정
    timezone: '+09:00'
  }
);

module.exports = sequelize;