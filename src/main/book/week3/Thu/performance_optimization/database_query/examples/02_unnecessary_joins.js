const { User, Post, Comment, Department } = require('../models/associations');
const { Op } = require('sequelize');

// ❌ BEFORE: 불필요한 JOIN - 사용하지 않는 테이블까지 조인

async function getUserPostsWithUnnecessaryJoins_INEFFICIENT() {
  console.log('❌ Unnecessary JOINs - BEFORE');
  
  // 부서 정보가 필요하지 않은데도 조인함
  const posts = await Post.findAll({
    where: { status: 'published' },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email'],
        include: [{
          model: Department, // ❌ 부서 정보를 사용하지 않는데 조인
          as: 'department',
          attributes: ['name', 'description']
        }]
      },
      {
        model: Comment, // ❌ 댓글 수만 필요한데 모든 댓글을 가져옴
        as: 'comments',
        include: [{
          model: User, // ❌ 댓글 작성자 정보도 필요없는데 조인
          as: 'author',
          attributes: ['username']
        }]
      }
    ],
    limit: 10
  });
  
  // 실제로는 작성자 이름과 댓글 수만 사용
  return posts.map(post => ({
    title: post.title,
    author: post.author.username, // 부서 정보는 사용하지 않음
    commentCount: post.comments.length // 댓글 내용은 사용하지 않음
  }));
}

// ❌ 복잡한 중첩 JOIN으로 인한 성능 저하
async function getComplexDataWithOverJoining_INEFFICIENT() {
  console.log('❌ Over-Joining Problem');
  
  const users = await User.findAll({
    include: [
      {
        model: Department,
        as: 'department',
        include: [{
          model: User, // ❌ 부서의 모든 직원을 가져옴 (필요없는 데이터)
          as: 'employees',
          include: [{
            model: Post, // ❌ 모든 직원의 모든 포스트를 가져옴
            as: 'posts'
          }]
        }]
      },
      {
        model: Post,
        as: 'posts',
        include: [
          {
            model: Comment, // ❌ 모든 댓글을 가져옴
            as: 'comments',
            include: [{
              model: User, // ❌ 모든 댓글 작성자 정보까지
              as: 'author'
            }]
          }
        ]
      }
    ],
    limit: 5
  });
  
  // 실제로는 사용자 기본 정보와 부서명, 포스트 개수만 필요
  return users.map(user => ({
    username: user.username,
    department: user.department.name,
    postCount: user.posts.length
  }));
}

// ❌ 필터링이 필요한 곳에 모든 데이터를 가져오는 문제
async function getActiveUsersWithAllData_INEFFICIENT() {
  console.log('❌ Fetching All Data Instead of Filtering');
  
  const users = await User.findAll({
    include: [
      {
        model: Post,
        as: 'posts',
        // ❌ 모든 포스트를 가져온 후 애플리케이션에서 필터링
        include: [{
          model: Comment,
          as: 'comments' // ❌ 모든 댓글도 함께 가져옴
        }]
      }
    ]
  });
  
  // 애플리케이션 레벨에서 필터링 (비효율적)
  const activeUsers = users.filter(user => {
    const publishedPosts = user.posts.filter(post => post.status === 'published');
    return publishedPosts.length > 0;
  });
  
  return activeUsers.map(user => ({
    username: user.username,
    publishedPostCount: user.posts.filter(post => post.status === 'published').length
  }));
}

// ❌ 집계 데이터를 위한 불필요한 JOIN
async function getDepartmentStats_INEFFICIENT() {
  console.log('❌ Unnecessary JOINs for Aggregation');
  
  // 모든 관련 데이터를 가져온 후 애플리케이션에서 집계
  const departments = await Department.findAll({
    include: [{
      model: User,
      as: 'employees',
      include: [{
        model: Post,
        as: 'posts',
        include: [{
          model: Comment,
          as: 'comments'
        }]
      }]
    }]
  });
  
  // 애플리케이션에서 계산 (메모리 사용량 증가)
  return departments.map(dept => ({
    departmentName: dept.name,
    employeeCount: dept.employees.length,
    totalPosts: dept.employees.reduce((sum, emp) => sum + emp.posts.length, 0),
    totalComments: dept.employees.reduce((sum, emp) => 
      sum + emp.posts.reduce((postSum, post) => postSum + post.comments.length, 0), 0
    )
  }));
}

module.exports = {
  getUserPostsWithUnnecessaryJoins_INEFFICIENT,
  getComplexDataWithOverJoining_INEFFICIENT,
  getActiveUsersWithAllData_INEFFICIENT,
  getDepartmentStats_INEFFICIENT
};