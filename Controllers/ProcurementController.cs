using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Aegle.Services;

namespace Aegle.Controllers
{
    /// <summary>
    /// Procurement API — all endpoints return JSON.
    /// Optional query-string: ?department=HR|Finance|Admin
    /// </summary>
    [ApiController]
    [Route("api/procurement")]
    public class ProcurementController : ControllerBase
    {
        private readonly ProcurementService _svc;

        public ProcurementController(ProcurementService svc)
        {
            _svc = svc;
        }

        #region KPIs

        // GET /api/procurement/kpis[?department=…]
        [HttpGet("kpis")]
        public async Task<IActionResult> GetKpis([FromQuery] string? department)
        {
            var result = await _svc.GetKpisAsync(department);
            return Ok(result);
        }

        #endregion

        #region Suppliers

        // GET /api/procurement/top5-supplier-spend[?department=…]
        [HttpGet("top5-supplier-spend")]
        public async Task<IActionResult> GetTop5SupplierSpend([FromQuery] string? department)
        {
            var result = await _svc.GetTop5SupplierSpendAsync(department);
            return Ok(result);
        }

        // GET /api/procurement/top5-supplier-order-count[?department=…]
        [HttpGet("top5-supplier-order-count")]
        public async Task<IActionResult> GetTop5SupplierOrderCount([FromQuery] string? department)
        {
            var result = await _svc.GetTop5SupplierOrderCountAsync(department);
            return Ok(result);
        }

        // GET /api/procurement/supplier-by-order-value[?department=…]
        [HttpGet("supplier-by-order-value")]
        public async Task<IActionResult> GetSupplierByOrderValue([FromQuery] string? department)
        {
            var result = await _svc.GetSupplierByOrderValueAsync(department);
            return Ok(result);
        }

        #endregion

        #region Items

        // View All items
        [HttpGet("items-by-order-value")]
        public async Task<IActionResult> GetAllItemsByOrderValue([FromQuery] string? department)
        {
            var result = await _svc.GetItemsByOrderValueAsync(department);
            return Ok(result);
        }

        // Top 5 items
        [HttpGet("top5-items-by-order-value")]
        public async Task<IActionResult> GetTop5ItemsByOrderValue([FromQuery] string? department)
        {
            var result = await _svc.GetTop5ItemsByOrderValueAsync(department);
            return Ok(result);
        }

        #endregion
    }
}