﻿using AutoMapper;
using IdentityServer4.EntityFramework.Entities;
using IdentityServerManager.UI.Data;
using IdentityServerManager.UI.Infrastructure;
using IdentityServerManager.UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            return View(Mapper.Map<IEnumerable<Client>, IEnumerable<ClientViewModel>>(clients));
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

            return await Task.FromResult(PartialView("_details", client.MapTo<ClientViewModel>()));
        }

        public IActionResult Create()
        {
            var clientVM = new ClientViewModel
            {
                IdentityProtocolTypes = new List<string> {
                    ProtocolTypes.OpenIdConnect,
                    ProtocolTypes.Saml2p,
                    ProtocolTypes.WsFederation }
            };
            return View(clientVM);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ClientViewModel clientVM)
        {
            if (ModelState.IsValid)
            {
                _context.Add(clientVM.MapTo<Client>());
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index), new { SuccessMessage = "Client successfully created." });
            }
            return View(clientVM);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var client = await _context.Clients.SingleOrDefaultAsync(m => m.Id == id);
            if (client == null)
            {
                return NotFound();
            }
            var clientVM = client.MapTo<ClientViewModel>();
            clientVM.IdentityProtocolTypes = new List<string> {
                    ProtocolTypes.OpenIdConnect,
                    ProtocolTypes.Saml2p,
                    ProtocolTypes.WsFederation };
            return View(clientVM);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ClientViewModel clientVM)
        {
            if (id != clientVM.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(clientVM.MapTo<Client>());
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ClientExists(clientVM.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index), new { SuccessMessage = "Client successfully edited." });
            }
            return View(clientVM);
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
