using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServerManager.UI.Controllers
{
    public class ErrorController : Controller
    {

        public IActionResult Handle()
        {
            if (Response.StatusCode == StatusCodes.Status404NotFound)
            {
                return View("NotFound");
            }

            return View("Error");
        }

    }
}
