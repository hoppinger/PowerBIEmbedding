using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SharpRaven;
using SharpRaven.Data;
using System;
using System.Net;
using System.Threading.Tasks;

namespace PowerBIPoC.Middleware
{
    public class ErrorHandling
    {
        private readonly RequestDelegate next;
        private SentryOptions _sentryOptions;

        public ErrorHandling(RequestDelegate next, IOptions<SentryOptions> settings)
        {
            this.next = next;
            this._sentryOptions = settings.Value;
        }

        public async Task Invoke(HttpContext context /* other scoped dependencies */)
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

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            SendExceptionToSentry(exception);
            var code = HttpStatusCode.InternalServerError; // 500 if unexpected

            var result = JsonConvert.SerializeObject(new { error = exception.Message });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }

        private void SendExceptionToSentry(Exception exception)
        {
            var ravenClient = new RavenClient(_sentryOptions.Dsn)
            {
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
            };
            ravenClient.Capture(new SentryEvent(exception));
        }
    }
}