using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace PowerBIPoC.Models
{
    public partial class HomePage: IEntity {
    public HomePage () {
      
    }
    public int Id {get;set;}
    
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        
    
    static public Expression<Func<HomePage,HomePage>> FilterViewableAttributes(Admin current_Admin) {
      return self => self;
    }
    static public Func<HomePage,HomePage> FilterViewableAttributesLocal(Admin current_Admin) {
      return self => self;
    }
    static public HomePage WithoutImages(HomePage self) {
      
      return self;
    }
  }

  
  
  public partial class Admin: IAuthenticationUser {
    public Admin () {
      
    }
    public int Id {get;set;}
    
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Username {get;set;}
    public string Language {get;set;}
    public string Email {get;set;}
    [Newtonsoft.Json.JsonIgnore] public string PasswordHash {get;set;}
    [Newtonsoft.Json.JsonIgnore] public string PasswordSalt {get;set;}
    [Newtonsoft.Json.JsonIgnore] public DateTime LastLoginAttempt {get;set;}
    [Newtonsoft.Json.JsonIgnore] public string SecurityStamp {get;set;}
    public bool EmailConfirmed {get;set;}
    static public Expression<Func<Admin,Admin>> FilterViewableAttributes(Admin current_Admin) {
      return self => self;
    }
    static public Func<Admin,Admin> FilterViewableAttributesLocal(Admin current_Admin) {
      return self => self;
    }
    static public Admin WithoutImages(Admin self) {
      
      return self;
    }
  }

  public partial class AdminViewData {
    public int Id {get;set;}
    public string Username {get;set;}
    public string Language {get;set;}
    public string Email {get;set;}
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))]
    public DateTime CreatedDate {get;set;}
    public bool HasPassword {get;set;}
    public bool EmailConfirmed {get;set;}
    static public AdminViewData FromAdmin(Admin item) {
      return new AdminViewData() { Id = item.Id, CreatedDate = item.CreatedDate, HasPassword = item.PasswordHash != null, EmailConfirmed = item.EmailConfirmed, Username = item.Username, Language = item.Language, Email = item.Email };
    }
    static public Admin FromAdminViewData(AdminViewData item, PowerBIPoCContext context) {
      var original = context.Admin.FirstOrDefault(i => i.Id == item.Id);
      original.Username = item.Username;
      original.Language = item.Language;
      original.Email = item.Email;
      original.CreatedDate = item.CreatedDate;
      return original;
    }
  }

  
  
  [Table("BIDiagram")] public partial class BIDiagram: IEntity {
    public BIDiagram () {
      
    }
    public int Id {get;set;}
    
    [Newtonsoft.Json.JsonProperty(ItemConverterType = typeof(Newtonsoft.Json.Converters.JavaScriptDateTimeConverter))] public DateTime CreatedDate{ get; set; }
        public string Title {get;set;}
    public string AccessToken {get;set;}
    public string EmbedUrl {get;set;}
    public string ReportID {get;set;}
    public string ReportType {get;set;}
    
    static public Expression<Func<BIDiagram,BIDiagram>> FilterViewableAttributes(Admin current_Admin) {
      return self => self;
    }
    static public Func<BIDiagram,BIDiagram> FilterViewableAttributesLocal(Admin current_Admin) {
      return self => self;
    }
    static public BIDiagram WithoutImages(BIDiagram self) {
      
      return self;
    }
  }

  
  
  

  public partial class LoggableEntities {
  public Admin Admin {get;set;}
}

  public partial class LoginAttempt
  {
    public string IpAddress { get; set; }
    public string Email { get; set; }
    public int Attempts { get; set; }
    public DateTime LastAttempt { get; set; }
  }

  public partial class Session {
    public int Id {get;set;}
    public int? LoggedEntityId {get;set;}
    public string LoggedEntityName {get;set;}
    public string AdditionalInfo {get;set;}
    public string CookieName {get;set;}
    public string Content {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime LastInteraction {get;set;}
  }

  public interface IAuthenticationUser : IEntity {
    string Email { get; set; }
    bool EmailConfirmed { get; set;  }
    string SecurityStamp { get; set; }
    string Username { get; set; }
  }
}
