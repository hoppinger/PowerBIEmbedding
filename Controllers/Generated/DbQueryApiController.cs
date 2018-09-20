using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hoppinger.QueryGenerator;
using PowerBIPoC.Models;
using Microsoft.FSharp.Collections;
using PowerBIPoC.Filters;

namespace PowerBIPoC.Controllers
{
  [Route("api")]
  public class GeneratorQueryController : Controller
  {
    public readonly PowerBIPoCContext _context;

    public GeneratorQueryController(PowerBIPoCContext context)
    {
      _context = context;
    }

    public bool ApiTokenValid => RestrictToUserTypeAttribute.ApiToken != null &&
        HttpContext.Request.Headers["ApiToken"] == RestrictToUserTypeAttribute.ApiToken;

    private bool canView(string tableName, Admin current_Admin) {
      switch (tableName)
      {
                case "HomePage": return ApiTokenValid || (Permissions.can_view_HomePage(current_Admin) && true);
        case "Admin": return ApiTokenValid || (Permissions.can_view_Admin(current_Admin) && true);
        case "BIDiagram": return ApiTokenValid || (Permissions.can_view_BIDiagram(current_Admin) && true);
        default: throw new ArgumentException($"{tableName} is not a know table name.");
      }
    }

    private IQueryable<object> dataFilteredByPermissions(string tableName, Admin current_Admin) {
      switch (tableName)
      {
                case "HomePage": return _context.HomePage;
        case "Admin": return _context.Admin;
        case "BIDiagram": return _context.BIDiagram;
        default: throw new ArgumentException($"{tableName} is not a know table name.");
      }
    }

    private bool canCreate(string tableName, Admin current_Admin) {
      switch (tableName)
      {
                case "HomePage": return ApiTokenValid || (Permissions.can_create_HomePage(current_Admin) && true);
        case "Admin": return ApiTokenValid || (Permissions.can_create_Admin(current_Admin) && true);
        case "BIDiagram": return ApiTokenValid || (Permissions.can_create_BIDiagram(current_Admin) && true);
        default: throw new ArgumentException($"{tableName} is not a know table name.");
      }
    }

    private bool canDelete(string tableName, Admin current_Admin) {
      switch (tableName)
      {
                case "HomePage": return ApiTokenValid || (Permissions.can_delete_HomePage(current_Admin) && true);
        case "Admin": return ApiTokenValid || (Permissions.can_delete_Admin(current_Admin) && true);
        case "BIDiagram": return ApiTokenValid || (Permissions.can_delete_BIDiagram(current_Admin) && true);
        default: throw new ArgumentException($"{tableName} is not a know table name.");
      }
    }

    private bool canEdit(string tableName, Admin current_Admin) {
      switch (tableName)
      {
                case "HomePage": return ApiTokenValid || (Permissions.can_edit_HomePage(current_Admin) && true);
        case "Admin": return ApiTokenValid || (Permissions.can_edit_Admin(current_Admin) && true);
        case "BIDiagram": return ApiTokenValid || (Permissions.can_edit_BIDiagram(current_Admin) && true);
        default: throw new ArgumentException($"{tableName} is not a know table name.");
      }
    }

    private bool canLink(string tableName) {
      switch (tableName)
      {
                case "HomePage": return ApiTokenValid || true;
        case "Admin": return ApiTokenValid || true;
        case "BIDiagram": return ApiTokenValid || true;
        default: throw new ArgumentException($"{tableName} is not a know table name.");
      }
    }

