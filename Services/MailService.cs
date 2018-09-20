using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace PowerBIPoC.Services
{
    public class MailServiceOptions
    {
        public string MailApiToken { get; set; }
        public string MailFrom { get; set; }
        public string TemplateId { get; set; }
    }

    public class MailService : IMailService
    {
        private readonly MailServiceOptions _options;
        private SendGridClient _client;

        public MailService(IOptions<MailServiceOptions> options)
        {
            _options = options.Value;
            _client = new SendGridClient(options.Value.MailApiToken);
        }
        
        public Task<Response> SendEmailAsync(EmailAddress to, string subject, string plainTextContent, string htmlContent, Dictionary<string, string> subsitutions = null)
        {
            var mail = MailHelper.CreateSingleEmail(new EmailAddress(_options.MailFrom), to, subject, plainTextContent, htmlContent);
            
            if (_options.TemplateId != null && _options.TemplateId != "")
            {
                mail.TemplateId = _options.TemplateId;
            }

            if (subsitutions != null)
            {
                mail.AddSubstitutions(subsitutions);
            }

            return _client.SendEmailAsync(mail);
        }
    }
}