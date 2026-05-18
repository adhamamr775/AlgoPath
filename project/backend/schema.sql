DROP DATABASE IF EXISTS algopath;
CREATE DATABASE algopath;
USE algopath;

-- -------------------------------------------------------------
-- 1. ACCOUNT AND OPERATOR STRUCTS
-- -------------------------------------------------------------
CREATE TABLE USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    system_role ENUM('Admin', 'Judge', 'Trainee') NOT NULL DEFAULT 'Trainee',
    current_rating INT NOT NULL DEFAULT 1500,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- 2. DIRECTORY ENTITIES (PROBLEMS & MATERIALS)
-- -------------------------------------------------------------
CREATE TABLE PROBLEMS (
    problem_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    problem_url VARCHAR(255) NOT NULL,
    difficulty_rating INT NOT NULL, /* e.g. 800, 1500, 1900 */
    platform VARCHAR(100) NOT NULL, /* Codeforces, LeetCode, YouTube, Docs */
    resource_type ENUM('practice', 'learning') NOT NULL DEFAULT 'practice',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TAGS (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- -------------------------------------------------------------
-- 3. INTERMEDIARY CLASSIFICATION MAPS
-- -------------------------------------------------------------
CREATE TABLE PROBLEM_TAG (
    problem_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (problem_id, tag_id),
    FOREIGN KEY (problem_id) REFERENCES PROBLEMS(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES TAGS(tag_id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 4. OPTIMISTIC TRADING CHECKLIST
-- -------------------------------------------------------------
CREATE TABLE USER_COMPLETED (
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, problem_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES PROBLEMS(problem_id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 5. IMMERSIVE TRANSACTION SEED STREAMS
-- -------------------------------------------------------------

-- Seed Operators (Passkey: password123)
INSERT INTO USERS (username, email, password_hash, system_role, current_rating) VALUES
('alice_cp', 'alice@example.com', '$2b$10$wYvDqWjKkR.lqNqL2/t8XeiA0h8wK1kHj0H5jHq9Rj0t9V/K4Z/aW', 'Trainee', 1600),
('bob_judge', 'bob@example.com', '$2b$10$wYvDqWjKkR.lqNqL2/t8XeiA0h8wK1kHj0H5jHq9Rj0t9V/K4Z/aW', 'Judge', 2100),
('charlie_admin', 'charlie@example.com', '$2b$10$wYvDqWjKkR.lqNqL2/t8XeiA0h8wK1kHj0H5jHq9Rj0t9V/K4Z/aW', 'Admin', 2400);

-- Seed System Tags
INSERT INTO TAGS (name) VALUES
('Implementation'), ('Math'), ('Greedy'), ('Dynamic Programming'), ('Graphs'), ('Binary Search');

-- Seed Curated Checklist Links (Both Videos and Problems unified here)
INSERT INTO PROBLEMS (title, problem_url, difficulty_rating, platform, resource_type) VALUES
('Watermelon', 'https://codeforces.com/problemset/problem/4/A', 800, 'Codeforces', 'practice'),
('Way Too Long Words', 'https://codeforces.com/problemset/problem/71/A', 800, 'Codeforces', 'practice'),
('Two Sum', 'https://leetcode.com/problems/two-sum/', 800, 'LeetCode', 'practice'),
('Kefa and First Steps', 'https://codeforces.com/problemset/problem/580/A', 900, 'Codeforces', 'practice'),
('Boredom', 'https://codeforces.com/problemset/problem/469/A', 1000, 'Codeforces', 'practice'),
('Dijkstra?', 'https://codeforces.com/problemset/problem/20/C', 1900, 'Codeforces', 'practice'),
('Binary Search', 'https://leetcode.com/problems/binary-search/', 700, 'LeetCode', 'practice'),
('What is Binary Search?', 'https://youtube.com/watch?v=1', 0, 'YouTube', 'learning'),
('Binary Search Implementation Details', 'https://youtube.com/watch?v=2', 0, 'YouTube', 'learning'),
('Introduction to Dijkstra', 'https://youtube.com/watch?v=3', 0, 'YouTube', 'learning');

-- Connect Everything to Target tags
INSERT INTO PROBLEM_TAG (problem_id, tag_id) VALUES
(1, 2),  -- Watermelon -> Math
(2, 1),  -- Way Too Long Words -> Implementation
(3, 1),  -- Two Sum -> Implementation
(4, 4),  -- Kefa and First Steps -> Dynamic Programming
(5, 4),  -- Boredom -> Dynamic Programming
(6, 5),  -- Dijkstra? -> Graphs
(7, 6),  -- Binary Search -> Binary Search
(8, 6),  -- Video: What is Binary Search? -> Binary Search
(9, 6),  -- Video: Binary Search Details -> Binary Search
(10, 5); -- Video: Intro to Dijkstra -> Graphs

-- Hydrate Active Checkmarks for user 'alice_cp' (user_id = 1)
INSERT INTO USER_COMPLETED (user_id, problem_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 7);