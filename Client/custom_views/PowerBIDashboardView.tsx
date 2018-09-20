import * as React from 'react';
import * as ViewUtils from '../generated_views/view_utils'
import * as Models from '../generated_models'
import PowerBIReport from '../powerbi-components/powerbi_report';
import { models } from 'powerbi-client';

// Embed configuration used to describe the what and how to embed.
// This object is used when calling powerbi.embed.
// This also includes settings and options such as filters.
// You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
/*
var config = {
  type: 'dashboard',
  tokenType: tokenType == '0' ? models.TokenType.Aad : models.TokenType.Embed,
  accessToken: txtAccessToken,
  embedUrl: txtEmbedUrl,
  id: txtEmbedDashboardId,
  pageView: 'fitToWidth'
};
*/
interface PowerBIDashboardViewState {
  id: string
  embedUrl: string
  accessToken: string
};

class PowerBIDashboardView extends React.Component<ViewUtils.EntityComponentProps<Models.BIDiagram>, PowerBIDashboardViewState> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      id: "b5f50796-6e97-4dc5-a755-00cf4405e029",
      embedUrl: "https://app.powerbi.com/dashboardEmbed?dashboardId=b5f50796-6e97-4dc5-a755-00cf4405e029&groupId=be8908da-da25-452e-b220-163f52476cdd",
      accessToken: 'H4sIAAAAAAAEACWWxQ70WA5G3-XfZqQwjdSLMFZSYdiFmTmtefepVu-tK-vc48_--883efopyf_89w8EYxLRksDo7xKxubaImEIfRygz2S1dqM7hQxCxZ7RRahfgnX3cmVr5Eb1BG9AepjWDL92Z2wOOmZQWHYxEzWyetaJUZkvpEcVKj0_XFZZBf6J-0beCNXkzRxTZe-Qv6KqKTeD3qux02HOXUNUyxs8fIuDzor8aDdNrPH-WA4u8TzNLOfR-_XAE9abzQj3lleH-cFh2kkgAlFcDZ4_uRKhsHA2M0dBn5vF-UQTBfaoWMiGsH6azp_RIuRUsNoTe8UaxOXy77-dgyGlVHVqsTARUyBCqMHkELrP2sclUHD3kaSyzx_THMgnQoJfan8624QnnU91hCpF55rcdJ0NqvsWdmDFTcaYlWTGPgUlxWMPHhwttXdbKZhVaQ2F_-F12b7-HYTHqFWyy5jJ7b-I9yUXf_G4UQvKCT23vJeXn3QXSbHwEBf-1m1q3R-n2OajainZ_Iwp95ykQQPN5SIPXywIVprhYlMqpJD6L9l4XO6HYC52Y49nmkmroWfGbfOeMqVS7cWZIv71GZiTDnOGznNgsTRujKWfG0Sbaa56NxbOviA9GyY_DWrvftBKWq4e3uGaJuwQ-kFW3uc1PLM3exnJ9qcHfUW9wsbLjwUT3rlpSypXwo6MlQLSsAcy4_Gd-LCopnw8rg8g4IdDJ0Cii6SHClxa3SUIArwLpAlSKc3mWz518dE4hDBj99NxRkMtTpaAjK8wqL6vPQ3mH92rcK5mS1UI4yX3IhlV9FrpY7yF7u_tHNTWg4Z395y_YukhIUpQMXI1R3tdy-6ZuoVXGiP6NaBt_iOTwOSOoAiLspzKmQJEjfyQg5UsZNb3fG03qKSfB9KaH-kZ_p4Yne9xN-igOCkXuoxsMQZCjBvFPXwI9XjJT7Y4HcgkWRn8aj0SepTh5ABXOFPuVWbJRu55q1GaFOuD-aAFS3AyT-YhGJA8KNlXPWikEXMzBd74Xpwl8xh8DuHLjru_tYXrcv8Sw-uk5ZgXhKeiN26uLPhYShMJvcHpLWs74fNd4sDU08T3ObHKJ-lbNCXnIXu2y8vgEuHav0ANwuAWUxaMcw1Im0p6SBOummSHj1SYsuC-xg4_sdVF14GMumWzfpYpTgBzYsYaZLiWPZhuGTbOEOzHmd2qs7HA9EZY1wwb70dYDN_FH2FC8RJzGPe5KPdfiaVMq9tqRr2VC9WaiJWwJAveluGqAjAFu6iwGsyPLy5q8hw1x-pHVsE3fdmTR4_LVPoIqVVSTHbwIxQ4aG2wacYeiUOzxkdwe6THZiUwkfaxck48gn2KmZKeayvwtAHx9opsM-TbF2J4nR1rEF6w2MCO6sbHUyjEkTDjoh0qnUO1Dny-3F1ArJPyqiso8HpfftkBdX9866enY8JJSj5O2bAJbG4Yq2uq5ynpkKwow6ta1aVEimqLlKqpMPZwN3Pmci28P8dRHVtUWBHN99zySlJamEnsQ0dwOxkNPUg70fl95M8qmewRKy5IOexlcwrbvBwdbqW3b00M4iqu7VuctIKDfGDGMWwUeY0aCRL-o2AQu137DenPGZOaMYqisNgiRrkU8PCnpSALGHGhWFq7ztBMUTcXw7aoFQ6Kjg7-78NEojr0bOW3V5n5A-V6BdeEiVbPFY4W9d5mAuYLHatNbmkAWih5WNx-BKC2ryijr_ggOWWGVQoS0Qbakzpav9eW7Q7AwGsnexh5jPrVPKOhCQ2c15DWg6m5miPmlrW053O25PQ5VyPa47W8T_SaNelDiuRipTL83iVr3r1W58Jz1k4GZE3HksNr30QU--ZVJYtjloJ3RLVnPjvcjrDHS8rtwNzx8jMJLjSgEEG8nqYarCDXOnqNOX09Qt-qoRbnu7byonM2D5ZgXJnSXK5G3KPy9p8qUMJFv0GSM0h4E3aUbqIWCJSUMyNcNmwofteNImFmbYMhi1Uf0s4FAYtDvBRkIjjA-cZm2sklwvPKkQ2Xw0wP2zG5wCt3qdlr9vB2plEsleHsAztskQRvq9K3hMGriHpryIISU8z7b0nTs85Zk_3CUPm8XBYQwQuRB0q0YiuQxkMWEOtilDy_w_IG2y-riPxtf0MsBlsSmxXVAhCyeJcFkjuQfcE9T9Z2ejt8EnfFu7SJSrdHxG3CEhCAsYTAZDQ-Z4zFjsmlNbPa5ldSN6mvXQyrnhghh2vga9Z731tS-vChLamEW62w7YIZ6DSaUhfbL8vH376QCK-O7NEj7FJXbjTnpnR9Fp6h9F5Zx73PDN31I5jrulHsoh_785w-3PvM-acXzO2dGxv114ak_X-t4H6jJqeGsbNyXjlr7AUuf9qX2gFOiUonlWHGf7mG9ni7AMB8cAuGqiDPNH_Tkjq-mFk6H2PPJXhuCfikp2jBKYL8G4cj5Pl-bQCgJ7pTRaXMs595XeZuKXXke6HPpyOTUmbp5bx6i6WHgsxPdlvZthCDOZzEEkoiHHFi4-eQ7T-KCXrDVH41STO6FVfOypKuda5aTm-46P0OHw8IaQ99aUTpq1gnhjA7D7-G7CdJlxFOO4cJ9VGkcdDrilVNQNcrTzHL0rvkyYkeUwzBhgr96gK2Ji1Yx7zlvgu3sB_SBYp4PhBUxvKSHfOBqsa8wTHSauYqjX_yKzF9__YP5metiVfwf5aYNiTvG31ZuMcfFrM1Pn-7fKqepxmQ_1uJXlhRX7hV7xnQX_LV6AyvUSCESB15Ea4IMqyiB70uF2_wL3riKAGbN410kQrzAuFl-2cWCbi3e2gvDOP-oy63tIeM7XOxmO4OPxuphUrzEBpM4I_jLb0eg3jzAKPiy9WzBo-exD8qu2iztbGN59-xp6Si3IMh9ExTVrGEFC0v_VPLeAarSfiqf7ICy25eV5BffaNzk61yt0RqBDeCVPo1ImPKvQXaFORHuMThMOYbbhL3hWc-fSX4D4vKKY2j5s-AHO2UKYfsNTph22vAeLP9bJ8zb-776ZJBqm8DvptZjvh1POR9qvDtv5HtVzWjX9gY7WKvKAQ8Rhf_ZMU6PDyQa5oW9rR_m__0fyXbM-MILAAA='
    }
  }

  onEmbedded(embed) {
    console.log(`Report embedded: `, embed, this);
  }

  render() {
    return (
      <div>
        <h1>react-powerbi demo</h1>
        <PowerBIReport
          id={this.state.id}
          embedUrl={this.state.embedUrl}
          accessToken={this.state.accessToken}
          filterPaneEnabled={true}
          navContentPaneEnabled={false}
          onEmbedded={this.onEmbedded}
        />
      </div>
    );
  }
}

export default PowerBIDashboardView;

