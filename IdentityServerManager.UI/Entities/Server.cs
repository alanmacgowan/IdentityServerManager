using System.ComponentModel.DataAnnotations;

namespace IdentityServerManager.UI.Entities
{
    public class Server
    {
        public int Id { get; set; }
        [Required]
        [StringLength(400)]
        public string Uri { get; set; }
        public string Description { get; set; }
    }
}
