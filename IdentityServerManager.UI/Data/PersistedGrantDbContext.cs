using IdentityServer4.EntityFramework.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServerManager.UI.Data
{

    public class PersistedGrantDbContext : IdentityDbContext<IdentityUser>
    {
        public PersistedGrantDbContext() : base(new DbContextOptions<ConfigurationDbContext>())
        {
        }

        public PersistedGrantDbContext(DbContextOptions<ConfigurationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

        public DbSet<PersistedGrant> PersistedGrants { get; set; }

        public Task<int> SaveChangesAsync()
        {
            return base.SaveChangesAsync();
        }

    }

}
