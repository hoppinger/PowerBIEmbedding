using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using PowerBIPoC;
using PowerBIPoC.Models;
using PowerBIPoC.Filters;


namespace PowerBIPoC.Controllers
{
  public partial class HomeController : Controller
  {
    private readonly PowerBIPoCContext _context;
    private readonly ProjectNameOptions _projectNameOptions;

    public HomeController(PowerBIPoCContext context, IOptions<ProjectNameOptions> projectNameOptions)
    {
      _context = context;
      _projectNameOptions = projectNameOptions.Value;
    }

    [Route("admin")]
    [HttpGet("admin/Home/{*slug}")]
    [HttpGet("admin/Home/Index/{*slug}")]
    [HttpGet("admin/{*slug}")]
    public IActionResult Index(string slug)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      ViewData["CurrentAdmin"] = session == null ? null : session.Admin;

      ViewData["id"] = _context.HomePage.First().Id;
      ViewData["slug"] = slug;
      ViewData["Page"] = "Home/Index";
      ViewData["ProjectName"] = _projectNameOptions.Value;
      return View();
    }

    [HttpGet("admin/Home/Error")]
    public IActionResult Error()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      ViewData["CurrentAdmin"] = session == null ? null : session.Admin;

      ViewData["Page"] = "Home/Error";
      return View();
    }

    [HttpGet("admin/Home/Unauthorised")]
    public IActionResult Unauthorised()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      ViewData["CurrentAdmin"] = session == null ? null : session.Admin;

      Response.StatusCode = 401;
      ViewData["Page"] = "Home/Unauthorised";
      return View();
    }
  }
}
