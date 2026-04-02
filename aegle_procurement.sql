-- SQL Server Schema + Seed Data for Aegle Procurement Dashboard
-- ──────────────────────────────────────────────
-- SEED: ORDERS
-- ──────────────────────────────────────────────

INSERT INTO orders (supplier_id, item_id, department, amount, status, order_date) VALUES

(1, 1,  'HR',      3200000.00, 'Completed', '2025-04-10'),
(1, 3,  'Finance', 2800000.00, 'Completed', '2025-06-15'),
(1, 5,  'Admin',   1500000.00, 'Completed', '2025-08-20'),
(1, 7,  'HR',       900000.00, 'Pending',   '2025-10-05'),
(1, 9,  'Finance',  600000.00, 'Completed', '2026-01-12'),

(2, 2,  'Admin',   2500000.00, 'Completed', '2025-05-08'),
(2, 4,  'HR',      2100000.00, 'Completed', '2025-07-22'),
(2, 6,  'Finance', 1400000.00, 'Completed', '2025-09-14'),
(2, 8,  'Admin',    600000.00, 'Cancelled', '2025-11-30'),
(2, 10, 'HR',       400000.00, 'Completed', '2026-02-18'),

(3, 1,  'Finance', 2200000.00, 'Completed', '2025-04-25'),
(3, 3,  'Admin',   1800000.00, 'Completed', '2025-07-10'),
(3, 5,  'HR',       900000.00, 'Completed', '2025-09-03'),
(3, 7,  'Finance',  700000.00, 'Pending',   '2025-12-20'),
(3, 9,  'Admin',    400000.00, 'Completed', '2026-01-28'),

(4, 2,  'HR',      1500000.00, 'Completed', '2025-05-18'),
(4, 4,  'Finance', 1200000.00, 'Completed', '2025-08-07'),
(4, 6,  'Admin',    800000.00, 'Completed', '2025-10-22'),
(4, 8,  'HR',       300000.00, 'Completed', '2026-01-05'),
(4, 10, 'Finance',  200000.00, 'Cancelled', '2026-02-14'),

(5, 1,  'Admin',   1100000.00, 'Completed', '2025-06-12'),
(5, 3,  'HR',       900000.00, 'Completed', '2025-08-28'),
(5, 5,  'Finance',  600000.00, 'Completed', '2025-11-15'),
(5, 7,  'Admin',    250000.00, 'Pending',   '2026-01-20'),
(5, 9,  'HR',       150000.00, 'Completed', '2026-03-01'),

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
GO