using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace PowerBIPoC.Services
{
    public interface IMailService
    {
        Task<Response> SendEmailAsync(EmailAddress to, string subject, string plainTextContent, string htmlContent, Dictionary<string, string> subsitutions = null);
    }
}