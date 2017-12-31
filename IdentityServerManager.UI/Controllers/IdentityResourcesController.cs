﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using IdentityServer4.EntityFramework.Entities;
using IdentityServerManager.UI.Data;
using IdentityServerManager.UI.Models;
using AutoMapper;
using IdentityServerManager.UI.Infrastructure;

namespace IdentityServerManager.UI.Controllers
{
    public class IdentityResourcesController : Controller
    {
        private readonly ConfigurationDbContext _context;

        public IdentityResourcesController(ConfigurationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string SuccessMessage = null)
        {
            ViewData["SuccessMessage"] = SuccessMessage;
            var identityResource = await _context.IdentityResources.ToListAsync();
            return View(Mapper.Map<IEnumerable<IdentityResource>, IEnumerable<IdentityResourceViewModel>>(identityResource));
        }

        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var identityResource = await _context.IdentityResources
                .SingleOrDefaultAsync(m => m.Id == id);
            if (identityResource == null)
            {
                return NotFound();
            }

            return await Task.FromResult(PartialView("_details", identityResource.MapTo<IdentityResourceViewModel>()));
        }

        public IActionResult Create()
        {
            return View(new IdentityResourceViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(IdentityResourceViewModel identityResourceVM)
        {
            if (ModelState.IsValid)
            {
                _context.Add(identityResourceVM.MapTo<IdentityResource>());
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index), new { SuccessMessage = "Identity Resource successfully created." });
            }
            return View(identityResourceVM);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var identityResource = await _context.IdentityResources.SingleOrDefaultAsync(m => m.Id == id);
            if (identityResource == null)
            {
                return NotFound();
            }
            return View(identityResource.MapTo<IdentityResourceViewModel>());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, IdentityResourceViewModel identityResourceVM)
        {
            if (id != identityResourceVM.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(identityResourceVM.MapTo<IdentityResource>());
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!IdentityResourceExists(identityResourceVM.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index), new { SuccessMessage = "Identity Resource successfully edited." } );
            }
            return View(identityResourceVM);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var identityResource = await _context.IdentityResources.SingleOrDefaultAsync(m => m.Id == id);
            _context.IdentityResources.Remove(identityResource);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index), new { SuccessMessage = "Identity Resource successfully deleted." });
        }

        private bool IdentityResourceExists(int id)
        {
            return _context.IdentityResources.Any(e => e.Id == id);
        }
    }
}
