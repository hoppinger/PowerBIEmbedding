using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Hosting;
using SendGrid;
using SendGrid.Helpers.Mail;
using PowerBIPoC;
using PowerBIPoC.Models;
using PowerBIPoC.Filters;


[Route("/admin/[controller]")]
  public partial class AdminsController : Controller
  {
    public readonly PowerBIPoCContext _context;
    public IHostingEnvironment env;
    private readonly ProjectNameOptions _projectNameOptions;

    public AdminsController(PowerBIPoCContext context, IHostingEnvironment env, IOptions<ProjectNameOptions> projectNameOptions)
    {
      _context = context;
      _projectNameOptions = projectNameOptions.Value;
      this.env = env;
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpGet("{id}/{*slug}")]
    public IActionResult View(int id, string slug)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      ViewData["CurrentAdmin"] = session == null ? null : session.Admin;
      ViewData["ProjectName"] = _projectNameOptions.Value;
      ViewData["id"] = id;
      ViewData["slug"] = slug;
      ViewData["Page"] = "Admins/View";
      return View();
    }
  }

  