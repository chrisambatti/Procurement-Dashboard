using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using MySqlConnector;          
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
            new MySqlConnection(_connectionString);


 public async Task<KpiDto> GetKpisAsync(string? department)
{
    using var conn = CreateConnection();

    // Build department filter
    var deptWhere = string.IsNullOrEmpty(department)
        ? "WHERE 1=1"
        : "WHERE o.department = @Department";

    // Total Revenue
    var revSql = $"SELECT COALESCE(SUM(amount),0) FROM orders o {deptWhere}";
    var totalRevenue = await conn.ExecuteScalarAsync<decimal>(revSql, new { Department = department });

    // Total Suppliers
    var supSql = $"SELECT COUNT(DISTINCT supplier_id) FROM orders o {deptWhere}";
    var totalSuppliers = await conn.ExecuteScalarAsync<int>(supSql, new { Department = department });

    // Total Completed Orders
    var ordSql = string.IsNullOrEmpty(department)
        ? "SELECT COUNT(*) FROM orders o WHERE o.status = 'Completed'"
        : "SELECT COUNT(*) FROM orders o WHERE o.status = 'Completed' AND o.department = @Department";
    var totalOrders = await conn.ExecuteScalarAsync<int>(ordSql, new { Department = department });

    // Top Supplier Name
    var topNameSql = $@"
        SELECT s.name
          FROM orders o
          JOIN suppliers s ON s.id = o.supplier_id
         {deptWhere}
         GROUP BY o.supplier_id, s.name
         ORDER BY SUM(o.amount) DESC
         LIMIT 1";
    var topName = await conn.ExecuteScalarAsync<string>(topNameSql, new { Department = department });

    // Top Supplier Spend
    var topSpendSql = $@"
        SELECT SUM(o.amount)
          FROM orders o
          JOIN suppliers s ON s.id = o.supplier_id
         {deptWhere}
         GROUP BY o.supplier_id
         ORDER BY SUM(o.amount) DESC
         LIMIT 1";
    var topSpend = await conn.ExecuteScalarAsync<decimal>(topSpendSql, new { Department = department });

    return new KpiDto
    {
        TotalSuppliers       = totalSuppliers,
        TopSupplier          = new TopSupplierInfo
        {
            Name       = topName ?? "",
            TotalSpend = topSpend
        },
        TotalRevenue         = totalRevenue,
        TotalCompletedOrders = totalOrders,
        SupplierGrowth       = 20.0m,
        TopSupplierGrowth    = 50.0m,
        RevenueGrowth        = 12.4m,
        OrdersGrowth         = -7.7m
    };
}


        public async Task<IEnumerable<SupplierSpendDto>> GetTop5SupplierSpendAsync(string? department)
        {
            using var conn = CreateConnection();

            var deptFilter = string.IsNullOrEmpty(department)
                ? ""
                : "AND o.department = @Department";

            var sql = $@"
                WITH ranked AS (
                    SELECT s.name,
                           SUM(o.amount) AS Total
                      FROM orders o
                      JOIN suppliers s ON s.id = o.supplier_id
                     WHERE 1=1 {deptFilter}
                     GROUP BY o.supplier_id, s.name
                     ORDER BY Total DESC
                     LIMIT 5
                ),
                grand AS (SELECT SUM(Total) AS GrandTotal FROM ranked)
                SELECT r.name AS Name,
                       r.Total AS Total,
                       ROUND(r.Total / g.GrandTotal * 100, 1) AS Percentage
                  FROM ranked r
                  CROSS JOIN grand g
                 ORDER BY r.Total DESC;";

            return await conn.QueryAsync<SupplierSpendDto>(sql, new { Department = department });
        }

       public async Task<IEnumerable<SupplierOrderCountDto>> GetTop5SupplierOrderCountAsync(string? department)
{
    using var conn = CreateConnection();

    var deptWhere = string.IsNullOrEmpty(department)
        ? "WHERE 1=1"
        : "WHERE o.department = @Department";

    var sql = $@"
        SELECT s.name AS Name,
               COUNT(*) AS Count
          FROM orders o
          JOIN suppliers s ON s.id = o.supplier_id
         {deptWhere}
         GROUP BY o.supplier_id, s.name
         ORDER BY Count DESC
         LIMIT 5;";

    var results = await conn.QueryAsync<SupplierOrderCountDto>(sql, new { Department = department });

    // Add rank manually in C#
    var ranked = results.Select((item, index) => new SupplierOrderCountDto
    {
        Rank  = index + 1,
        Name  = item.Name,
        Count = item.Count
    });

    return ranked;
}


        public async Task<IEnumerable<ItemValueDto>> GetItemsByOrderValueAsync(string? department)
        {
            using var conn = CreateConnection();

            var deptFilter = string.IsNullOrEmpty(department)
                ? ""
                : "AND o.department = @Department";

            var sql = $@"
                SELECT i.name AS Name,
                       COALESCE(SUM(o.amount), 0) AS Total
                  FROM items i
                  LEFT JOIN orders o ON o.item_id = i.id AND 1=1 {deptFilter}
                 GROUP BY i.id, i.name
                 ORDER BY Total DESC;";

            return await conn.QueryAsync<ItemValueDto>(sql, new { Department = department });
        }


public async Task<IEnumerable<SupplierValueDto>> GetSupplierByOrderValueAsync(string? department)
{
    using var conn = CreateConnection();

    var deptWhere = string.IsNullOrEmpty(department)
        ? "WHERE 1=1"
        : "WHERE o.department = @Department";

    var sql = $@"
        SELECT s.name AS Name,
               SUM(o.amount) AS Total
          FROM orders o
          JOIN suppliers s ON s.id = o.supplier_id
         {deptWhere}
         GROUP BY o.supplier_id, s.name
         ORDER BY Total DESC;";

    var results = await conn.QueryAsync<SupplierValueDto>(sql, new { Department = department });

    var ranked = results.Select((item, index) => new SupplierValueDto
    {
        Rank  = index + 1,
        Name  = item.Name,
        Total = item.Total
    });

    return ranked;
}

        public async Task<IEnumerable<ItemValueDto>> GetTop5ItemsByOrderValueAsync(string? department)
        {
            using var conn = CreateConnection();

            var deptFilter = string.IsNullOrEmpty(department)
                ? ""
                : "AND o.department = @Department";

            var sql = $@"
                SELECT i.name AS Name,
                       COALESCE(SUM(o.amount), 0) AS Total
                  FROM items i
                  LEFT JOIN orders o ON o.item_id = i.id AND 1=1 {deptFilter}
                 GROUP BY i.id, i.name
                 ORDER BY Total DESC
                 LIMIT 5;";

            return await conn.QueryAsync<ItemValueDto>(sql, new { Department = department });
        }
    }
}
