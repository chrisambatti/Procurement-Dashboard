using Microsoft.AspNetCore.Mvc;

namespace Aegle.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
    }
}