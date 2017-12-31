using AutoMapper;
using IdentityServer4.EntityFramework.Entities;
using IdentityServerManager.UI.Models;

namespace IdentityServerManager.UI.Infrastructure
{

    public class ClientsMappingProfile : Profile
    {
        public ClientsMappingProfile()
        {
            CreateMap<Client, ClientViewModel>().ReverseMap();
        }
    }
}
