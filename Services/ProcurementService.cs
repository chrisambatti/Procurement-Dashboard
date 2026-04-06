using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using Aegle.Models;

namespace Aegle.Services
{
    public class ProcurementService
    {
        private readonly string _connectionString;

        public ProcurementService(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection CreateConnection() =>
            new SqlConnection(_connectionString);

        public async Task<KpiDto> GetKpisAsync(string? department)
        {
            using var conn = CreateConnection();

            // Total Revenue
            var revSql = "SELECT COALESCE(SUM(amount),0) FROM dbo.db_orders";
            var totalRevenue = await conn.ExecuteScalarAsync<decimal>(revSql);

            // Total Suppliers (distinct supplier_id)
            var supSql = "SELECT COUNT(DISTINCT supplier_name) FROM dbo.db_orders";
            var totalSuppliers = await conn.ExecuteScalarAsync<int>(supSql);

            // Total Orders
            var ordSql = "SELECT COUNT(*) FROM dbo.db_orders";
            var totalOrders = await conn.ExecuteScalarAsync<int>(ordSql);

            // Top Supplier by spend
            var topSpendSql = @"
                SELECT TOP 1 supplier_name
                FROM dbo.db_orders
                GROUP BY supplier_name
                ORDER BY SUM(amount) DESC";
            var topSupplierCode = await conn.ExecuteScalarAsync<string>(topSpendSql);

            // Top Supplier spend amount
            var topAmountSql = @"
                SELECT TOP 1 SUM(amount)
                FROM dbo.db_orders
                GROUP BY supplier_name
                ORDER BY SUM(amount) DESC";
            var topSpend = await conn.ExecuteScalarAsync<decimal>(topAmountSql);

            return new KpiDto
            {
                TotalSuppliers = totalSuppliers,
                TopSupplier = new TopSupplierInfo
                {
                    Name = topSupplierCode ?? "N/A",
                    TotalSpend = topSpend
                },
                TotalRevenue = totalRevenue,
                TotalCompletedOrders = totalOrders,
                SupplierGrowth = 20.0m,
                TopSupplierGrowth = 50.0m,
                RevenueGrowth = 12.4m,
                OrdersGrowth = -7.7m
            };
        }

        public async Task<IEnumerable<SupplierSpendDto>> GetTop5SupplierSpendAsync(string? department)
        {
            using var conn = CreateConnection();

            var sql = @"
                WITH ranked AS (
                    SELECT TOP 5 supplier_name,
                           SUM(amount) AS Total
                      FROM dbo.db_orders
                     GROUP BY supplier_name
                     ORDER BY Total DESC
                ),
                grand AS (SELECT SUM(Total) AS GrandTotal FROM ranked)
                SELECT r.supplier_name AS Name,
                       r.Total AS Total,
                       ROUND(r.Total / g.GrandTotal * 100, 1) AS Percentage
                  FROM ranked r
                  CROSS JOIN grand g
                 ORDER BY r.Total DESC;";

            return await conn.QueryAsync<SupplierSpendDto>(sql);
        }

        public async Task<IEnumerable<SupplierOrderCountDto>> GetTop5SupplierOrderCountAsync(string? department)
        {
            using var conn = CreateConnection();

            var sql = @"
                SELECT ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS Rank,
                       supplier_name AS Name,
                       COUNT(*) AS Count
                  FROM dbo.db_orders
                 GROUP BY supplier_name
                 ORDER BY Count DESC
                 OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;";

            var results = await conn.QueryAsync<SupplierOrderCountDto>(sql);

            return results;
        }

        public async Task<IEnumerable<ItemValueDto>> GetItemsByOrderValueAsync(string? department)
        {
            using var conn = CreateConnection();

            var sql = @"
        SELECT 
            item_code AS Code,
            LTRIM(RTRIM(item_name)) AS Name,
            total_order_count AS [Order],
            total_order_value AS Total
        FROM dbo.db_item_count
        ORDER BY total_order_value DESC;";

            return await conn.QueryAsync<ItemValueDto>(sql);
        }

        public async Task<IEnumerable<SupplierValueDto>> GetSupplierByOrderValueAsync(string? department)
        {
            using var conn = CreateConnection();

            var sql = @"
                SELECT ROW_NUMBER() OVER (ORDER BY SUM(amount) DESC) AS Rank,
                       supplier_name AS Name,
                       SUM(amount) AS Total
                  FROM dbo.db_orders
                 GROUP BY supplier_name
                 ORDER BY Total DESC;";

            var results = await conn.QueryAsync<SupplierValueDto>(sql);

            return results;
        }

        public async Task<IEnumerable<ItemValueDto>> GetTop5ItemsByOrderValueAsync(string? department)
        {
            using var conn = CreateConnection();

            var sql = @"
                SELECT supplier_name AS Name,
                       COALESCE(SUM(amount), 0) AS Total
                  FROM dbo.db_orders
                 GROUP BY supplier_name
                 ORDER BY Total DESC
                 OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;";

            return await conn.QueryAsync<ItemValueDto>(sql);
        }
    }
}