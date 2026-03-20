-- ============================================================
-- Aegle Procurement Dashboard — Database Schema + Seed Data
-- Database: aegle_procurement
-- ============================================================

CREATE DATABASE IF NOT EXISTS aegle_procurement
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE aegle_procurement;

-- ──────────────────────────────────────────────
-- TABLES
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS suppliers (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  item_id     INT NOT NULL,
  department  ENUM('HR','Finance','Admin') NOT NULL,
  amount      DECIMAL(14,2) NOT NULL,
  status      ENUM('Completed','Pending','Cancelled') DEFAULT 'Completed',
  order_date  DATE NOT NULL,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (item_id)     REFERENCES items(id)
);

-- ──────────────────────────────────────────────
-- SEED: SUPPLIERS  (5 rows)
-- ──────────────────────────────────────────────

INSERT INTO suppliers (name) VALUES
  ('AL RAMA INT''L Trading L.L.C.'),          -- id 1
  ('Al Manhal General Land Trading'),          -- id 2
  ('Arabian Automobiles'),                     -- id 3
  ('Al Shafar Transp & Contg'),               -- id 4
  ('Adel Office Equipment Trading');           -- id 5

-- ──────────────────────────────────────────────
-- SEED: ITEMS  (10 rows)
-- ──────────────────────────────────────────────

INSERT INTO items (name) VALUES
  ('Spherical Beads'),                                -- id 1
  ('DI Circular Medium Duty'),                        -- id 2
  ('20-40mm Single Size Aggregate'),                  -- id 3
  ('200×250mm SS316 Identification'),                 -- id 4
  ('DN250 Carbon Steel Seamless Pipe'),               -- id 5
  ('Masonry Saw'),                                    -- id 6
  ('Crushed Sub Base'),                               -- id 7
  ('Granular Sub Base'),                              -- id 8
  ('40×20mm Crushed Aggregate'),                      -- id 9
  ('260×200mm Flush Cover');                          -- id 10

-- ──────────────────────────────────────────────
-- SEED: ORDERS  (36 rows)
-- Suppliers: 1=AL RAMA (top, ~$9M), 2=Al Manhal (~$7M),
--            3=Arabian (~$6M), 4=Al Shafar (~$4M), 5=Adel (~$3M)
-- Departments: HR / Finance / Admin
-- Statuses: mostly Completed, a few Pending/Cancelled
-- ──────────────────────────────────────────────

INSERT INTO orders (supplier_id, item_id, department, amount, status, order_date) VALUES

-- AL RAMA INT'L  (supplier 1) — total ≈ $9 M
(1, 1,  'HR',      3200000.00, 'Completed', '2025-04-10'),
(1, 3,  'Finance', 2800000.00, 'Completed', '2025-06-15'),
(1, 5,  'Admin',   1500000.00, 'Completed', '2025-08-20'),
(1, 7,  'HR',       900000.00, 'Pending',   '2025-10-05'),
(1, 9,  'Finance',  600000.00, 'Completed', '2026-01-12'),

-- Al Manhal  (supplier 2) — total ≈ $7 M
(2, 2,  'Admin',   2500000.00, 'Completed', '2025-05-08'),
(2, 4,  'HR',      2100000.00, 'Completed', '2025-07-22'),
(2, 6,  'Finance', 1400000.00, 'Completed', '2025-09-14'),
(2, 8,  'Admin',    600000.00, 'Cancelled', '2025-11-30'),
(2, 10, 'HR',       400000.00, 'Completed', '2026-02-18'),

-- Arabian Automobiles  (supplier 3) — total ≈ $6 M
(3, 1,  'Finance', 2200000.00, 'Completed', '2025-04-25'),
(3, 3,  'Admin',   1800000.00, 'Completed', '2025-07-10'),
(3, 5,  'HR',       900000.00, 'Completed', '2025-09-03'),
(3, 7,  'Finance',  700000.00, 'Pending',   '2025-12-20'),
(3, 9,  'Admin',    400000.00, 'Completed', '2026-01-28'),

-- Al Shafar Transp  (supplier 4) — total ≈ $4 M
(4, 2,  'HR',      1500000.00, 'Completed', '2025-05-18'),
(4, 4,  'Finance', 1200000.00, 'Completed', '2025-08-07'),
(4, 6,  'Admin',    800000.00, 'Completed', '2025-10-22'),
(4, 8,  'HR',       300000.00, 'Completed', '2026-01-05'),
(4, 10, 'Finance',  200000.00, 'Cancelled', '2026-02-14'),

-- Adel Office Equipment  (supplier 5) — total ≈ $3 M
(5, 1,  'Admin',   1100000.00, 'Completed', '2025-06-12'),
(5, 3,  'HR',       900000.00, 'Completed', '2025-08-28'),
(5, 5,  'Finance',  600000.00, 'Completed', '2025-11-15'),
(5, 7,  'Admin',    250000.00, 'Pending',   '2026-01-20'),
(5, 9,  'HR',       150000.00, 'Completed', '2026-03-01'),

-- Extra orders to bring completed-order count to 26 and spread items
(1, 2,  'Admin',    800000.00, 'Completed', '2025-05-30'),
(1, 10, 'Finance',  200000.00, 'Completed', '2025-12-11'),
(2, 3,  'HR',       500000.00, 'Completed', '2025-06-22'),
(2, 9,  'Admin',    500000.00, 'Completed', '2026-02-02'),
(3, 2,  'Finance',  750000.00, 'Completed', '2025-08-14'),
(3, 8,  'HR',       550000.00, 'Completed', '2026-01-08'),
(4, 1,  'Finance',  600000.00, 'Completed', '2025-09-29'),
(4, 5,  'Admin',    400000.00, 'Completed', '2025-12-03'),
(5, 4,  'HR',       400000.00, 'Completed', '2025-07-17'),
(5, 6,  'Finance',  300000.00, 'Completed', '2025-10-08'),
(5, 8,  'Admin',    300000.00, 'Completed', '2025-11-27');
