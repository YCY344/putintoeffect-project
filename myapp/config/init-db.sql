CREATE DATABASE IF NOT EXISTS toolbox;
USE toolbox;

-- 部署进度表
CREATE TABLE deployments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SQL生成历史表
CREATE TABLE sql_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(255) NOT NULL,
  fields TEXT NOT NULL,
  conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO deployments (project_name, progress)
VALUES 
  ('电商平台', 75),
  ('CRM系统', 30),
  ('数据分析平台', 90);