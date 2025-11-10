const { User, Post, Comment, Department } = require('../models/associations');

// ✅ AFTER: N+1 문제 해결 - Eager Loading 사용

async function getBlogPostsWithAuthors_EFFICIENT() {
  console.log('✅ N+1 Problem Solved - AFTER');
  
  // 단 하나의 쿼리로 포스트와 작성자 정보를 함께 가져옴
  const posts = await Post.findAll({
    where: { status: 'published' },
    include: [{
      model: User,
      as: 'author',
      attributes: ['id', 'username', 'email']
    }],
    limit: 10
  });
  
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: {
      id: post.author.id,
      username: post.author.username,
      email: post.author.email
    },
    publishedAt: post.publishedAt
  }));
}

// ✅ 댓글과 댓글 작성자도 함께 가져오기 - 효율적인 방법
async function getPostsWithCommentsAndAuthors_EFFICIENT() {
  console.log('✅ Complex N+1 Problem Solved - Nested Eager Loading');
  
  // 단 하나의 쿼리로 포스트, 작성자, 댓글, 댓글 작성자를 모두 가져옴
  const posts = await Post.findAll({
    where: { status: 'published' },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      },
      {
        model: Comment,
        as: 'comments',
        where: { isApproved: true },
        required: false, // LEFT JOIN을 사용하여 댓글이 없는 포스트도 포함
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }],
        limit: 20
      }
    ],
    limit: 5
  });
  
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    author: {
      id: post.author.id,
      username: post.author.username
    },
    comments: post.comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.author.id,
        username: comment.author.username
      },
      createdAt: comment.createdAt
    })),
    commentCount: post.comments.length
  }));
}

// ✅ 부서별 사용자 목록을 효율적으로 가져오기
async function getDepartmentUsers_EFFICIENT() {
  console.log('✅ Department Users - Efficient Approach');
  
  // 단 하나의 쿼리로 부서와 사용자를 함께 가져옴
  const departments = await Department.findAll({
    include: [{
      model: User,
      as: 'employees',
      attributes: ['id', 'username', 'email'],
      required: false // 사용자가 없는 부서도 포함
    }]
  });
  
  return departments.map(dept => ({
    department: dept.name,
    userCount: dept.employees.length,
    users: dept.employees.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email
    }))
  }));
}

// ✅ 선택적 Eager Loading - 조건부로 관련 데이터 로드
async function getPostsConditional_EFFICIENT(includeComments = false, includeAuthor = true) {
  console.log('✅ Conditional Eager Loading');
  
  const includeOptions = [];
  
  if (includeAuthor) {
    includeOptions.push({
      model: User,
      as: 'author',
      attributes: ['id', 'username', 'firstName', 'lastName']
    });
  }
  
  if (includeComments) {
    includeOptions.push({
      model: Comment,
      as: 'comments',
      where: { isApproved: true },
      required: false,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });
  }
  
  const posts = await Post.findAll({
    where: { status: 'published' },
    include: includeOptions,
    limit: 10
  });
  
  return posts;
}

// ✅ 배치 로딩을 이용한 최적화 (대용량 데이터용)
async function getUsersWithPostCounts_EFFICIENT() {
  console.log('✅ Batch Loading with Aggregation');
  
  // 서브쿼리를 이용한 집계 데이터 포함
  const users = await User.findAll({
    attributes: [
      'id',
      'username',
      'email',
      [
        sequelize.literal('(SELECT COUNT(*) FROM posts WHERE posts.userId = User.id)'),
        'postCount'
      ]
    ],
    include: [{
      model: Department,
      as: 'department',
      attributes: ['name']
    }],
    limit: 50
  });
  
  return users;
}

module.exports = {
  getBlogPostsWithAuthors_EFFICIENT,
  getPostsWithCommentsAndAuthors_EFFICIENT,
  getDepartmentUsers_EFFICIENT,
  getPostsConditional_EFFICIENT,
  getUsersWithPostCounts_EFFICIENT
};