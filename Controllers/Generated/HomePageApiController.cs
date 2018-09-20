using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using SendGrid;
using SendGrid.Helpers.Mail;
using PowerBIPoC;
using PowerBIPoC.Models;
using PowerBIPoC.Filters;
using PowerBIPoC.Services;
using PowerBIPoC.Helpers;
using System.IO;
using Microsoft.AspNetCore.Http;


  [Route("api/v1/HomePage")]
  public partial class HomePageApiController : Controller
  {
    private readonly IMailService _mailService;
    public readonly PowerBIPoCContext _context;
    private readonly IDataProtectionProvider _dataProtectionProvider;
    private readonly ILogger<UserManager<HomePage>> _logger;
    private IHostingEnvironment env;
    private readonly string _currentProject;
    public readonly IImageProcessor _imageProcessor;
    private BlobStorageOptions _blobStorageOptions;

    public HomePageApiController(PowerBIPoCContext context, IDataProtectionProvider dataProtectionProvider, ILogger<UserManager<HomePage>> logger
        , IHostingEnvironment env, IMailService mailService, IOptions<ProjectNameOptions> currentProjectOptions, IOptions<BlobStorageOptions> blobStorageOptions, IImageProcessor imageProcessor)
    {
      _context = context;
      _dataProtectionProvider = dataProtectionProvider;
      _logger = logger;
      _mailService = mailService;
      _currentProject = currentProjectOptions.Value.Value;
      _imageProcessor = imageProcessor;
      _blobStorageOptions = blobStorageOptions.Value;
      this.env = env;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{HomePage_id}/HomePage_BIDiagrams")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<BIDiagram> GetHomePage_BIDiagrams(int HomePage_id, [FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_sources = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true || true;
      var can_link_by_token = ApiTokenValid || true;
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token) // test
        return Enumerable.Empty<PowerBIPoC.Models.BIDiagram>() // B
              .AsQueryable()
              .Select(PowerBIPoC.Models.BIDiagram.FilterViewableAttributes(current_Admin))
              .Select(t => Tuple.Create(t, false))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PowerBIPoC.Models.BIDiagram.WithoutImages, item => item);
      var allowed_targets = ApiTokenValid ? _context.BIDiagram : _context.BIDiagram;
      var editable_targets = ApiTokenValid ? _context.BIDiagram : (_context.BIDiagram);
      var can_edit_by_token = ApiTokenValid || true;
      var items = (from target in allowed_targets
              select target).Distinct().OrderBy(i => i.CreatedDate);

      return items
              .Select(PowerBIPoC.Models.BIDiagram.FilterViewableAttributes(current_Admin))
              .Select(t => Tuple.Create(t, can_edit_by_token && editable_targets.Any(et => et.Id == t.Id)))
              .Paginate(can_create_by_token, can_delete_by_token, can_link_by_token, page_index, page_size, PowerBIPoC.Models.BIDiagram.WithoutImages, item => item);
    }

    [HttpGet("{HomePage_id}/HomePage_BIDiagrams/{BIDiagram_id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*BIDiagram*/ GetHomePage_BIDiagramById(int HomePage_id, int BIDiagram_id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_sources = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var source = allowed_sources.FirstOrDefault(s => s.Id == HomePage_id);
      var can_view_by_token = ApiTokenValid || true;
      if (source == null || !can_view_by_token)
        return NotFound();
      var allowed_targets = ApiTokenValid ? _context.BIDiagram : _context.BIDiagram;
      var item = (from target in allowed_targets
              select target).Distinct().OrderBy(i => i.CreatedDate)
              .Select(PowerBIPoC.Models.BIDiagram.FilterViewableAttributes(current_Admin))
              .FirstOrDefault(t => t.Id == BIDiagram_id);
      if (item == null) return NotFound();
      item = PowerBIPoC.Models.BIDiagram.WithoutImages(item);
      return Ok(item);
    }

    
    [RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<HomePage>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      

      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_items = ApiTokenValid ? _context.HomePage : current_Admin != null ? _context.HomePage : Enumerable.Empty<HomePage>().AsQueryable();
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PowerBIPoC.Models.HomePage.FilterViewableAttributesLocal(current_Admin)(item_full);
      item = PowerBIPoC.Models.HomePage.WithoutImages(item);

      return Ok(new ItemWithEditable<HomePage>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }

[RestrictToUserType(new string[] {"*"})]
    [HttpGet("{id}/WithPictures")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<HomePage>*/ GetByIdWithPictures(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_items = ApiTokenValid ? _context.HomePage : current_Admin != null ? _context.HomePage : Enumerable.Empty<HomePage>().AsQueryable();
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PowerBIPoC.Models.HomePage.FilterViewableAttributesLocal(current_Admin)(item_full);
      return Ok(new ItemWithEditable<HomePage>() {
        Item = item,
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    

    [RestrictToUserType(new string[] {})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*HomePage*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new HomePage() { CreatedDate = DateTime.Now,  };
      _context.HomePage.Add(PowerBIPoC.Models.HomePage.FilterViewableAttributesLocal(current_Admin)(item));
      _context.SaveChanges();
      item = PowerBIPoC.Models.HomePage.WithoutImages(item);
      return Ok(item);
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] HomePage item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = item;
      
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
      return Ok();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPut("WithPictures")]
    [ValidateAntiForgeryToken]
    public IActionResult UpdateWithPictures([FromBody] HomePage item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = item;
      
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
      return Ok();
    }

    [RestrictToUserType(new string[] {})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public IActionResult Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var item = _context.HomePage.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      
      

      _context.HomePage.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"*"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<HomePage> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.HomePage : _context.HomePage;
      var editable_items = ApiTokenValid ? _context.HomePage : current_Admin != null ? _context.HomePage : Enumerable.Empty<HomePage>().AsQueryable();
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.Distinct().OrderBy(i => i.CreatedDate);

      return items
        .Select(PowerBIPoC.Models.HomePage.FilterViewableAttributes(current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PowerBIPoC.Models.HomePage.WithoutImages, item => item);
    }

    

    


    /*
    static public void CleanupNullRelations(PowerBIPoCContext _context) {
    
    }
    */
    
  }

  