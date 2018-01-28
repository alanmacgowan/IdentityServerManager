using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Data.SqlClient;
using System.Net;
using System.Threading.Tasks;

namespace IdentityServerManager.UI.Infrastructure
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError;
            var message = "There was an error processing the operation.";
            if (exception.GetType() == typeof(DbUpdateException) && (exception.InnerException as SqlException)?.Number == 2601 || (exception.InnerException as SqlException)?.Number == 2627)
            {
                message = "Cannot insert duplicate Name.";
            }
            else if (exception.GetType() == typeof(DbUpdateConcurrencyException))
            {
                message = "The record you attempted to edit was modified by another user after you got the original value. The operation was canceled.";
            }

            var result = JsonConvert.SerializeObject(new { ErrorMessage = message });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}
