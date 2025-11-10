const { User, Post, Comment, Department } = require('../models/associations');
const { Op } = require('sequelize');

// ❌ BEFORE: 누락된 인덱스로 인한 성능 문제

// 현재 테이블에는 다음 인덱스만 존재한다고 가정:
// users: email, username (unique indexes)
// posts: userId, status
// comments: (인덱스 없음)
// departments: (기본 id만)

async function searchUsersByName_SLOW() {
  console.log('❌ Missing Index - User Name Search');
  
  // firstName, lastName에 인덱스가 없어서 FULL TABLE SCAN 발생
  const users = await User.findAll({
    where: {
      [Op.or]: [
        { firstName: { [Op.like]: '%John%' } },
        { lastName: { [Op.like]: '%Smith%' } }
      ]
    },
    limit: 50
  });
  
  return users;
}

async function getPostsByDateRange_SLOW() {
  console.log('❌ Missing Index - Date Range Query');
  
  // createdAt에 인덱스가 없어서 날짜 범위 검색이 느림
  const posts = await Post.findAll({
    where: {
      createdAt: {
        [Op.between]: ['2024-01-01', '2024-12-31']
      },
      status: 'published' // status에는 인덱스가 있지만 복합 인덱스가 아님
    },
    order: [['createdAt', 'DESC']], // ORDER BY도 느림
    limit: 100
  });
  
  return posts;
}

async function getCommentsByPost_SLOW() {
  console.log('❌ Missing Index - Comment Foreign Key');
  
  // postId에 인덱스가 없어서 특정 포스트의 댓글 조회가 느림
  const comments = await Comment.findAll({
    where: {
      postId: 123,
      isApproved: true // isApproved에도 인덱스 없음
    },
    order: [['createdAt', 'ASC']] // createdAt 정렬도 느림
  });
  
  return comments;
}

async function searchPostsByContent_SLOW() {
  console.log('❌ Missing Index - Text Search');
  
  // content 컬럼에 전문 검색 인덱스가 없어서 LIKE 검색이 매우 느림
  const posts = await Post.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: '%React%' } },
        { content: { [Op.like]: '%JavaScript%' } }
      ],
      status: 'published'
    },
    limit: 20
  });
  
  return posts;
}

async function getDepartmentEmployeeCount_SLOW() {
  console.log('❌ Missing Index - Aggregation Query');
  
  // departmentId에 인덱스가 있어도 COUNT() 집계에 최적화된 인덱스가 없음
  const departments = await Department.findAll({
    attributes: [
      'id',
      'name',
      [sequelize.literal('(SELECT COUNT(*) FROM users WHERE departmentId = Department.id)'), 'employeeCount']
    ],
    having: sequelize.where(
      sequelize.literal('(SELECT COUNT(*) FROM users WHERE departmentId = Department.id)'),
      '>', 10
    ) // HAVING 절에서도 서브쿼리 실행으로 성능 저하
  });
  
  return departments;
}

async function getRecentCommentsByUser_SLOW() {
  console.log('❌ Missing Index - Composite Query');
  
  // userId, createdAt 복합 인덱스가 없어서 사용자별 최근 댓글 조회가 느림
  const recentComments = await Comment.findAll({
    where: {
      userId: 456,
      createdAt: {
        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 최근 30일
      }
    },
    order: [['createdAt', 'DESC']],
    limit: 10
  });
  
  return recentComments;
}

async function searchApprovedComments_SLOW() {
  console.log('❌ Missing Index - Boolean + Foreign Key');
  
  // postId와 isApproved 복합 인덱스가 없어서 승인된 댓글 검색이 느림
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

async function getUserPostsInCategory_SLOW() {
  console.log('❌ Missing Index - Multiple Conditions');
  
  // userId, categoryId, status에 대한 복합 인덱스가 없음
  const posts = await Post.findAll({
    where: {
      userId: 789,
      categoryId: 5,
      status: 'published',
      publishedAt: {
        [Op.not]: null
      }
    },
    order: [['publishedAt', 'DESC']]
  });
  
  return posts;
}

// ❌ 통계 쿼리에서 인덱스 부족으로 인한 성능 문제
async function getMonthlyPostStats_SLOW() {
  console.log('❌ Missing Index - Date-based Aggregation');
  
  const monthlyStats = await sequelize.query(`
    SELECT 
      DATE_FORMAT(createdAt, '%Y-%m') as month,
      COUNT(*) as postCount,
      COUNT(CASE WHEN status = 'published' THEN 1 END) as publishedCount
    FROM posts 
    WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
    ORDER BY month DESC
  `, {
    type: sequelize.QueryTypes.SELECT
  });
  
  // createdAt, status에 대한 적절한 인덱스가 없어서 느림
  return monthlyStats;
}

module.exports = {
  searchUsersByName_SLOW,
  getPostsByDateRange_SLOW,
  getCommentsByPost_SLOW,
  searchPostsByContent_SLOW,
  getDepartmentEmployeeCount_SLOW,
  getRecentCommentsByUser_SLOW,
  searchApprovedComments_SLOW,
  getUserPostsInCategory_SLOW,
  getMonthlyPostStats_SLOW
};