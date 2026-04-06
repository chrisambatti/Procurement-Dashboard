namespace Aegle.Models
{
    // ── KPI ──
    public class TopSupplierInfo
    {
        public string Name { get; set; } = string.Empty;
        public decimal TotalSpend { get; set; }
    }

    public class KpiDto
    {
        public int TotalSuppliers { get; set; }
        public TopSupplierInfo TopSupplier { get; set; } = new();
        public decimal TotalRevenue { get; set; }
        public int TotalCompletedOrders { get; set; }
        public decimal SupplierGrowth { get; set; }
        public decimal TopSupplierGrowth { get; set; }
        public decimal RevenueGrowth { get; set; }
        public decimal OrdersGrowth { get; set; }
    }

    // ── Supplier Spend ──
    public class SupplierSpendDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public decimal Percentage { get; set; }
    }

    // ── Supplier Order Count ──
    public class SupplierOrderCountDto
    {
        public int Rank { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
        public string Code { get; set; } = string.Empty; // Add supplier_code
    }

    // ── Item Value ──
    public class ItemValueDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }
        public decimal Total { get; set; }
    }

    // ── Supplier Value (ranked) ──
    public class SupplierValueDto
    {
        public int Rank { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Total { get; set; }
    }
}