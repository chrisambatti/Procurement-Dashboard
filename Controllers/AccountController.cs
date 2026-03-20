using Microsoft.AspNetCore.Mvc;

namespace Aegle.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
    }
}