using System.Linq;
using Microsoft.EntityFrameworkCore;
using PowerBIPoC.Models;
  
public static class DbContextQueryExtensions {
public static IQueryable<HomePage> getAllowedItems_HomePage (
  this PowerBIPoCContext _context,
  LoggableEntities session
) {
  var current_Admin = session == null ? null : session.Admin;
  return _context.HomePage;
}

public static IQueryable<Admin> getAllowedItems_Admin (
  this PowerBIPoCContext _context,
  LoggableEntities session
) {
  var current_Admin = session == null ? null : session.Admin;
  return _context.Admin;
}

public static IQueryable<BIDiagram> getAllowedItems_BIDiagram (
  this PowerBIPoCContext _context,
  LoggableEntities session
) {
  var current_Admin = session == null ? null : session.Admin;
  return _context.BIDiagram;
}

}