using AutoMapper;
using IdentityServerManager.UI.Entities;
using IdentityServerManager.UI.Models;

namespace IdentityServerManager.UI.Infrastructure
{
    public class ServerMappingProfile : Profile
    {
        public ServerMappingProfile()
        {
            CreateMap<Server, ServerViewModel>().ReverseMap();
        }
    }
}
