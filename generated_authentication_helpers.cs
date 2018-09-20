using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using PowerBIPoC;
using PowerBIPoC.Models;
using System.ComponentModel.DataAnnotations;

namespace PowerBIPoC.Filters
{
  public class RestrictToUserTypeAttribute : ActionFilterAttribute
  {
    private readonly string[] user_types;
    public static string ApiToken {get;set;} = null;

    public RestrictToUserTypeAttribute(string[] user_types)
    {
      this.user_types = user_types;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
      var HttpContext = context.HttpContext;
      dynamic controller = context.Controller;
      var _context = controller._context as PowerBIPoCContext;
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;

      if ((ApiToken != null && context.HttpContext.Request.Headers["ApiToken"] == ApiToken) ||
          user_types.Any(user_type =>
            user_type == "*"
            || user_type == "Admin" && current_Admin != null)) {
        base.OnActionExecuting(context);
      } else {
        context.Result = new RedirectResult("/Home/Unauthorised");
      }
    }
  }
}

namespace PowerBIPoC
{
  public static class ApplicationSessionManager {
    public static bool Exists(this HttpContext HttpContext, PowerBIPoCContext _context) {
      if (HttpContext.Request.Cookies.ContainsKey("PowerBIPoCContext")) {
        var old_cookie = HttpContext.Request.Cookies["PowerBIPoCContext"];
        var old_session = _context.Session.FirstOrDefault(s => s.CookieName == old_cookie);
        return old_session != null;
      }
      return false;
    }
    
    public static T Get<T>(this HttpContext HttpContext, PowerBIPoCContext _context) {
      if (!HttpContext.Request.Cookies.ContainsKey("PowerBIPoCContext"))
        return default(T);
      var old_cookie = HttpContext.Request.Cookies["PowerBIPoCContext"];
      var old_session = _context.Session.FirstOrDefault(s => s.CookieName == old_cookie);
      if (old_session != null) {
        return JsonConvert.DeserializeObject<T>(old_session.Content);
      }
      return default(T);
    }

    public static void Set<T>(this HttpContext HttpContext, PowerBIPoCContext _context, T payload) {
      var cookie = HttpContext.Request.Cookies["PowerBIPoCContext"];
      var session = _context.Session.FirstOrDefault(s => s.CookieName == cookie);
       if (session != null) {
        session.Content = JsonConvert.SerializeObject(payload);
      } else {
        session = new Session() { CookieName = cookie, Content = JsonConvert.SerializeObject(payload), CreatedAt = DateTime.Now };
        _context.Session.Add(session);
      }
      _context.SaveChanges();
    }
    public static void ChangedPassword<U>(this HttpContext HttpContext, PowerBIPoCContext _context, string entity_name, U entity, int current_session_id) where U : IEntity {
      var now = DateTime.Now;
      _context.Session.RemoveRange(
        from s in _context.Session
        where (s.Id != current_session_id) &&
              (s.LoggedEntityId == entity.Id && s.LoggedEntityName == entity_name) ||
              (s.LoggedEntityId == null || s.LoggedEntityName == null) ||
              (now - s.CreatedAt).TotalDays >= 30
        select s);
      _context.SaveChanges();
    }
    public static void Deleted<U>(this HttpContext HttpContext, PowerBIPoCContext _context, string entity_name, U entity) where U : IEntity {
      var now = DateTime.Now;
      _context.Session.RemoveRange(
        from s in _context.Session
        where (s.LoggedEntityId == entity.Id && s.LoggedEntityName == entity_name) ||
              (s.LoggedEntityId == null || s.LoggedEntityName == null) ||
              (now - s.CreatedAt).TotalDays >= 30
        select s);
      _context.SaveChanges();
    }

    public static void Login<T, U>(this HttpContext HttpContext, Microsoft.AspNetCore.Hosting.IHostingEnvironment env, PowerBIPoCContext _context, string entity_name, U entity, T payload) where U : IEntity {
      HttpContext.Logout(_context);
      Deleted<U>(HttpContext, _context, entity_name, entity);

      var random_id = PasswordHasher.RandomString;
      HttpContext.Response.Cookies.Append("PowerBIPoCContext", random_id,
        new Microsoft.AspNetCore.Http.CookieOptions()
        {
          Expires = DateTimeOffset.Now.AddDays(30),
          HttpOnly = true,
          Secure = !env.IsDevelopment()
        });
      var new_session = new Session() { CookieName = random_id,
        LoggedEntityId = entity.Id,
        LoggedEntityName = entity_name,
        AdditionalInfo = HttpContext.Connection.RemoteIpAddress.ToString(),
        Content = JsonConvert.SerializeObject(payload),
        CreatedAt = DateTime.Now
      };
      _context.Session.Add(new_session);
      _context.SaveChanges();
    }

