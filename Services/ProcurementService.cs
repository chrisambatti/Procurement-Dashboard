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

        #region KPIs
        public async Task<KpiDto> GetKpisAsync(string? department)
        {
            using var conn = CreateConnection();

            var totalRevenue = await conn.ExecuteScalarAsync<decimal>("SELECT COALESCE(SUM(amount),0) FROM dbo.db_orders");
            var totalSuppliers = await conn.ExecuteScalarAsync<int>("SELECT COUNT(DISTINCT supplier_name) FROM dbo.db_orders");
            var totalOrders = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM dbo.db_orders");

            var topSupplierName = await conn.ExecuteScalarAsync<string>(
                @"SELECT TOP 1 supplier_name 
                  FROM dbo.db_orders 
                  GROUP BY supplier_name 
                  ORDER BY SUM(amount) DESC"
            );

            var topSpend = await conn.ExecuteScalarAsync<decimal>(
                @"SELECT TOP 1 SUM(amount) 
                  FROM dbo.db_orders 
                  GROUP BY supplier_name 
                  ORDER BY SUM(amount) DESC"
            );

            return new KpiDto
            {
                TotalSuppliers = totalSuppliers,
                TopSupplier = new TopSupplierInfo
                {
                    Name = topSupplierName ?? "N/A",
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
        #endregion

        #region Suppliers
        // Top 5 suppliers by spend
        public async Task<IEnumerable<SupplierSpendDto>> GetTop5SupplierSpendAsync(string? department)
        {
            using var conn = CreateConnection();

            var sql = @"
                WITH ranked AS (
                    SELECT TOP 5 
                         
                        supplier_name,
                        SUM(amount) AS Total
                    FROM dbo.db_orders
                
                    GROUP BY supplier_name
                    ORDER BY Total DESC
                ),
                grand AS (
                    SELECT SUM(Total) AS GrandTotal FROM ranked
                )
                SELECT 
                    r.supplier_name AS Name,
                    r.Total AS Total,
                    ROUND(r.Total / g.GrandTotal * 100, 1) AS Percentage
                FROM ranked r
                CROSS JOIN grand g
                ORDER BY r.Total DESC;";

            return await conn.QueryAsync<SupplierSpendDto>(sql);
        }

        // Top 5 suppliers by order count
        public async Task<IEnumerable<SupplierOrderCountDto>> GetTop5SupplierOrderCountAsync(string? department)
        {
            using var conn = CreateConnection();

            var sql = @"
                SELECT TOP 5
                       supplier_code AS Code,
                       supplier_name AS Name,
                       total_order_count AS Count,
                       total_order_value AS Total
                  FROM dbo.db_order_count
                 ORDER BY total_order_count DESC;";

            return await conn.QueryAsync<SupplierOrderCountDto>(sql);
        }

        // View All suppliers by order count
        public async Task<IEnumerable<SupplierOrderCountDto>> GetAllSupplierOrderCountAsync(string? department)
        {
            using var conn = CreateConnection();

            var sql = @"
                SELECT 
                       supplier_code AS Code,
                       supplier_name AS Name,
                       total_order_count AS Count,
                       total_order_value AS Total
                  FROM dbo.db_order_count
                 ORDER BY total_order_count DESC;";

            return await conn.QueryAsync<SupplierOrderCountDto>(sql);
        }

        // Supplier by total order value (all)
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

            return await conn.QueryAsync<SupplierValueDto>(sql);
        }
        #endregion

        #region Items
        // All items by order value
        // Get all items by order value (View All)
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

        // Get top 5 items by order value
        public async Task<IEnumerable<ItemValueDto>> GetTop5ItemsByOrderValueAsync(string? department)
        {
            using var conn = CreateConnection();

            var sql = @"
        SELECT TOP 5
            item_code AS Code,
            LTRIM(RTRIM(item_name)) AS Name,
            total_order_count AS [Order],
            total_order_value AS Total
        FROM dbo.db_item_count
        ORDER BY total_order_value DESC;";

            return await conn.QueryAsync<ItemValueDto>(sql);
        }
        #endregion
    }
}