    [Route("search")]
    [HttpPost]
    public IActionResult Search ([FromBody] Hoppinger.QueryGenerator.Models.Comprehension comp, [FromQuery] int page_index, [FromQuery] int page_size = 25) {
      var firstTable = comp.Relationship.FirstTable;
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      var can_create = canCreate(firstTable, current_Admin);
      var can_delete = canDelete(firstTable, current_Admin);
      var can_edit = canEdit(firstTable, current_Admin);
      var can_link = canLink(firstTable);
      var map = new Dictionary<string, IQueryable<object>>() {
        {"HomePage",
             canView("HomePage", current_Admin)
                        ? dataFilteredByPermissions("HomePage", current_Admin)
                        : Enumerable.Empty<HomePage>().AsQueryable()
            .Select(PowerBIPoC.Models.HomePage.FilterViewableAttributes(current_Admin))
            .Select(m => PowerBIPoC.Models.HomePage.WithoutImages(m)) as IQueryable<object>},
        {"Admin",
             canView("Admin", current_Admin)
                        ? dataFilteredByPermissions("Admin", current_Admin)
                        : Enumerable.Empty<Admin>().AsQueryable()
            .Select(PowerBIPoC.Models.Admin.FilterViewableAttributes(current_Admin))
            .Select(m => PowerBIPoC.Models.Admin.WithoutImages(m)) as IQueryable<object>},
        {"BIDiagram",
             canView("BIDiagram", current_Admin)
                        ? dataFilteredByPermissions("BIDiagram", current_Admin)
                        : Enumerable.Empty<BIDiagram>().AsQueryable()
            .Select(PowerBIPoC.Models.BIDiagram.FilterViewableAttributes(current_Admin))
            .Select(m => PowerBIPoC.Models.BIDiagram.WithoutImages(m)) as IQueryable<object>}
      };
      var p = Parser.parseComprehension(true, map, comp);
      var e = CodeGenerator.emitComprehension(p);
      if (map.ContainsKey(firstTable)) {
        var res = (map[firstTable].AsQueryable()
          .Provider.CreateQuery(e.CurrentExpr.Value) as IQueryable<IEntity>)
          .Select(t => Tuple.Create(t, can_edit))
          .Paginate(can_create, can_delete, can_link, page_index, page_size, x => x, x => x, null);
        return Json(res);
      }
      throw new Exception($"FirstTable '{firstTable}' was not found in the map of tables.");
    }

    [Route("search_full")]
    [HttpPost]
    public IActionResult SearchFull ([FromBody] Hoppinger.QueryGenerator.Models.Comprehension comp, [FromQuery] int page_index, [FromQuery] int page_size = 25) {
      var firstTable = comp.Relationship.FirstTable;

      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;

      var can_create = canCreate(firstTable, current_Admin);
      var can_delete = canDelete(firstTable, current_Admin);
      var can_edit = canEdit(firstTable, current_Admin);
      var can_link = canLink(firstTable);

      var map = new Dictionary<string, IQueryable<object>>() {
        {"HomePage",
             canView("HomePage", current_Admin)
                        ? dataFilteredByPermissions("HomePage", current_Admin)
                        : Enumerable.Empty<HomePage>().AsQueryable()
            .Select(PowerBIPoC.Models.HomePage.FilterViewableAttributes(current_Admin))
            .Select(m => PowerBIPoC.Models.HomePage.WithoutImages(m)) as IQueryable<object>},
        {"Admin",
             canView("Admin", current_Admin)
                        ? dataFilteredByPermissions("Admin", current_Admin)
                        : Enumerable.Empty<Admin>().AsQueryable()
            .Select(PowerBIPoC.Models.Admin.FilterViewableAttributes(current_Admin))
            .Select(m => PowerBIPoC.Models.Admin.WithoutImages(m)) as IQueryable<object>},
        {"BIDiagram",
             canView("BIDiagram", current_Admin)
                        ? dataFilteredByPermissions("BIDiagram", current_Admin)
                        : Enumerable.Empty<BIDiagram>().AsQueryable()
            .Select(PowerBIPoC.Models.BIDiagram.FilterViewableAttributes(current_Admin))
            .Select(m => PowerBIPoC.Models.BIDiagram.WithoutImages(m)) as IQueryable<object>}
      };

      var p = Parser.parseComprehension(false, map, comp);
      var e = CodeGenerator.emitComprehension(p);

      if (map.ContainsKey(firstTable)) {
        var res = (map[firstTable].AsQueryable()
          .Provider.CreateQuery(e.CurrentExpr.Value) as IQueryable<object>);
        var paginated_res = res.Paginate(page_index, page_size);
        var compressed_res = ResultPostProcessing.compressResult(paginated_res.Items.AsQueryable());
        return Json(compressed_res);
      }

      throw new Exception($"FirstTable '{firstTable}' was not found in the map of tables.");
    }
  }
}
