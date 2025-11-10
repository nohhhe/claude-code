const { User, Post, Comment } = require('../models/associations');

// ❌ BEFORE: N+1 Problem - 비효율적인 쿼리
// 10개의 포스트가 있으면 1 + 10 = 11개의 쿼리가 실행됨

async function getBlogPostsWithAuthors_INEFFICIENT() {
  console.log('❌ N+1 Problem Example - BEFORE');
  
  // 1. 모든 포스트를 가져오는 첫 번째 쿼리
  const posts = await Post.findAll({
    where: { status: 'published' },
    limit: 10
  });
  
  const result = [];
  
  // 2. 각 포스트마다 작성자 정보를 가져오는 추가 쿼리 (N번)
  for (const post of posts) {
    // 매번 개별 쿼리가 실행됨!
    const author = await User.findByPk(post.userId);
    
    result.push({
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: author.id,
        username: author.username,
        email: author.email
      },
      publishedAt: post.publishedAt
    });
  }
  
  return result;
}

// ❌ 댓글과 댓글 작성자도 함께 가져오는 경우 - 더 심각한 N+1 문제
async function getPostsWithCommentsAndAuthors_VERY_INEFFICIENT() {
  console.log('❌ Severe N+1 Problem - Comments and Authors');
  
  const posts = await Post.findAll({
    where: { status: 'published' },
    limit: 5
  });
  
  const result = [];
  
  for (const post of posts) {
    // 포스트 작성자 쿼리
    const author = await User.findByPk(post.userId);
    
    // 포스트별 댓글 쿼리
    const comments = await Comment.findAll({
      where: { postId: post.id, isApproved: true },
      limit: 20
    });
    
    const commentsWithAuthors = [];
    
    // 각 댓글별 작성자 쿼리
    for (const comment of comments) {
      const commentAuthor = await User.findByPk(comment.userId);
      commentsWithAuthors.push({
        id: comment.id,
        content: comment.content,
        author: {
          id: commentAuthor.id,
          username: commentAuthor.username
        },
        createdAt: comment.createdAt
      });
    }
    
    result.push({
      id: post.id,
      title: post.title,
      author: {
        id: author.id,
        username: author.username
      },
      comments: commentsWithAuthors,
      commentCount: comments.length
    });
  }
  
  // 5개 포스트 + 각 포스트당 20개 댓글 = 1 + 5 + 5 + (5 × 20) = 111개 쿼리!
  return result;
}

// ❌ 부서별 사용자 목록을 가져올 때의 N+1 문제
async function getDepartmentUsers_INEFFICIENT() {
  console.log('❌ Department Users N+1 Problem');
  
  // 1. 모든 부서를 가져오는 쿼리
  const departments = await Department.findAll();
  
  const result = [];
  
  // 2. 각 부서별로 사용자를 가져오는 쿼리 (N번)
  for (const dept of departments) {
    const users = await User.findAll({
      where: { departmentId: dept.id }
    });
    
    result.push({
      department: dept.name,
      userCount: users.length,
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email
      }))
    });
  }
  
  return result;
}

module.exports = {
  getBlogPostsWithAuthors_INEFFICIENT,
  getPostsWithCommentsAndAuthors_VERY_INEFFICIENT,
  getDepartmentUsers_INEFFICIENT
};