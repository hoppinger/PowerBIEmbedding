using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using Newtonsoft.Json.Linq;
using PowerBIPoC.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;


namespace PowerBIPoC.Controllers
{
  [Route("[controller]")]
  public partial class TokenGeneratorController : Controller
  {
    private readonly PowerBIPoCContext _context;
    private readonly ProjectNameOptions _projectNameOptions;

    public TokenGeneratorController(PowerBIPoCContext context, IOptions<ProjectNameOptions> projectNameOptions)
    {
      _context = context;
      _projectNameOptions = projectNameOptions.Value;
    }

    [HttpGet("getToken")]
    public async Task<IActionResult> getToken()
    {
      var ReportId = "94e1e85c-1bce-4d7b-ad4b-ec033d76f687";
      string WorkspaceId = "67e42a29-223a-4249-b5ed-18afc811024f";
      var tokenCredentials = await GetAccessToken();
      var result = new EmbedConfig();

      // Create a Power BI Client object (it will be used to call Power BI APIs)
      using (var client = new PowerBIClient(new Uri("https://api.powerbi.com/"), tokenCredentials))
      {

        // Get a list of all groupts
        //var reports = client.Groups.GetGroups();
        var reports = await client.Reports.GetReportsInGroupAsync(WorkspaceId);
        if (reports.Value.Count() == 0)
        {
          result.ErrorMessage = "No reports were found in the workspace";
          return Ok(result);
        }

        Report report;
        if (string.IsNullOrWhiteSpace(ReportId))
        {
          // Get the first report in the workspace.
          report = reports.Value.FirstOrDefault();
        }
        else
        {
          report = reports.Value.FirstOrDefault(r => r.Id == ReportId);
        }

        if (report == null)
        {
          result.ErrorMessage = "No report with the given ID was found in the workspace. Make sure ReportId is valid.";
          return Ok(result);
        }

        var datasets = await client.Datasets.GetDatasetByIdInGroupAsync(WorkspaceId, report.DatasetId);
        result.IsEffectiveIdentityRequired = datasets.IsEffectiveIdentityRequired;
        result.IsEffectiveIdentityRolesRequired = datasets.IsEffectiveIdentityRolesRequired;
        /*
        GenerateTokenRequest generateTokenRequestParameters;
        // This is how you create embed token with effective identities
        if (!string.IsNullOrWhiteSpace(username))
        {
          var rls = new EffectiveIdentity(username, new List<string> { report.DatasetId });
          if (!string.IsNullOrWhiteSpace(roles))
          {
            var rolesList = new List<string>();
            rolesList.AddRange(roles.Split(','));
            rls.Roles = rolesList;
          }
          // Generate Embed Token with effective identities.
          generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view", identities: new List<EffectiveIdentity> { rls });
        }
        else
        {
          // Generate Embed Token for reports without effective identities.
          generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
        }
        */
        var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");


        var tokenResponse = await client.Reports.GenerateTokenInGroupAsync(WorkspaceId, report.Id, generateTokenRequestParameters);

        if (tokenResponse == null)
        {
          result.ErrorMessage = "Failed to generate embed token.";
          return Ok(result);
        }

        // Generate Embed Configuration.
        result.EmbedToken = tokenResponse;
        result.EmbedUrl = report.EmbedUrl;
        result.Id = report.Id;

        return Ok(result);
      }
    }
    /*
         <add key="applicationId" value="dc69b67e-5449-441f-8407-96007cd97711" />
      <add key="workspaceId" value="67e42a29-223a-4249-b5ed-18afc811024f" />
      <add key="reportId" value="94e1e85c-1bce-4d7b-ad4b-ec033d76f687" />
      <add key="pbiUsername" value="pavelkucherov@hoppinger.com" />
      <add key="pbiPassword" value="test1234" />
      <add key="authorityUrl" value="https://login.microsoftonline.com/common/oauth2/authorize" />
      <add key="resourceUrl" value="https://analysis.windows.net/powerbi/api" />
      <add key="apiUrl" value="https://api.powerbi.com" />
      <add key="embedUrlBase" value="https://app.powerbi.com" />
     */

    private async Task<TokenCredentials> GetAccessToken()
    {
      using (HttpClient client = new HttpClient())
      {
        var tokenEndpoint = "https://login.microsoftonline.com/common/oauth2/authorize";
        var accept = "application/json";
        var userName = "pavelkucherov@hoppinger.com";
        var password = "12213243";
        var clientId = "dc69b67e-5449-441f-8407-96007cd97711";

        client.DefaultRequestHeaders.Add("Accept", accept);
        string postBody = null;

        postBody = $@"resource=https%3A%2F%2Fanalysis.windows.net/powerbi/api
                        &client_id={clientId}
                        &grant_type=password
                        &username={userName}
                        &password={password}
                        &scope=openid";

        var tokenResult = await client.PostAsync(tokenEndpoint, new StringContent(postBody, Encoding.UTF8, "application/x-www-form-urlencoded"));
        tokenResult.EnsureSuccessStatusCode();
        var tokenData = await tokenResult.Content.ReadAsStringAsync();

        JObject parsedTokenData = JObject.Parse(tokenData);

        var token = parsedTokenData["access_token"].Value<string>();
        return new TokenCredentials(token, "Bearer");
      }
    }
  }
}
