const { User, Post, Comment, Department } = require('../models/associations');
const { Op } = require('sequelize');

// ✅ AFTER: 최적화된 Sequelize Loading 전략

// 1. ✅ 선택적 Eager Loading - 필요한 데이터만 로드
async function getAllPostsOptimized_EFFICIENT(includeAuthor = true, includeDepartment = false) {
  console.log('✅ Selective Eager Loading');
  
  const includeOptions = [];
  
  if (includeAuthor) {
    const authorInclude = {
      model: User,
      as: 'author',
      attributes: ['id', 'username'] // 필요한 속성만 선택
    };
    
    if (includeDepartment) {
      authorInclude.include = [{
        model: Department,
        as: 'department',
        attributes: ['name'] // 부서명만 필요
      }];
    }
    
    includeOptions.push(authorInclude);
  }
  
  const posts = await Post.findAll({
    attributes: ['id', 'title', 'createdAt'], // 필요한 컬럼만 선택
    include: includeOptions,
    where: { status: 'published' },
    limit: 20
  });
  
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    author: includeAuthor ? post.author.username : null,
    department: (includeAuthor && includeDepartment) ? post.author.department?.name : null,
    createdAt: post.createdAt
  }));
}

// 2. ✅ 스마트한 Lazy Loading - 필요할 때만 개별 로드
async function getPostDetailsLazy_EFFICIENT(postId, includeComments = false) {
  console.log('✅ Smart Lazy Loading');
  
  // 기본 포스트 정보와 작성자를 함께 로드 (자주 함께 사용됨)
  const post = await Post.findByPk(postId, {
    include: [{
      model: User,
      as: 'author',
      attributes: ['username'],
      include: [{
        model: Department,
        as: 'department',
        attributes: ['name']
      }]
    }]
  });
  
  if (!post) return null;
  
  const result = {
    title: post.title,
    content: post.content,
    author: {
      name: post.author.username,
      department: post.author.department.name
    }
  };
  
  // 댓글이 필요한 경우에만 별도 로드
  if (includeComments) {
    const comments = await Comment.findAll({
      where: { 
        postId: postId,
        isApproved: true 
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['username']
      }],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    
    result.comments = comments.map(comment => ({
      content: comment.content,
      author: comment.author.username,
      createdAt: comment.createdAt
    }));
  }
  
  return result;
}

// 3. ✅ 올바른 attributes 사용
async function getPostsWithCorrectIncludes_EFFICIENT() {
  console.log('✅ Correct Include Attributes');
  
  const posts = await Post.findAll({
    attributes: ['id', 'title', 'createdAt'], // 필요한 컬럼만
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username'], // 작성자 정보 최소화
        include: [{
          model: Department,
          as: 'department',
          attributes: ['name'] // 부서명만
        }]
      }
    ],
    // 댓글 수는 서브쿼리로 계산
    attributes: [
      'id', 'title', 'createdAt',
      [
        sequelize.literal('(SELECT COUNT(*) FROM comments WHERE postId = Post.id AND isApproved = true)'),
        'commentCount'
      ]
    ],
    where: { status: 'published' },
    limit: 20
  });
  
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    authorName: post.author.username,
    departmentName: post.author.department.name,
    commentCount: post.dataValues.commentCount,
    createdAt: post.createdAt
  }));
}

// 4. ✅ 최적화된 중첩 include - 필터링과 제한 적용
async function getUsersWithRecentPosts_EFFICIENT() {
  console.log('✅ Optimized Nested Includes');
  
  const users = await User.findAll({
    attributes: ['id', 'username', 'email'],
    include: [
      {
        model: Department,
        as: 'department',
        attributes: ['name']
      },
      {
        model: Post,
        as: 'posts',
        attributes: ['id', 'title', 'createdAt'],
        where: {
          status: 'published',
          createdAt: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 최근 30일
          }
        },
        required: false, // LEFT JOIN으로 포스트가 없는 사용자도 포함
        limit: 5, // 최근 5개 포스트만
        order: [['createdAt', 'DESC']],
        // 승인된 댓글 수만 서브쿼리로 계산
        attributes: [
          'id', 'title', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM comments WHERE postId = posts.id AND isApproved = true)'),
            'approvedCommentCount'
          ]
        ]
      }
    ],
    limit: 50
  });
  
  return users.map(user => ({
    username: user.username,
    email: user.email,
    department: user.department?.name,
    recentPosts: user.posts.map(post => ({
      id: post.id,
      title: post.title,
      createdAt: post.createdAt,
      commentCount: post.dataValues.approvedCommentCount
    }))
  }));
}

