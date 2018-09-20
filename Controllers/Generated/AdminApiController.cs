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


  [Route("api/v1/Admin")]
  public partial class AdminApiController : Controller
  {
    private readonly IMailService _mailService;
    public readonly PowerBIPoCContext _context;
    private readonly IDataProtectionProvider _dataProtectionProvider;
    private readonly ILogger<UserManager<Admin>> _logger;
    private IHostingEnvironment env;
    private readonly string _currentProject;
    public readonly IImageProcessor _imageProcessor;
    private BlobStorageOptions _blobStorageOptions;

    public AdminApiController(PowerBIPoCContext context, IDataProtectionProvider dataProtectionProvider, ILogger<UserManager<Admin>> logger
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

    
    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("DeleteSessions")]
    [ValidateAntiForgeryToken]
    public IActionResult DeleteSessions() {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      if (session.Admin != null) {
        var item = _context.Admin.FirstOrDefault(t => t.Id == session.Admin.Id);
        if (item != null) {
          var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
          if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
          HttpContext.Deleted<Admin>(_context, "Admin", item);
          return Ok();
        }
      }
      return Unauthorized();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("ActiveSessions")]
    [ValidateAntiForgeryToken]
    public IActionResult GetActiveSessions() {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      if (session.Admin != null) {
        var item = _context.Admin.FirstOrDefault(t => t.Id == session.Admin.Id);
        if (item != null) {
          var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
          if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
          return Ok(_context.Session.Where(s => s.LoggedEntityId == item.Id)
            .Select(s => Tuple.Create(s.AdditionalInfo, s.CreatedAt))
            .ToArray());
        }
      }
      return Unauthorized();
    }

    [HttpPost("Validate")]
    [ValidateAntiForgeryToken]
    public bool Validate([FromBody] RegistrationData registration_data)
    {
      string username = registration_data.Username,
             email = registration_data.Email,
             email_confirmation = registration_data.EmailConfirmation;
      if (username != null && username != "" && email != null && email != "" && email == email_confirmation) {
        return !_context.Admin.Any(t => t.Username == username || t.Email == email);
      }
      return false;
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("Register")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register([FromBody] RegistrationData registration_data)
    {
      string username = registration_data.Username,
             email = registration_data.Email,
             email_confirmation = registration_data.EmailConfirmation,
             password = registration_data.Password,
             password_confirmation = registration_data.PasswordConfirmation;

      // Check if all required parameters are present and if the user does not allready exits
      if (!ModelState.IsValid || email != email_confirmation || password != password_confirmation)
      {
        return BadRequest();
      }

      var existingAdmin = _context.Admin.FirstOrDefault(t => t.Username == username || t.Email == email);

      if (existingAdmin != null)
      {
        return BadRequest();
      }

      // Register the new user
      var hassedPassword = PasswordHasher.Hash(password);

      var newAdmin = new Admin() {  Username = username, CreatedDate = DateTime.Now, EmailConfirmed = false, Email = email, PasswordHash = hassedPassword.PasswordHash, PasswordSalt = hassedPassword.PasswordSalt };

      
      _context.Admin.Add(newAdmin);
      _context.SaveChanges();
      
      newAdmin.EmailConfirmed = false;
      _context.Admin.Update(newAdmin);
      _context.SaveChanges();

      // Update the securitystamp of the user
      await UserManager().UpdateSecurityStampAsync(newAdmin);

      // Send an email to inform the Admin
      var token = await UserManager().GenerateEmailConfirmationTokenAsync(newAdmin);
      var uri = Url.ActionContext.HttpContext.Request.Scheme + "://"
              + Url.ActionContext.HttpContext.Request.Host.Value
              + Url.Action("ConfirmEmailPage", new { userId = newAdmin.Id, token = token });
     
      var subject = "Admin account created";
      var to = new EmailAddress(newAdmin.Email);
      var plainTextContent = $"Hello {newAdmin.Username}\n\nYour Admin account has just been created. Click on the link to active you account\n{uri}";
      var htmlContent = $"Hello {newAdmin.Username}<br /><br />Your Admin account has just been created. Click on the link to active you account<br /><a href='{uri}'>{uri}</a><br />";
      var subsitutions = new Dictionary<string, string>
      {
        {":subject", subject}
      };

      await _mailService.SendEmailAsync(to, subject, plainTextContent, htmlContent, subsitutions);

      return Ok(newAdmin);
    }

    [HttpPost("ConfirmEmail")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ConfirmEmail(int userId, string token)
    {
      var user = _context.Admin.Where(t => t.Id == userId).FirstOrDefault();
     
      if (user.EmailConfirmed)
      {
        return Unauthorized();
      }

      var result = await UserManager().ConfirmEmailAsync(user, token);

      if (result.Succeeded)
      {
        // Update the SecurityStamp to prevent re-usage of this token
        await UserManager().UpdateSecurityStampAsync(user);
      }

      return Ok(result.Succeeded);
    }

    [HttpGet("ConfirmEmailPage")]
    public async Task<IActionResult> ConfirmEmailPage(string token, int? userId)
    {
      if (token == null || userId == null)
      {
        return BadRequest();
      }

      var user = _context.Admin.Where(t => t.Id == userId).FirstOrDefault();
      var result = await UserManager().ConfirmEmailAsync(user, token);

      if (result.Succeeded == false)
      {
        return Unauthorized();
      }

      // The token is correct; Activate the user account and display the success page
      ViewData["Page"] = "Admins/Confirmed";
      ViewData["Message"] = "Your email address is confirmed.";
      return View("~/Views/Admins/Confirmed.cshtml");
    }

    [HttpPost("Login")]
    [ValidateAntiForgeryToken]
    public IActionResult Login([FromBody] LoginData login_data)
    {
      var item = _context.Admin.FirstOrDefault(t => t.Username == login_data.Username || t.Email == login_data.Email);
      string currentIp = HttpContext.Request.Headers["X-Forwarded-For"];
      if (currentIp == null)
      {
        currentIp = HttpContext.Connection.RemoteIpAddress.ToString();
      }
      var attempt = _context.LoginAttempt.Where(a => a.IpAddress == currentIp && a.Email == login_data.Email).FirstOrDefault();

      if (attempt == null)
      {
        attempt = new LoginAttempt { Email = login_data.Email, IpAddress = currentIp, Attempts = 0, LastAttempt = DateTime.Now };
        _context.Add(attempt);
      }

      if (attempt.Attempts >= 5 && attempt.LastAttempt.AddSeconds(30).CompareTo(DateTime.Now) > 0)
      {
        return StatusCode(403, new { message = "temporarily_blocked" });
      }
      else if (attempt.Attempts >= 5 && attempt.LastAttempt.AddSeconds(30).CompareTo(DateTime.Now) < 0)
      {
        attempt.Attempts = 0;
      }

      if (item != null)
      {
        var last_login_attempt = item.LastLoginAttempt;
        item.LastLoginAttempt = DateTime.Now;
        _context.Update(item);
        _context.SaveChanges();

        if (login_data.Password != null && (last_login_attempt != null || (DateTime.Now - last_login_attempt).TotalSeconds > 3) && item.EmailConfirmed)
        {
          if (PasswordHasher.CheckHash(login_data.Password, new PasswordAndSalt() { PasswordHash = item.PasswordHash, PasswordSalt = item.PasswordSalt }))
          {
            // Remove this IP from the attempts table since the login is successfull
            _context.LoginAttempt.Remove(attempt);
            _context.LoginAttempt.RemoveRange(_context.LoginAttempt.Where(a => a.LastAttempt.AddDays(1).CompareTo(DateTime.Now) < 0));
            _context.SaveChanges();

            HttpContext.Login<LoggableEntities, Admin>(env, _context, "Admin", item, new LoggableEntities() { Admin = item });

            return Ok(AdminViewData.FromAdmin(item));
          }
        }
      }

      // The login is unsuccesfull, update the attempts for this IP
      attempt.Attempts = attempt.Attempts + 1;
      attempt.LastAttempt = DateTime.Now;
      _context.SaveChanges();

      return StatusCode(401, new { message = "login_failed" });
    }

    [HttpPost("Logout")]
    [ValidateAntiForgeryToken]
    public IActionResult Logout()
    {
      HttpContext.Logout(_context);
      return Ok();
    }

    [HttpPost("ChangePassword")]
    [ValidateAntiForgeryToken]
    public IActionResult ChangePassword([FromBody] ChangePasswordData change_password_data)
    {
      if (ModelState.IsValid == false || change_password_data.NewPassword != change_password_data.NewPasswordConfirmation)
      {
        return BadRequest();
      }

      var currentSessionId = HttpContext.Get<Session>(_context).Id;
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;

      if (current_Admin != null)
      {
        var admin = _context.Admin.FirstOrDefault(u => u.Id == current_Admin.Id);

        if (!PasswordHasher.CheckHash(change_password_data.Password, new PasswordAndSalt(){ PasswordHash = admin.PasswordHash, PasswordSalt = admin.PasswordSalt }))
        {
          return Unauthorized();
        }

        var hassedPassword = PasswordHasher.Hash(change_password_data.NewPassword);
        
        admin.PasswordHash = hassedPassword.PasswordHash;
        admin.PasswordSalt = hassedPassword.PasswordSalt;

        _context.Admin.Update(admin);
        _context.SaveChanges();

        return Ok();
      }
      
      
      return Unauthorized();
    }

    [HttpPost("ForgotPassword")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordData data)
    {
      if (ModelState.IsValid == false)
      {
        return BadRequest();
      }

      var user = await UserManager().FindByEmailAsync(data.Email);

      if (user == null || !(await UserManager().IsEmailConfirmedAsync(user)))
      {
        return StatusCode(400);
      }

      await UserManager().UpdateSecurityStampAsync(user);
      var token = await UserManager().GeneratePasswordResetTokenAsync(user);

      // Send a email with the token
      var uri = Url.ActionContext.HttpContext.Request.Scheme + "://"
                + Url.ActionContext.HttpContext.Request.Host.Value
                + Url.Action("ResetPasswordPage", new { token = token, email = data.Email });
      var subject = "Admin password reset request.";
      var to = new EmailAddress(user.Email);
      var plainTextContent = $"Hello {user.Username} \n\nReset your password with the following link:\n{uri}\n";
      var htmlContent = $"Hello {user.Username},<br /><br />Reset your password with the following linke:<br />{uri}<br />";
      var subsitutions = new Dictionary<string, string>
      {
        {":subject", subject}
      };

      await _mailService.SendEmailAsync(to, subject, plainTextContent, htmlContent, subsitutions);

      return Ok();
    }

    [HttpGet("ResetPasswordPage")]
    public async Task<IActionResult> ResetPasswordPage(string token, string email)
    {
      if (token == null || email == null)
      {
        return Unauthorized();
      }

      var user = await UserManager().FindByEmailAsync(email);
      if (user == null)
      {
          return Unauthorized();
      }

      if (!await UserManager().VerifyUserTokenAsync(user, "Default", "ResetPassword", token))
      {
          return Unauthorized();
      }
      
      ViewData["token"] = token;
      ViewData["role"] = "Admin";
      ViewData["email"] = email;
      ViewData["Page"] = "Admins/ResetPassword";
      
      return View("~/Views/Admins/ResetPassword.cshtml");
    }
    
    [HttpPost("ResetPassword")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordData data)
    {
      if (!ModelState.IsValid)
      {
        return Unauthorized();
      }

      var user = await UserManager().FindByEmailAsync(data.Email);
      if (user == null)
      {
          return Unauthorized();
      }

      if (!await UserManager().VerifyUserTokenAsync(user, "Default", "ResetPassword", data.Token))
      {
          return Unauthorized();
      }

      // Set a new password for the user
      var hasedPassword = PasswordHasher.Hash(data.Password);
      user.PasswordHash = hasedPassword.PasswordHash;
      user.PasswordSalt = hasedPassword.PasswordSalt;
      _context.Admin.Update(user);
      _context.SaveChanges();

      // Update the SecurityStamp to prevent re-usage of this token
      await UserManager().UpdateSecurityStampAsync(user);

      return Ok();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("ChangeEmail")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailData data)
    {
      if (ModelState.IsValid == false) {
        return BadRequest();
      }

      var user = await UserManager().FindByEmailAsync(data.OldEmail);
      if (user == null)
      {
        return Unauthorized();
      }

      if (!PasswordHasher.CheckHash(data.Password, new PasswordAndSalt(){ PasswordHash = user.PasswordHash, PasswordSalt = user.PasswordSalt }))
      {
        return Unauthorized();
      }

      await UserManager().UpdateSecurityStampAsync(user);
      var token = await UserManager().GenerateUserTokenAsync(user, "Default", data.NewEmail);
      var uri = Url.ActionContext.HttpContext.Request.Scheme + "://"
        + Url.ActionContext.HttpContext.Request.Host.Value
        + Url.Action("ChangeEmailConfirm", new { token = token, oldEmail = data.OldEmail, newEmail = data.NewEmail });

      var subject = "Confirm your new mail address";
      var to = new EmailAddress(data.NewEmail);
      var plainTextContent = $"We have received a request to change your mail address. If this is correct, please confirm your new address by clicking on the link below. \n\n{uri}\n";
      var htmlContent = $"We have received a request to change your mail address. If this is correct, please confirm your new address by clicking on the link below. <br />{uri}<br />";
      var subsitutions = new Dictionary<string, string>
      {
        {":subject", subject}
      };

      await _mailService.SendEmailAsync(to, subject, plainTextContent, htmlContent, subsitutions);
      
      return Ok();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpGet("ChangeEmailConfirm")]
    public async Task<IActionResult> ChangeEmailConfirm(string token, string oldEmail, string newEmail)
    {
      var currentSessionId = HttpContext.Get<Session>(_context).Id;
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;

      var user = await UserManager().FindByEmailAsync(oldEmail);
      if (user == null || current_Admin == null || current_Admin.Id != user.Id)
      {
        return Unauthorized();
      }

      if (!await UserManager().VerifyUserTokenAsync(user, "Default", newEmail, token))
      {
        return Unauthorized();
      }

      // Change the email address to the new address
      user.Email = newEmail;
      _context.Admin.Update(user);
      _context.SaveChanges();

      // Update the SecurityStamp to prevent re-usage of this token
      await UserManager().UpdateSecurityStampAsync(user);
    
      ViewData["Page"] = "Admin/Confirmed";
      ViewData["Message"] = $"Your email address is succesfully change to {newEmail}.";
      return View("~/Views/Admins/Confirmed.cshtml");
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost("ChangeUsername")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ChangeUsername([FromBody] ChangeUsernameData data)
    {
      if (ModelState.IsValid == false)
      {
        return BadRequest();
      }

      var user = await UserManager().FindByEmailAsync(data.Email);
      if (user == null)
      {
        // Wait 2 seconds to prevent a replay attack
        System.Threading.Thread.Sleep(2000);

        return Unauthorized();
      }

      if (!PasswordHasher.CheckHash(data.Password, new PasswordAndSalt(){ PasswordHash = user.PasswordHash, PasswordSalt = user.PasswordSalt }))
      {
        // Wait 2 seconds to prevent a replay attack
        System.Threading.Thread.Sleep(2000);
        
        return Unauthorized();
      }

      bool exists = _context.Admin.Where(u => u.Username == data.Username).Count() > 0;
      if (exists)
      {
        // Wait 2 seconds to prevent a replay attack
        System.Threading.Thread.Sleep(2000);

        return BadRequest();
      }

      user.Username = data.Username;

      _context.Admin.Update(user);
      _context.SaveChanges();
      return Ok();
    }

    private UserManager<Admin> UserManager()
    {
      var user_manager = new UserManager<Admin>(new UserStore<Admin>(_context, _context.Admin), null, null, null, null, null, new IdentityErrorDescriber(), null, _logger);
      user_manager.RegisterTokenProvider("Default", new DataProtectorTokenProvider<Admin>(
          _dataProtectionProvider,
          Options.Create(new DataProtectionTokenProviderOptions())
      ));

      return user_manager;
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpGet("{id}")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<AdminViewData>*/ GetById(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      

      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var editable_items = ApiTokenValid ? _context.Admin : current_Admin != null ? _context.Admin : Enumerable.Empty<Admin>().AsQueryable();
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PowerBIPoC.Models.Admin.FilterViewableAttributesLocal(current_Admin)(item_full);
      item = PowerBIPoC.Models.Admin.WithoutImages(item);

      return Ok(new ItemWithEditable<AdminViewData>() {
        Item = AdminViewData.FromAdmin(item),
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }

[RestrictToUserType(new string[] {"Admin"})]
    [HttpGet("{id}/WithPictures")]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult /*ItemWithEditable<AdminViewData>*/ GetByIdWithPictures(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var editable_items = ApiTokenValid ? _context.Admin : current_Admin != null ? _context.Admin : Enumerable.Empty<Admin>().AsQueryable();
      var item_full = allowed_items.FirstOrDefault(e => e.Id == id);
      if (item_full == null) return NotFound();
      var item = PowerBIPoC.Models.Admin.FilterViewableAttributesLocal(current_Admin)(item_full);
      return Ok(new ItemWithEditable<AdminViewData>() {
        Item = AdminViewData.FromAdmin(item),
        Editable = editable_items.Any(e => e.Id == item.Id) });
    }
    

    

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult /*AdminViewData*/ Create()
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      
      if (_context.Admin.Any(u => u.Username == null || u.Email == null || u.Username == "" || u.Email == ""))
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var can_create_by_token = ApiTokenValid || true;
      if (!can_create_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized create attempt");
      var item = new Admin() { CreatedDate = DateTime.Now,  };
      _context.Admin.Add(PowerBIPoC.Models.Admin.FilterViewableAttributesLocal(current_Admin)(item));
      _context.SaveChanges();
      item = PowerBIPoC.Models.Admin.WithoutImages(item);
      return Ok(AdminViewData.FromAdmin(item));
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPut]
    [ValidateAntiForgeryToken]
    public IActionResult Update([FromBody] AdminViewData item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = AdminViewData.FromAdminViewData(item, _context);
      if (current_Admin != null && new_item.Id == current_Admin.Id)
           HttpContext.Set<LoggableEntities>(_context, new LoggableEntities() { Admin = new_item });
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.Username).IsModified = false;
      _context.Entry(new_item).Property(x => x.Email).IsModified = false;
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
      return Ok();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpPut("WithPictures")]
    [ValidateAntiForgeryToken]
    public IActionResult UpdateWithPictures([FromBody] AdminViewData item)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      if (!allowed_items.Any(i => i.Id == item.Id)) return Unauthorized();
      var new_item = AdminViewData.FromAdminViewData(item, _context);
      if (current_Admin != null && new_item.Id == current_Admin.Id)
           HttpContext.Set<LoggableEntities>(_context, new LoggableEntities() { Admin = new_item });
      var can_edit_by_token = ApiTokenValid || true;
      if (item == null || !can_edit_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized edit attempt");
      _context.Update(new_item);
      _context.Entry(new_item).Property(x => x.Username).IsModified = false;
      _context.Entry(new_item).Property(x => x.Email).IsModified = false;
      _context.Entry(new_item).Property(x => x.CreatedDate).IsModified = false;
      _context.SaveChanges();
      return Ok();
    }

    [RestrictToUserType(new string[] {"Admin"})]
    [HttpDelete("{id}")]
    [ValidateAntiForgeryToken]
    public IActionResult Delete(int id)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var item = _context.Admin.FirstOrDefault(e => e.Id == id);
      var can_delete_by_token = ApiTokenValid || true;
      if (item == null || !can_delete_by_token)
        return Unauthorized();
        // throw new Exception("Unauthorized delete attempt");
      
      if (!allowed_items.Any(a => a.Id == item.Id)) return Unauthorized(); // throw new Exception("Unauthorized delete attempt");
      HttpContext.Deleted<Admin>(_context, "Admin", item);
      

      _context.Admin.Remove(item);
      _context.SaveChanges();
      return Ok();
    }


    [RestrictToUserType(new string[] {"Admin"})]
    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
    public Page<AdminViewData> GetAll([FromQuery] int page_index, [FromQuery] int page_size = 25)
    {
      var session = HttpContext.Get<LoggableEntities>(_context);
      var current_Admin = session == null ? null : session.Admin;
      
      var allowed_items = ApiTokenValid ? _context.Admin : _context.Admin;
      var editable_items = ApiTokenValid ? _context.Admin : current_Admin != null ? _context.Admin : Enumerable.Empty<Admin>().AsQueryable();
      var can_edit_by_token = ApiTokenValid || true;
      var can_create_by_token = ApiTokenValid || true;
      var can_delete_by_token = ApiTokenValid || true;
      var items = allowed_items.Distinct().OrderBy(i => i.CreatedDate);

      return items
        .Select(PowerBIPoC.Models.Admin.FilterViewableAttributes(current_Admin))
        .Select(s => Tuple.Create(s, can_edit_by_token && editable_items.Any(es => es.Id == s.Id)))
        .Paginate(can_create_by_token, can_delete_by_token, false, page_index, page_size, PowerBIPoC.Models.Admin.WithoutImages, item => AdminViewData.FromAdmin(item));
    }

    

    


    
  }

  