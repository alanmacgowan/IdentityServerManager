using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IdentityServer4.Models;
using IdentityServerManager.UI.Data;
using IdentityServerManager.UI.Entities;
using IdentityServerManager.UI.Infrastructure;
using IdentityServerManager.UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
            var serverVM = server.MapTo<ServerViewModel>();
            try
            {
                var client = new HttpClient();
                var content = await client.GetAsync(server.Uri + ".well-known/openid-configuration");
                string responseBody = await content.Content.ReadAsStringAsync();
                serverVM.DiscoveryDocument = JsonConvert.DeserializeObject<DiscoveryDocument>(responseBody);
            }
            catch
            {

            }

            return View(serverVM);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ServerViewModel serverVM)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    serverVM.Uri = (serverVM.Uri.Substring(serverVM.Uri.Length - 1, 1) == "/" ? serverVM.Uri : serverVM.Uri + "/");
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