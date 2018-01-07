using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServerManager.UI.Infrastructure
{
    public class EFExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public EFExceptionFilterAttribute()
        {
        }

        public override void OnException(ExceptionContext context)
        {
            if ((context.Exception.InnerException as SqlException)?.Number == 2601 || (context.Exception.InnerException as SqlException)?.Number == 2627)
            {
                var result = new ViewResult { ViewName = context.ActionDescriptor.RouteValues["action"] };
                var modelMetadata = new EmptyModelMetadataProvider();
                result.ViewData = new ViewDataDictionary(modelMetadata, context.ModelState);
                result.ViewData.Add("ErrorMessage", "Cannot insert duplicate Name.");
                context.Exception = null;
                context.ExceptionHandled = true;
                context.Result = result;
            }

        }
    }

}
