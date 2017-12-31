using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServerManager.UI.Data;
using IdentityServerManager.UI.Entities;
using IdentityServerManager.UI.Infrastructure;
using IdentityServerManager.UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IdentityServerManager.UI.Controllers
{
    public class ServerController : Controller
    {

        private readonly ConfigurationDbContext _context;

        public ServerController(ConfigurationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string SuccessMessage = null)
        {
            ViewData["SuccessMessage"] = SuccessMessage;
            var server = await _context.Server.FirstOrDefaultAsync();
            if (server == null)
            {
                server = new Server();
            }
            return View(server.MapTo<ServerViewModel>());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ServerViewModel serverVM)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(serverVM.MapTo<Server>());
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Server.Any(s => s.Id == id))
                    {
                        _context.Add(serverVM.MapTo<Server>());
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index), new { SuccessMessage = "Server Data successfully edited." });
            }
            return View(serverVM);
        }
    }
}