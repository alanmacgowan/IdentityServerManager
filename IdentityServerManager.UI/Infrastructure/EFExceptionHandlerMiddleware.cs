using IdentityServerManager.UI.Models;
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
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
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
            var message = "";
            var exception = context.Exception;
            if (exception.GetType() == typeof(DbUpdateException) && (exception.InnerException as SqlException)?.Number == 2601 || (exception.InnerException as SqlException)?.Number == 2627)
            {
                message = "Cannot insert duplicate Name.";
            }
            else if (exception.GetType() == typeof(DbUpdateConcurrencyException))
            {
                message = "The record you attempted to edit was modified by another user after you got the original value. The operation was canceled.";
            }

            context.Result = new JsonResult(new { ErrorMessage = message })
            {
                StatusCode = (int)HttpStatusCode.InternalServerError
            };


        }
    }

}
