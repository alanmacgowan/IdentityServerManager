using IdentityServer4.EntityFramework.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServerManager.UI.Models
{
    public class ClientScopesViewModel
    {
        public int Id { get; set; }
        public string NextUrl { get; set; }
        public List<ClientScope> AllowedScopes { get; set; }
        [Display(Name = "Assigned")]
        public List<Resource> AssignedScopes { get; set; }
        [Display(Name = "Available")]
        public List<Resource> AvailableScopes { get; set; }
        public string AssignedResources { get; set; }
    }


    public class Resource
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
