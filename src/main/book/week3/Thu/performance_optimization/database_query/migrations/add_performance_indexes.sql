-- 성능 최적화를 위한 인덱스 추가 마이그레이션

-- 1. 사용자 검색 최적화
CREATE INDEX idx_users_firstname_lastname ON users (firstName, lastName);
CREATE INDEX idx_users_department_created ON users (departmentId, createdAt);

-- 2. 포스트 검색 및 정렬 최적화
CREATE INDEX idx_posts_created_at ON posts (createdAt DESC);
CREATE INDEX idx_posts_status_created_at ON posts (status, createdAt DESC);
CREATE INDEX idx_posts_user_category_status ON posts (userId, categoryId, status);
CREATE INDEX idx_posts_published_at ON posts (publishedAt DESC);
CREATE INDEX idx_posts_category_published ON posts (categoryId, publishedAt DESC);

-- 3. 댓글 관련 최적화
CREATE INDEX idx_comments_post_id ON comments (postId);
CREATE INDEX idx_comments_user_created ON comments (userId, createdAt DESC);
CREATE INDEX idx_comments_post_approved ON comments (postId, isApproved);
CREATE INDEX idx_comments_approved_created ON comments (isApproved, createdAt DESC);
CREATE INDEX idx_comments_parent_created ON comments (parentId, createdAt ASC);

-- 4. 전문 검색 인덱스 (MySQL/MariaDB)
CREATE FULLTEXT INDEX idx_posts_title_content ON posts (title, content);

-- 5. 부서 관련 최적화
CREATE INDEX idx_departments_name ON departments (name);
CREATE INDEX idx_departments_manager ON departments (managerId);

-- 6. 복합 쿼리 최적화를 위한 커버링 인덱스
CREATE INDEX idx_posts_covering_list ON posts (status, createdAt DESC, id, title, userId);
CREATE INDEX idx_comments_covering ON comments (postId, isApproved, createdAt, userId, content(100));

-- 7. 통계 쿼리 최적화
CREATE INDEX idx_posts_stats ON posts (createdAt, status, userId);
CREATE INDEX idx_comments_stats ON comments (createdAt, isApproved, postId);

-- 8. 페이지네이션 최적화 (커서 기반)
-- PRIMARY KEY는 이미 존재하므로 생략

-- 9. JSON 컬럼 인덱스 (MySQL 5.7+, 메타데이터가 있는 경우)
-- CREATE INDEX idx_posts_metadata ON posts ((CAST(metadata->>'$.category' AS CHAR(50))));

-- 10. 파티셔닝을 고려한 인덱스 (대용량 데이터용)
-- ALTER TABLE posts PARTITION BY RANGE (YEAR(createdAt)) (
--     PARTITION p2023 VALUES LESS THAN (2024),
--     PARTITION p2024 VALUES LESS THAN (2025),
--     PARTITION p2025 VALUES LESS THAN MAXVALUE
-- );

-- 인덱스 사용 통계 확인을 위한 뷰 생성 (MySQL)
CREATE VIEW index_usage_stats AS
SELECT 
    table_schema,
    table_name,
    index_name,
    'Used for queries' as usage_info
FROM information_schema.statistics 
WHERE table_schema = DATABASE()
ORDER BY table_name, index_name;

-- 실행 계획 분석을 위한 헬퍼 함수들

-- 1. 인덱스 효과성 체크를 위한 샘플 쿼리들
/*
-- 사용자 이름 검색 성능 체크
EXPLAIN SELECT * FROM users WHERE firstName LIKE 'John%' AND lastName LIKE 'Smith%';

-- 날짜 범위 포스트 검색 성능 체크  
EXPLAIN SELECT * FROM posts WHERE status = 'published' AND createdAt BETWEEN '2024-01-01' AND '2024-12-31' ORDER BY createdAt DESC LIMIT 20;

-- 복잡한 JOIN 쿼리 성능 체크
EXPLAIN SELECT p.title, u.username, COUNT(c.id) as comment_count 
FROM posts p 
JOIN users u ON p.userId = u.id 
LEFT JOIN comments c ON p.id = c.postId AND c.isApproved = true
WHERE p.status = 'published' 
GROUP BY p.id, p.title, u.username 
ORDER BY p.createdAt DESC LIMIT 10;
*/