// 5. ✅ 조건부 loading 구현
async function getPostsByCategory_EFFICIENT(categoryId, options = {}) {
  console.log('✅ Conditional Loading Implementation');
  
  const {
    includeComments = false,
    includeAuthorDepartment = false,
    commentsLimit = 10
  } = options;
  
  const includeArray = [
    {
      model: User,
      as: 'author',
      attributes: ['id', 'username'],
      ...(includeAuthorDepartment && {
        include: [{
          model: Department,
          as: 'department',
          attributes: ['name']
        }]
      })
    }
  ];
  
  if (includeComments) {
    includeArray.push({
      model: Comment,
      as: 'comments',
      attributes: ['id', 'content', 'createdAt'],
      where: { isApproved: true },
      required: false,
      limit: commentsLimit,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'author',
        attributes: ['username']
      }]
    });
  }
  
  return await Post.findAll({
    where: { 
      categoryId,
      status: 'published'
    },
    include: includeArray,
    order: [['createdAt', 'DESC']]
  });
}

// 6. ✅ 올바른 페이지네이션 with includes
async function getPaginatedPostsCorrect_EFFICIENT(page = 1, limit = 10) {
  console.log('✅ Correct Pagination with Includes');
  
  // findAndCountAll과 서브쿼리를 사용하여 정확한 페이지네이션
  const { count, rows } = await Post.findAndCountAll({
    attributes: ['id', 'title', 'content', 'createdAt'],
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['username']
      }
    ],
    where: { status: 'published' },
    distinct: true, // 중복 제거
    limit,
    offset: (page - 1) * limit,
    order: [['createdAt', 'DESC']]
  });
  
  // 댓글은 별도 쿼리로 효율적으로 로드
  const postIds = rows.map(post => post.id);
  const commentCounts = await Comment.findAll({
    attributes: [
      'postId',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: {
      postId: { [Op.in]: postIds },
      isApproved: true
    },
    group: ['postId']
  });
  
  const commentCountMap = new Map(
    commentCounts.map(item => [item.postId, item.dataValues.count])
  );
  
  return {
    posts: rows.map(post => ({
      id: post.id,
      title: post.title,
      author: post.author.username,
      commentCount: commentCountMap.get(post.id) || 0,
      createdAt: post.createdAt
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      hasNextPage: page < Math.ceil(count / limit),
      hasPrevPage: page > 1
    }
  };
}

// 7. ✅ 통계 데이터를 위한 최적화된 집계 쿼리
async function getUserStatistics_EFFICIENT() {
  console.log('✅ Optimized Statistics with Aggregation');
  
  // 집계 함수를 사용하여 한 번의 쿼리로 통계 계산
  const userStats = await User.findAll({
    attributes: [
      'id',
      'username',
      [
        sequelize.literal('(SELECT COUNT(*) FROM posts WHERE userId = User.id)'),
        'postCount'
      ],
      [
        sequelize.literal(`(
          SELECT COUNT(*) 
          FROM comments c 
          JOIN posts p ON c.postId = p.id 
          WHERE p.userId = User.id AND c.isApproved = true
        )`),
        'totalComments'
      ],
      [
        sequelize.literal(`(
          SELECT ROUND(AVG(comment_count), 2)
          FROM (
            SELECT COUNT(c.id) as comment_count
            FROM posts p
            LEFT JOIN comments c ON p.id = c.postId AND c.isApproved = true
            WHERE p.userId = User.id
            GROUP BY p.id
          ) as post_comments
        )`),
        'avgCommentsPerPost'
      ]
    ],
    where: {
      // 포스트가 있는 사용자만
      id: {
        [Op.in]: sequelize.literal('(SELECT DISTINCT userId FROM posts)')
      }
    }
  });
  
  return userStats.map(user => ({
    username: user.username,
    postCount: user.dataValues.postCount,
    totalComments: user.dataValues.totalComments,
    avgCommentsPerPost: user.dataValues.avgCommentsPerPost || 0
  }));
}

// 8. ✅ 캐싱과 함께 사용하는 최적화된 로딩
async function getCachedPostsWithAuthors_EFFICIENT(useCache = true) {
  console.log('✅ Cache-Optimized Loading');
  
  const cacheKey = 'recent_posts_with_authors';
  
  // 캐시 확인 (Redis 등 사용 가능)
  if (useCache) {
    // const cached = await redis.get(cacheKey);
    // if (cached) return JSON.parse(cached);
  }
  
  const posts = await Post.findAll({
    attributes: ['id', 'title', 'content', 'createdAt'],
    include: [{
      model: User,
      as: 'author',
      attributes: ['id', 'username']
    }],
    where: {
      status: 'published',
      createdAt: {
        [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // 최근 24시간
      }
    },
    order: [['createdAt', 'DESC']],
    limit: 50
  });
  
  const result = posts.map(post => ({
    id: post.id,
    title: post.title,
    author: post.author.username,
    createdAt: post.createdAt
  }));
  
  // 캐시 저장
  if (useCache) {
    // await redis.setex(cacheKey, 300, JSON.stringify(result)); // 5분 캐시
  }
  
  return result;
}

module.exports = {
  getAllPostsOptimized_EFFICIENT,
  getPostDetailsLazy_EFFICIENT,
  getPostsWithCorrectIncludes_EFFICIENT,
  getUsersWithRecentPosts_EFFICIENT,
  getPostsByCategory_EFFICIENT,
  getPaginatedPostsCorrect_EFFICIENT,
  getUserStatistics_EFFICIENT,
  getCachedPostsWithAuthors_EFFICIENT
};