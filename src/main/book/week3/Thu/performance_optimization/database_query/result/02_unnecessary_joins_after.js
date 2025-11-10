const { User, Post, Comment, Department } = require('../models/associations');
const { Op, sequelize } = require('sequelize');

// ✅ AFTER: 불필요한 JOIN 제거 - 필요한 데이터만 조인

async function getUserPostsWithNecessaryJoins_EFFICIENT() {
  console.log('✅ Unnecessary JOINs Removed - AFTER');
  
  // 실제 필요한 데이터만 조인
  const posts = await Post.findAll({
    where: { status: 'published' },
    attributes: ['id', 'title', 'content'], // 필요한 컬럼만 선택
    include: [{
      model: User,
      as: 'author',
      attributes: ['username'] // 작성자 이름만 필요
      // ❌ 부서 정보 조인 제거
    }],
    // 댓글 수만 필요하므로 서브쿼리 사용
    attributes: [
      'id', 'title', 'content',
      [sequelize.literal('(SELECT COUNT(*) FROM comments WHERE postId = Post.id AND isApproved = true)'), 'commentCount']
    ],
    limit: 10
  });
  
  return posts.map(post => ({
    title: post.title,
    author: post.author.username,
    commentCount: post.dataValues.commentCount
  }));
}

// ✅ 복잡한 중첩 JOIN 최적화 - 필요한 데이터만 선택적으로 조인
async function getComplexDataOptimized_EFFICIENT() {
  console.log('✅ Over-Joining Problem Solved');
  
  // 기본 사용자 정보와 부서명만 조인
  const users = await User.findAll({
    attributes: ['id', 'username', 'email'],
    include: [{
      model: Department,
      as: 'department',
      attributes: ['name'] // 부서명만 필요
    }],
    // 포스트 개수는 서브쿼리로 계산
    attributes: [
      'id', 'username', 'email',
      [sequelize.literal('(SELECT COUNT(*) FROM posts WHERE userId = User.id)'), 'postCount']
    ],
    limit: 5
  });
  
  return users.map(user => ({
    username: user.username,
    department: user.department.name,
    postCount: user.dataValues.postCount
  }));
}

// ✅ 데이터베이스 레벨에서 필터링
async function getActiveUsersFiltered_EFFICIENT() {
  console.log('✅ Database-level Filtering');
  
  // EXISTS 서브쿼리를 사용하여 데이터베이스에서 필터링
  const users = await User.findAll({
    attributes: ['id', 'username', 'email'],
    where: {
      // 발행된 포스트가 있는 사용자만 필터링
      id: {
        [Op.in]: sequelize.literal(`
          (SELECT DISTINCT userId FROM posts WHERE status = 'published')
        `)
      }
    },
    // 발행된 포스트 수를 서브쿼리로 계산
    attributes: [
      'id', 'username', 'email',
      [
        sequelize.literal(`(
          SELECT COUNT(*) FROM posts 
          WHERE posts.userId = User.id AND posts.status = 'published'
        )`),
        'publishedPostCount'
      ]
    ]
  });
  
  return users.map(user => ({
    username: user.username,
    publishedPostCount: user.dataValues.publishedPostCount
  }));
}

// ✅ 집계 쿼리 최적화 - GROUP BY와 서브쿼리 활용
async function getDepartmentStats_EFFICIENT() {
  console.log('✅ Optimized Aggregation Queries');
  
  // 단일 집계 쿼리로 모든 통계 계산
  const departmentStats = await Department.findAll({
    attributes: [
      'id',
      'name',
      // 직원 수 계산
      [
        sequelize.literal('(SELECT COUNT(*) FROM users WHERE departmentId = Department.id)'),
        'employeeCount'
      ],
      // 총 포스트 수 계산
      [
        sequelize.literal(`(
          SELECT COUNT(*) FROM posts 
          JOIN users ON posts.userId = users.id 
          WHERE users.departmentId = Department.id
        )`),
        'totalPosts'
      ],
      // 총 댓글 수 계산
      [
        sequelize.literal(`(
          SELECT COUNT(*) FROM comments 
          JOIN posts ON comments.postId = posts.id
          JOIN users ON posts.userId = users.id 
          WHERE users.departmentId = Department.id AND comments.isApproved = true
        )`),
        'totalComments'
      ]
    ]
  });
  
  return departmentStats.map(dept => ({
    departmentName: dept.name,
    employeeCount: dept.dataValues.employeeCount,
    totalPosts: dept.dataValues.totalPosts,
    totalComments: dept.dataValues.totalComments
  }));
}

// ✅ 조건부 JOIN - 필요할 때만 JOIN 수행
async function getPostsWithConditionalJoins_EFFICIENT(includeAuthor = true, includeStats = false) {
  console.log('✅ Conditional JOINs');
  
  let queryOptions = {
    where: { status: 'published' },
    attributes: ['id', 'title', 'content', 'createdAt']
  };
  
  // 필요할 때만 작성자 정보 조인
  if (includeAuthor) {
    queryOptions.include = [{
      model: User,
      as: 'author',
      attributes: ['username', 'firstName', 'lastName']
    }];
  }
  
  // 통계 정보가 필요할 때만 서브쿼리 추가
  if (includeStats) {
    queryOptions.attributes.push(
      [sequelize.literal('(SELECT COUNT(*) FROM comments WHERE postId = Post.id)'), 'commentCount'],
      [sequelize.literal('(SELECT COUNT(*) FROM comments WHERE postId = Post.id AND createdAt > DATE_SUB(NOW(), INTERVAL 7 DAY))'), 'recentCommentCount']
    );
  }
  
  return await Post.findAll(queryOptions);
}

// ✅ 분할된 쿼리를 통한 메모리 효율성 개선
async function getUserDataSeparately_EFFICIENT(userId) {
  console.log('✅ Separate Queries for Large Datasets');
  
  // 1. 기본 사용자 정보
  const user = await User.findByPk(userId, {
    include: [{
      model: Department,
      as: 'department',
      attributes: ['name']
    }],
    attributes: ['id', 'username', 'email', 'firstName', 'lastName']
  });
  
  // 2. 필요한 경우에만 추가 통계 정보를 별도 쿼리로
  const [postStats] = await sequelize.query(`
    SELECT 
      COUNT(*) as totalPosts,
      COUNT(CASE WHEN status = 'published' THEN 1 END) as publishedPosts,
      COUNT(CASE WHEN createdAt > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as recentPosts
    FROM posts 
    WHERE userId = :userId
  `, {
    replacements: { userId },
    type: sequelize.QueryTypes.SELECT
  });
  
  return {
    ...user.toJSON(),
    stats: postStats[0]
  };
}

module.exports = {
  getUserPostsWithNecessaryJoins_EFFICIENT,
  getComplexDataOptimized_EFFICIENT,
  getActiveUsersFiltered_EFFICIENT,
  getDepartmentStats_EFFICIENT,
  getPostsWithConditionalJoins_EFFICIENT,
  getUserDataSeparately_EFFICIENT
};