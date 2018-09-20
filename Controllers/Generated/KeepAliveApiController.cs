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
using System.IO;

[Route("api/v1/keep_alive")]
public partial class KeepAliveApiController : Controller
{
  public readonly PowerBIPoCContext _context;

  public KeepAliveApiController(PowerBIPoCContext context)
  {
    _context = context;
  }

  [HttpGet("ping")]
  [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
  public IActionResult Ping() {
    return Ok();
  }
  [HttpGet("ping_as_Admin")]
  [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
  public IActionResult PingAsAdmin()
  {
    
    
    return Ok();
  }

}
