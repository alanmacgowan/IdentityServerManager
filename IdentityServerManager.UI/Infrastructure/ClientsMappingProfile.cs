using AutoMapper;
using IdentityServer4.EntityFramework.Entities;
using IdentityServerManager.UI.Models;

namespace IdentityServerManager.UI.Infrastructure
{

    public class ClientsMappingProfile : Profile
    {
        public ClientsMappingProfile()
        {
            CreateMap<Client, ClientMainViewModel>().ReverseMap();
            CreateMap<Client, ClientScopesViewModel>().ReverseMap();
            CreateMap<Client, ClientClaimsViewModel>().ReverseMap();
        }
    }
}
