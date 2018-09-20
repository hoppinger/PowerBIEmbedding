using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PowerBIPoC.Data;
using PowerBIPoC.Models;

namespace PowerBIPoC
{
    public class Program
    {
        public static void Main(string[] args)
        {
      var host = BuildWebHost(args);

      using (var scope = host.Services.CreateScope())
      {
        var services = scope.ServiceProvider;

        if (scope.ServiceProvider.GetService<IHostingEnvironment>().IsDevelopment())
        {
          PowerBIPoCContextSeeds.Initialize(scope.ServiceProvider.GetService<PowerBIPoCContext>());
        }

        PowerBIPoCContextSeeds.InitializePagesAndSingletons(scope.ServiceProvider.GetService<PowerBIPoCContext>());
      }
      host.Run();

    }

    public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((ctx, config) =>
                    config.SetBasePath(ctx.HostingEnvironment.ContentRootPath)
                    .AddCommandLine(args)
                    .AddEnvironmentVariables(prefix: "ASPNETCORE_"))
                .UseStartup<Startup>()
                .UseUrls("http://*:5000")
                .Build();
    }
}
