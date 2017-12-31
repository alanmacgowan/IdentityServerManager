using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServerManager.UI.Models
{
    public class ServerViewModel
    {
        public int Id { get; set; }
        [Required]
        [StringLength(400)]
        public string Uri { get; set; }
        public string Description { get; set; }
    }
}