    public static void Logout(this HttpContext HttpContext, PowerBIPoCContext _context) {
      if (HttpContext.Request.Cookies.ContainsKey("PowerBIPoCContext")) {
        var old_cookie = HttpContext.Request.Cookies["PowerBIPoCContext"];
        var old_session = _context.Session.FirstOrDefault(s => s.CookieName == old_cookie);
        if (old_session != null) {
          _context.Session.Remove(old_session);
          _context.SaveChanges();
        }

        HttpContext.Response.Cookies.Delete("PowerBIPoCContext");
      }
    }

    
  }
}

namespace PowerBIPoC.Models
{
  public partial class RegistrationData
  {
    [Required(AllowEmptyStrings=false)]
    public string Username { get; set; }

    [Required(AllowEmptyStrings=false)]
    public string Email { get; set; }

    [Required(AllowEmptyStrings=false)]
    public string EmailConfirmation { get; set; }

    [Required(AllowEmptyStrings=false)]
    public string Password { get; set; }

    [Required(AllowEmptyStrings=false)]
    public string PasswordConfirmation {get; set; }

    [Required(AllowEmptyStrings=false)]
    public bool Errors { get; set; }
  }

  public partial class LoginData
  {
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public bool Errors { get; set; }
  }

  public partial class ChangePasswordData
  {
    [Required(AllowEmptyStrings=false)]
    public string Password { get; set; }

    [Required(AllowEmptyStrings=false)]
    public string NewPassword { get; set; }

    [Required(AllowEmptyStrings=false)]
    public string NewPasswordConfirmation { get; set; }
    
    public bool Errors { get; set; }
  }

  public partial class ForgotPasswordData
  {
    [Required(AllowEmptyStrings=false)]
    public string Email { get; set; }

    [Required(AllowEmptyStrings=false)]
    public bool Errors { get; set; }
  }

  public partial class ChangeEmailData
  {
    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string NewEmail { get; set; }

    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string OldEmail { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string Password { get; set; }
  }

  public partial class ChangeEmailConfirmData
  {
    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string NewEmail { get; set; }

    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string OldEmail { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string Token { get; set; }
  }

  public partial class ChangeUsernameData
  {
    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string Email { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string Username { get; set; }
    
    [Required(AllowEmptyStrings = false)]
    public string Password { get; set; }
  }

  public class ResetPasswordData
  {
    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string Email { get; set; }

    [Required(AllowEmptyStrings = false)]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [DataType(DataType.Password)]
    [Display(Name = "Confirm password")]
    [Compare("Password")]
    public string ConfirmPassword { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string Token { get; set; }
  }

  public partial class PasswordAndSalt {
    public string PasswordHash { get; set; }
    public string PasswordSalt { get; set; }
  }

  public static class PasswordHasher {
    static public string RandomString {
      get {
        byte[] salt = new byte[512 / 8];
        using (var rng = RandomNumberGenerator.Create())
        {
          rng.GetBytes(salt);
        }
        return Convert.ToBase64String(salt);
      }
    }

    static public string RandomPassword {
      get {
        byte[] salt = new byte[64 / 8];
        using (var rng = RandomNumberGenerator.Create())
        {
          rng.GetBytes(salt);
        }
        return Convert.ToBase64String(salt);
      }
    }

    static public bool CheckHash(string password_to_test, PasswordAndSalt password) {
      string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
          password: password_to_test,
          salt: Convert.FromBase64String(password.PasswordSalt),
          prf: KeyDerivationPrf.HMACSHA1,
          iterationCount: 10000,
          numBytesRequested: 256 / 8));

      return hashed == password.PasswordHash;
    }

    static public PasswordAndSalt Hash(string password) {
      byte[] salt = new byte[128 / 8];
      using (var rng = RandomNumberGenerator.Create())
      {
          rng.GetBytes(salt);
      }

      // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
      string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
          password: password,
          salt: salt,
          prf: KeyDerivationPrf.HMACSHA1,
          iterationCount: 10000,
          numBytesRequested: 256 / 8));
      return new PasswordAndSalt() { PasswordHash = hashed, PasswordSalt = Convert.ToBase64String(salt) };
    }
  }
}

