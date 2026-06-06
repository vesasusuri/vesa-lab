<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your BeeHired Verification Code</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #faf8f5; }
    table { border-collapse: collapse; }
    img   { border: 0; display: block; }
    a     { text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; }
      .email-body    { padding: 28px 20px !important; }
      .email-header  { padding: 28px 24px !important; }
      .code-display  { font-size: 48px !important; letter-spacing: 0.28em !important; }
      .logo-img      { max-width: 200px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf8f5;padding:48px 16px;" role="presentation">
    <tr>
      <td align="center">
        <table class="email-wrapper" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;border-radius:24px;overflow:hidden;border:1px solid #f0e6d0;box-shadow:0 8px 40px rgba(180,160,100,0.14);" role="presentation">

          {{-- ══ TOP ACCENT BAR ══ --}}
          <tr>
            <td style="background:#fdd535;height:5px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          {{-- ══ HEADER ══ --}}
          <tr>
            <td class="email-header" style="background:#ffffff;padding:36px 40px 28px;border-bottom:1px solid #f5edd8;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td align="center">
                    <a href="{{ url('/') }}" style="display:inline-block;">
                      <img
                        class="logo-img"
                        src="{{ asset('images/logo-email.png') }}"
                        alt="Bee Hired"
                        width="220"
                        style="max-width:220px;width:100%;height:auto;margin:0 auto;"
                      >
                    </a>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin:18px auto 0;" role="presentation">
                      <tr>
                        <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:999px;padding:7px 16px;">
                          <span style="font-size:11px;font-weight:700;color:#b8940f;letter-spacing:0.1em;text-transform:uppercase;">Security Verification</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {{-- ══ BODY ══ --}}
          <tr>
            <td class="email-body" style="background:#ffffff;padding:36px 40px 32px;">

              {{-- Greeting --}}
              <p style="margin:0 0 8px;font-size:26px;font-weight:800;color:#a67c00;line-height:1.25;letter-spacing:-0.01em;text-align:center;">Verify your identity</p>
              <p style="margin:0 0 32px;font-size:14px;color:#8a8178;line-height:1.75;text-align:center;">
                Hi <strong style="color:#a67c00;">{{ $hr->name }}</strong>, use the code below to complete your BeeHired account setup. This code is valid for <strong style="color:#a67c00;">10 minutes</strong>.
              </p>

              {{-- Code display --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;" role="presentation">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" style="background:#fffefb;border:2px solid #fdd535;border-radius:20px;padding:32px 40px;box-shadow:0 4px 24px rgba(253,213,53,0.18);" role="presentation">
                      <tr>
                        <td align="center">
                          <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#c9a800;">Your Verification Code</p>
                          <p class="code-display" style="margin:0;font-family:'Courier New',Courier,monospace;font-size:60px;font-weight:900;color:#a67c00;letter-spacing:0.38em;line-height:1;">{{ $code }}</p>
                          <table cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;" role="presentation">
                            <tr>
                              <td style="background:#fdd535;border-radius:999px;padding:8px 18px;">
                                <span style="font-size:12px;font-weight:700;color:#ffffff;letter-spacing:0.04em;">Expires in 10 minutes</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {{-- Instructions --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;" role="presentation">
                <tr>
                  <td style="background:#fffefb;border:1px solid #f5edd8;border-radius:16px;padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#c9a800;">How to use this code</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                            <tr>
                              <td width="28" valign="top">
                                <div style="width:22px;height:22px;background:#fdd535;border-radius:50%;text-align:center;line-height:22px;">
                                  <span style="font-size:11px;font-weight:800;color:#ffffff;">1</span>
                                </div>
                              </td>
                              <td style="padding-left:12px;vertical-align:top;">
                                <p style="margin:0;font-size:13px;color:#8a8178;line-height:1.65;">
                                  Return to the BeeHired account setup page in your browser.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                            <tr>
                              <td width="28" valign="top">
                                <div style="width:22px;height:22px;background:#fdd535;border-radius:50%;text-align:center;line-height:22px;">
                                  <span style="font-size:11px;font-weight:800;color:#ffffff;">2</span>
                                </div>
                              </td>
                              <td style="padding-left:12px;vertical-align:top;">
                                <p style="margin:0;font-size:13px;color:#8a8178;line-height:1.65;">
                                  Enter the <strong style="color:#a67c00;">{{ $code }}</strong> code in the verification field and click <strong style="color:#a67c00;">Verify code</strong>.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {{-- Security warning --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;" role="presentation">
                <tr>
                  <td style="background:#fffbeb;border:1px solid #fde68a;border-left:4px solid #fdd535;border-radius:12px;padding:14px 18px;">
                    <p style="margin:0;font-size:12px;color:#b8940f;line-height:1.7;">
                      <strong>Security notice:</strong> BeeHired will never ask for this code via phone or chat. If you did not request this code, please ignore this email and contact your administrator immediately.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#b0a89e;line-height:1.7;text-align:center;">
                If the code has expired, return to the account setup page and click <strong style="color:#a67c00;">"Resend code"</strong> to receive a new one.
              </p>

            </td>
          </tr>

          {{-- ══ FOOTER ══ --}}
          <tr>
            <td style="background:#fffefb;border-top:1px solid #f5edd8;padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td align="center">
                    <img
                      src="{{ asset('images/logo-email.png') }}"
                      alt="Bee Hired"
                      width="120"
                      style="max-width:120px;width:120px;height:auto;margin:0 auto 14px;opacity:0.85;"
                    >
                    <p style="margin:0 0 6px;font-size:11px;color:#c0b9b2;line-height:1.7;">
                      &copy; {{ date('Y') }} BeeHired &nbsp;&middot;&nbsp; This is an automated security message.
                    </p>
                    <p style="margin:0;font-size:11px;">
                      <a href="{{ url('/') }}" style="color:#c9a800;font-weight:600;text-decoration:none;">BeeHired.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {{-- ══ BOTTOM ACCENT BAR ══ --}}
          <tr>
            <td style="background:#fdd535;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
