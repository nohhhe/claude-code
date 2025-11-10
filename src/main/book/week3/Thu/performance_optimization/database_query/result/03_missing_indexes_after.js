const { User, Post, Comment, Department } = require('../models/associations');
const { Op } = require('sequelize');

// ✅ AFTER: 적절한 인덱스 추가 후 성능 개선

// 추가된 인덱스들:
/*
CREATE INDEX idx_users_firstname_lastname ON users (firstName, lastName);
CREATE INDEX idx_posts_created_at ON posts (createdAt);
CREATE INDEX idx_posts_status_created_at ON posts (status, createdAt);
CREATE INDEX idx_posts_user_category_status ON posts (userId, categoryId, status);
CREATE INDEX idx_posts_published_at ON posts (publishedAt);
CREATE INDEX idx_comments_post_id ON comments (postId);
CREATE INDEX idx_comments_user_created ON comments (userId, createdAt);
CREATE INDEX idx_comments_post_approved ON comments (postId, isApproved);
CREATE INDEX idx_comments_approved_created ON comments (isApproved, createdAt);
CREATE FULLTEXT INDEX idx_posts_title_content ON posts (title, content);
CREATE INDEX idx_departments_name ON departments (name);
*/

async function searchUsersByName_FAST() {
  console.log('✅ Optimized Index - User Name Search');
  
  // firstName, lastName 복합 인덱스로 빠른 검색
  const users = await User.findAll({
    where: {
      [Op.or]: [
        { firstName: { [Op.like]: 'John%' } }, // 접두사 검색으로 변경하여 인덱스 활용
        { lastName: { [Op.like]: 'Smith%' } }
      ]
    },
    limit: 50
  });
  
  return users;
}

async function getPostsByDateRange_FAST() {
  console.log('✅ Optimized Index - Date Range Query');
  
  // status, createdAt 복합 인덱스로 최적화
  const posts = await Post.findAll({
    where: {
      status: 'published', // 선택성이 높은 조건을 먼저
      createdAt: {
        [Op.between]: ['2024-01-01', '2024-12-31']
      }
    },
    order: [['createdAt', 'DESC']], // 인덱스 순서와 일치
    limit: 100
  });
  
  return posts;
}

async function getCommentsByPost_FAST() {
  console.log('✅ Optimized Index - Comment Foreign Key');
  
  // postId, isApproved 복합 인덱스로 빠른 조회
  const comments = await Comment.findAll({
    where: {
      postId: 123,
      isApproved: true
    },
    order: [['createdAt', 'ASC']], // createdAt 인덱스 활용
    limit: 50
  });
  
  return comments;
}

async function searchPostsByContent_FAST() {
  console.log('✅ Optimized Index - Full-Text Search');
  
  // FULLTEXT 인덱스를 활용한 전문 검색
  const posts = await Post.findAll({
    where: {
      status: 'published', // 일반 인덱스 먼저 활용
      [Op.and]: [
        sequelize.literal("MATCH(title, content) AGAINST('React JavaScript' IN BOOLEAN MODE)")
      ]
    },
    // 관련도 점수 포함
    attributes: [
      '*',
      [sequelize.literal("MATCH(title, content) AGAINST('React JavaScript' IN BOOLEAN MODE)"), 'relevance']
    ],
    order: [['relevance', 'DESC']],
    limit: 20
  });
  
  return posts;
}

async function getDepartmentEmployeeCount_FAST() {
  console.log('✅ Optimized Index - Aggregation Query');
  
  // 집계 최적화를 위한 직접 JOIN 사용
  const departments = await sequelize.query(`
    SELECT 
      d.id,
      d.name,
      COUNT(u.id) as employeeCount
    FROM departments d
    LEFT JOIN users u ON d.id = u.departmentId
    GROUP BY d.id, d.name
    HAVING COUNT(u.id) > 10
    ORDER BY employeeCount DESC
  `, {
    type: sequelize.QueryTypes.SELECT
  });
  
  return departments;
}

