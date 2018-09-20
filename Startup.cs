using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NLog.Extensions.Logging;
using NLog.Web;
using PowerBIPoC.Data;
using PowerBIPoC.Models;
using PowerBIPoC.Middleware;
using PowerBIPoC.Services;
using PowerBIPoC.Helpers;

namespace PowerBIPoC
{
  public class ApiOptions
  {
    public ApiOptions() { }
    public string ApiToken { get; set; }
  }

  public class ProjectNameOptions
  {
    public ProjectNameOptions() { }
    public string Value { get; set; }
  }

  public class Startup
  {
    public Startup(IHostingEnvironment env)
    {
      var builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
          .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

      builder.AddEnvironmentVariables();
      Configuration = builder.Build();
      if(!env.IsDevelopment())
      {
        env.ConfigureNLog("nlog.config");
      }
    }

    public IConfigurationRoot Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

      services.AddDbContext<PowerBIPoCContext>(options =>
      {
        options.UseNpgsql(Configuration.GetConnectionString("PowerBIPoCConnection"));
      });

      Microsoft.Extensions.DependencyInjection.OptionsConfigurationServiceCollectionExtensions.Configure<ApiOptions>(services, Configuration);
      services.Configure<ProjectNameOptions>(options => options.Value = Configuration["ProjectName"]);
      services.Configure<MailServiceOptions>(options => {
        options.TemplateId = Configuration["MailOptions:TemplateId"];
        options.MailFrom = Configuration.GetValue<string>("MailFrom") != null ? Configuration.GetValue<string>("MailFrom") : Configuration["MailOptions:MailFrom"];
        options.MailApiToken = Configuration.GetValue<string>("MailApiToken") != null ? Configuration.GetValue<string>("MailApiToken") : Configuration["MailOptions:MailApiToken"];
      });
      services.Configure<BlobStorageOptions>(Configuration.GetSection("BlobStorage"));

      // services.AddIdentity<ApplicationUser, IdentityRole>()
      //     .AddEntityFrameworkStores<ApplicationDbContext>()
      //     .AddDefaultTokenProviders();

      services.AddMvc().AddJsonOptions(options =>
         {
           options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
           options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
           options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.RoundtripKind;
         });

      // Adds a default in-memory implementation of IDistributedCache.
      services.AddDistributedMemoryCache();

      services.AddSession(options =>
      {
        options.Cookie.Name = ".PowerBIPoC.Session804";
        options.Cookie.HttpOnly = true;
      });
      services.Configure<SentryOptions>(Configuration.GetSection("Sentry"));
      services.AddTransient<IImageProcessor, ImageProcessor>();
      services.AddSingleton<IMailService, MailService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IOptions<ApiOptions> apiOptionsAccessor, IHostingEnvironment env, ILoggerFactory loggerFactory, PowerBIPoCContext dbContext, IAntiforgery antiforgery)
    {
      loggerFactory.AddConsole(Configuration.GetSection("Logging"));

      Filters.RestrictToUserTypeAttribute.ApiToken = apiOptionsAccessor.Value.ApiToken;

      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseDatabaseErrorPage();
        app.UseBrowserLink();
       
      }
      else
      {
        app.UseMiddleware(typeof(ErrorHandling));
        loggerFactory.AddNLog();
      }
      app.Use(async (context, next) =>
      {
        context.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
        await next();
      });
      
      app.UseStaticFiles();

      // app.UseIdentity();

      app.UseSession();

      app.UseMvc(routes =>
      {
      });

    }
  }
}