CREATE TABLE genres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO genres (name) VALUES
  ('Pop'),
  ('Traditional'),
  ('Rap'),
  ('Rock');