async function getRecentCommentsByUser_FAST() {
  console.log('✅ Optimized Index - Composite Query');
  
  // userId, createdAt 복합 인덱스로 최적화
  const recentComments = await Comment.findAll({
    where: {
      userId: 456,
      createdAt: {
        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    },
    order: [['createdAt', 'DESC']], // 인덱스 순서와 일치
    limit: 10
  });
  
  return recentComments;
}

async function searchApprovedComments_FAST() {
  console.log('✅ Optimized Index - Boolean + Foreign Key');
  
  // postId, isApproved 복합 인덱스 + IN 절 최적화
  const approvedComments = await Comment.findAll({
    where: {
      postId: { [Op.in]: [1, 2, 3, 4, 5] },
      isApproved: true
    },
    include: [{
      model: User,
      as: 'author',
      attributes: ['username']
    }],
    order: [['createdAt', 'DESC']]
  });
  
  return approvedComments;
}

async function getUserPostsInCategory_FAST() {
  console.log('✅ Optimized Index - Multiple Conditions');
  
  // userId, categoryId, status 복합 인덱스로 최적화
  const posts = await Post.findAll({
    where: {
      userId: 789,
      categoryId: 5,
      status: 'published',
      publishedAt: {
        [Op.not]: null
      }
    },
    order: [['publishedAt', 'DESC']] // publishedAt 인덱스 활용
  });
  
  return posts;
}

async function getMonthlyPostStats_FAST() {
  console.log('✅ Optimized Index - Date-based Aggregation');
  
  // 최적화된 집계 쿼리 (인덱스 힌트 포함)
  const monthlyStats = await sequelize.query(`
    SELECT 
      DATE_FORMAT(createdAt, '%Y-%m') as month,
      COUNT(*) as postCount,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as publishedCount
    FROM posts USE INDEX (idx_posts_status_created_at)
    WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
    ORDER BY month DESC
  `, {
    type: sequelize.QueryTypes.SELECT
  });
  
  return monthlyStats;
}

// ✅ 인덱스 활용 최적화 전략들

async function optimizedPagination_FAST(page = 1, limit = 20) {
  console.log('✅ Index-Optimized Pagination');
  
  // OFFSET 대신 커서 기반 페이지네이션 (인덱스 효율적 활용)
  const posts = await Post.findAll({
    where: {
      status: 'published',
      ...(page > 1 && {
        id: { [Op.lt]: (page - 1) * limit } // 이전 페이지의 마지막 ID
      })
    },
    order: [['id', 'DESC']], // PRIMARY KEY 인덱스 활용
    limit
  });
  
  return posts;
}

async function rangeQueryOptimization_FAST() {
  console.log('✅ Range Query with Covering Index');
  
  // 커버링 인덱스로 테이블 액세스 없이 데이터 조회
  const postSummary = await Post.findAll({
    attributes: ['id', 'title', 'userId', 'createdAt'], // 인덱스에 포함된 컬럼만
    where: {
      createdAt: {
        [Op.between]: ['2024-01-01', '2024-03-31']
      },
      status: 'published'
    },
    order: [['createdAt', 'DESC']]
  });
  
  return postSummary;
}

async function conditionalIndexUsage_FAST(searchType) {
  console.log('✅ Conditional Index Usage');
  
  let whereClause = { status: 'published' };
  let orderClause = [['createdAt', 'DESC']];
  
  // 검색 타입에 따라 최적의 인덱스 활용
  if (searchType === 'recent') {
    // createdAt 인덱스 활용
    whereClause.createdAt = {
      [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };
  } else if (searchType === 'popular') {
    // 인기 포스트는 별도 통계 테이블 활용 권장
    orderClause = [['viewCount', 'DESC']]; // viewCount 인덱스 필요
  }
  
  return await Post.findAll({
    where: whereClause,
    order: orderClause,
    limit: 50
  });
}

module.exports = {
  searchUsersByName_FAST,
  getPostsByDateRange_FAST,
  getCommentsByPost_FAST,
  searchPostsByContent_FAST,
  getDepartmentEmployeeCount_FAST,
  getRecentCommentsByUser_FAST,
  searchApprovedComments_FAST,
  getUserPostsInCategory_FAST,
  getMonthlyPostStats_FAST,
  optimizedPagination_FAST,
  rangeQueryOptimization_FAST,
  conditionalIndexUsage_FAST
};