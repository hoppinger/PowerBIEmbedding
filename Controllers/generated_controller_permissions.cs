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


namespace PowerBIPoC.Models
{
  public static class Permissions {
    static public bool can_view_HomePage(Admin current_Admin) { return true; }

    static public bool can_create_HomePage(Admin current_Admin) { return false; }

    static public bool can_edit_HomePage(Admin current_Admin) { return current_Admin != null; }

    static public bool can_delete_HomePage(Admin current_Admin) { return false; }
      
  

    
static public bool can_view_Admin(Admin current_Admin) { return current_Admin != null; }

    static public bool can_create_Admin(Admin current_Admin) { return current_Admin != null; }

    static public bool can_edit_Admin(Admin current_Admin) { return current_Admin != null; }

    static public bool can_delete_Admin(Admin current_Admin) { return current_Admin != null; }
      
    static public bool can_view_Admin_AdminId(Admin current_Admin) { return true; }

    static public bool can_edit_Admin_AdminId(Admin current_Admin) { return true; }
    
  static public bool can_view_Admin_Username(Admin current_Admin) { return true; }

    static public bool can_edit_Admin_Username(Admin current_Admin) { return true; }
    
  static public bool can_view_Admin_Language(Admin current_Admin) { return true; }

    static public bool can_edit_Admin_Language(Admin current_Admin) { return true; }
    
  static public bool can_view_Admin_Email(Admin current_Admin) { return true; }

    static public bool can_edit_Admin_Email(Admin current_Admin) { return true; }
    

    
static public bool can_view_BIDiagram(Admin current_Admin) { return true; }

    static public bool can_create_BIDiagram(Admin current_Admin) { return true; }

    static public bool can_edit_BIDiagram(Admin current_Admin) { return true; }

    static public bool can_delete_BIDiagram(Admin current_Admin) { return true; }
      
    static public bool can_view_BIDiagram_ActivityId(Admin current_Admin) { return true; }

    static public bool can_edit_BIDiagram_ActivityId(Admin current_Admin) { return true; }
    
  static public bool can_view_BIDiagram_Title(Admin current_Admin) { return true; }

    static public bool can_edit_BIDiagram_Title(Admin current_Admin) { return true; }
    
  static public bool can_view_BIDiagram_GenerateRepeatingActivityEditions(Admin current_Admin) { return true; }

    static public bool can_edit_BIDiagram_GenerateRepeatingActivityEditions(Admin current_Admin) { return true; }
    

    

    static public bool can_view_HomePage_BIDiagram(Admin current_Admin) { return true; }

    static public bool can_create_HomePage_BIDiagram(Admin current_Admin) { return true; }

    static public bool can_edit_HomePage_BIDiagram(Admin current_Admin) { return true; }

    static public bool can_delete_HomePage_BIDiagram(Admin current_Admin) { return true; }
  }
}
