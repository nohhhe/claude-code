const { User, Post, Comment, Department } = require('../models/associations');

// ❌ BEFORE: 비효율적인 Sequelize Loading 전략

// 1. ❌ 항상 Eager Loading - 불필요한 데이터도 함께 로드
async function getAllPostsWithEverything_INEFFICIENT() {
  console.log('❌ Over-Eager Loading - Always loading everything');
  
  const posts = await Post.findAll({
    include: [
      {
        model: User,
        as: 'author',
        include: [{
          model: Department,
          as: 'department' // 부서 정보가 필요없는 경우도 항상 로드
        }]
      },
      {
        model: Comment,
        as: 'comments',
        include: [{
          model: User,
          as: 'author' // 모든 댓글의 작성자 정보도 항상 로드
        }]
      }
    ]
  });
  
  // 실제로는 제목과 작성자 이름만 사용
  return posts.map(post => ({
    title: post.title,
    author: post.author.username
    // 댓글과 부서 정보는 사용하지 않지만 로드됨
  }));
}

// 2. ❌ 항상 Lazy Loading - N+1 문제 발생
async function getPostDetailsLazy_INEFFICIENT(postId) {
  console.log('❌ Always Lazy Loading - N+1 Problem');
  
  const post = await Post.findByPk(postId);
  
  // 필요할 때마다 개별 쿼리 실행
  const author = await post.getAuthor();
  const department = await author.getDepartment();
  const comments = await post.getComments({
    include: [{ model: User, as: 'author' }]
  });
  
  return {
    title: post.title,
    content: post.content,
    author: {
      name: author.username,
      department: department.name
    },
    commentCount: comments.length
  };
}

// 3. ❌ 잘못된 include 속성 사용
async function getPostsWithWrongIncludes_INEFFICIENT() {
  console.log('❌ Wrong Include Attributes');
  
  const posts = await Post.findAll({
    attributes: ['id', 'title'], // 포스트는 최소한만 선택
    include: [
      {
        model: User,
        as: 'author',
        // ❌ attributes를 지정하지 않아 모든 컬럼을 가져옴
        include: [{
          model: Department,
          as: 'department'
          // ❌ 여기도 모든 부서 정보를 가져옴
        }]
      },
      {
        model: Comment,
        as: 'comments',
        // ❌ 모든 댓글 데이터를 가져오지만 개수만 필요
      }
    ]
  });
  
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    authorName: post.author.username,
    commentCount: post.comments.length
  }));
}

// 4. ❌ 중첩된 include에서 불필요한 데이터 로드
async function getUsersWithAllPosts_INEFFICIENT() {
  console.log('❌ Nested Includes Loading Too Much');
  
  const users = await User.findAll({
    include: [
      {
        model: Department,
        as: 'department'
      },
      {
        model: Post,
        as: 'posts',
        // ❌ 모든 포스트를 가져오지만 최근 5개만 필요
        include: [
          {
            model: Comment,
            as: 'comments',
            // ❌ 모든 댓글을 가져오지만 승인된 것만 필요
            include: [{
              model: User,
              as: 'author'
              // ❌ 댓글 작성자의 모든 정보를 가져옴
            }]
          }
        ]
      }
    ]
  });
  
  return users.map(user => ({
    username: user.username,
    department: user.department?.name,
    recentPosts: user.posts.slice(0, 5).map(post => ({
      title: post.title,
      approvedCommentCount: post.comments.filter(c => c.isApproved).length
    }))
  }));
}

// 5. ❌ 조건부 로딩 없이 항상 동일한 include
async function getPostsByCategory_INEFFICIENT(categoryId, includeComments = false) {
  console.log('❌ No Conditional Loading');
  
  // includeComments 파라미터를 무시하고 항상 댓글을 로드
  const posts = await Post.findAll({
    where: { categoryId },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['username']
      },
      {
        model: Comment, // ❌ 조건과 관계없이 항상 로드
        as: 'comments',
        include: [{
          model: User,
          as: 'author',
          attributes: ['username']
        }]
      }
    ]
  });
  
  return posts;
}

// 6. ❌ 페이지네이션에서 include로 인한 잘못된 LIMIT
async function getPaginatedPostsWrong_INEFFICIENT(page = 1, limit = 10) {
  console.log('❌ Wrong Pagination with Includes');
  
  // include가 있을 때 LIMIT이 잘못 적용됨
  const posts = await Post.findAll({
    include: [
      {
        model: Comment,
        as: 'comments',
        // 여러 댓글이 있으면 포스트가 중복되어 나타남
      }
    ],
    limit, // ❌ 포스트 10개가 아니라 포스트+댓글 조합 10개가 반환될 수 있음
    offset: (page - 1) * limit
  });
  
  return posts;
}

// 7. ❌ 통계 데이터를 위한 불필요한 전체 로드
async function getUserStatistics_INEFFICIENT() {
  console.log('❌ Loading Full Data for Statistics');
  
  const users = await User.findAll({
    include: [
      {
        model: Post,
        as: 'posts',
        include: [
          {
            model: Comment,
            as: 'comments'
          }
        ]
      }
    ]
  });
  
  // 통계만 계산하는데 모든 데이터를 메모리에 로드
  return users.map(user => ({
    username: user.username,
    postCount: user.posts.length,
    totalComments: user.posts.reduce((sum, post) => sum + post.comments.length, 0),
    avgCommentsPerPost: user.posts.length > 0 
      ? user.posts.reduce((sum, post) => sum + post.comments.length, 0) / user.posts.length 
      : 0
  }));
}

module.exports = {
  getAllPostsWithEverything_INEFFICIENT,
  getPostDetailsLazy_INEFFICIENT,
  getPostsWithWrongIncludes_INEFFICIENT,
  getUsersWithAllPosts_INEFFICIENT,
  getPostsByCategory_INEFFICIENT,
  getPaginatedPostsWrong_INEFFICIENT,
  getUserStatistics_INEFFICIENT
};