using AutoMapper;
using IdentityServer4.EntityFramework.Entities;
using IdentityServerManager.UI.Data;
using IdentityServerManager.UI.Infrastructure;
using IdentityServerManager.UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static IdentityServer4.IdentityServerConstants;

namespace IdentityServerManager.UI.Controllers
{
    public class ClientsController : Controller
    {
        private readonly ConfigurationDbContext _context;

        public ClientsController(ConfigurationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string SuccessMessage = null)
        {
            ViewData["SuccessMessage"] = SuccessMessage;
            var clients = await _context.Clients.ToListAsync();
            return View(Mapper.Map<IEnumerable<Client>, IEnumerable<ClientMainViewModel>>(clients));
        }

        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var client = await _context.Clients
                .SingleOrDefaultAsync(m => m.Id == id);
            if (client == null)
            {
                return NotFound();
            }

            return await Task.FromResult(PartialView("_details", client.MapTo<ClientMainViewModel>()));
        }

        public async Task<IActionResult> Main(int? id, string SuccessMessage = null)
        {
            ClientMainViewModel clientVM;
            if (id.HasValue)
            {
                var client = await _context.Clients.SingleOrDefaultAsync(m => m.Id == id);
                if (client == null)
                {
                    return NotFound();
                }
                clientVM = client.MapTo<ClientMainViewModel>();
            }
            else
            {
                clientVM = new ClientMainViewModel();
            }
            clientVM.IdentityProtocolTypes = new List<string> {
                    ProtocolTypes.OpenIdConnect,
                    ProtocolTypes.Saml2p,
                    ProtocolTypes.WsFederation };

            return View(clientVM);
        }

        [HttpPost]
        public async Task<IActionResult> Main([FromBody] ClientMainViewModel clientVM)
        {
            var client = clientVM.MapTo<Client>();
            if (clientVM.Id != 0)
            {
                _context.Update(client);
            }
            else
            {
                _context.Add(client);
            }
            await _context.SaveChangesAsync();
            return Ok();
        }


        public async Task<IActionResult> Scopes(int? id, string SuccessMessage = null)
        {
            ViewData["SuccessMessage"] = SuccessMessage;

            var client = await _context.Clients.Include(c => c.AllowedScopes).SingleOrDefaultAsync(c => c.Id == id);
            if (client == null)
            {
                return NotFound();
            }
            var clientVM = client.MapTo<ClientScopesViewModel>();
            var identityResources = _context.IdentityResources.Select(x => new Resource { Id = x.Name, Name = x.DisplayName });
            var apiResources = _context.ApiResources.Select(x => new Resource { Id = x.Name, Name = $"{x.Name} - {x.DisplayName}" });
            var assignedResources = clientVM.AllowedScopes.Select(x => new Resource { Id = x.Scope, Name = $"{x.Scope} - {x.Scope}" }).ToList();
            var availableResources = identityResources.Union(apiResources).Where(x => !assignedResources.Select(r => r.Id).Contains(x.Id)).ToList();

            clientVM.AssignedScopes = assignedResources;
            clientVM.AvailableScopes = availableResources;
            return View(clientVM);
        }

        [HttpPost]
        public async Task<IActionResult> Scopes([FromBody] ClientScopesViewModel clientVM)
        {
            var scopes = JsonConvert.DeserializeObject<List<Resource>>(clientVM.AssignedResources);
            var client = await _context.Clients.Include(c => c.AllowedScopes).SingleOrDefaultAsync(m => m.Id == clientVM.Id);
            _context.RemoveRange(client.AllowedScopes);
            client.AllowedScopes = scopes.Select(x => new ClientScope { Scope = x.Id, Client = client }).ToList();
            _context.Update(client);
            await _context.SaveChangesAsync();
            return Ok();
        }

        public async Task<IActionResult> Claims(int? id, string SuccessMessage = null)
        {
            ViewData["SuccessMessage"] = SuccessMessage;
            var client = await _context.Clients.SingleOrDefaultAsync(m => m.Id == id);
            if (client == null)
            {
                return NotFound();
            }
            var clientVM = client.MapTo<ClientClaimsViewModel>();
            return View(clientVM);
        }

        [HttpPost]
        public async Task<IActionResult> Claims([FromBody] ClientClaimsViewModel clientVM)
        {
            var client = await _context.Clients.SingleOrDefaultAsync(m => m.Id == clientVM.Id);
            client.Claims = clientVM.Claims;
            _context.Update(client);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var client = await _context.Clients.SingleOrDefaultAsync(m => m.Id == id);
            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index), new { SuccessMessage = "Client successfully deleted." });
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }
    }
}
