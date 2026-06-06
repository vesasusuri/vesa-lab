<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>You've been invited to BeeHired</title>
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
      .cred-table td { padding: 18px !important; }
      .logo-img      { max-width: 200px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf8f5;padding:48px 16px;" role="presentation">
    <tr>
      <td align="center">
        <table class="email-wrapper" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;border-radius:24px;overflow:hidden;border:1px solid #f0e6d0;box-shadow:0 8px 40px rgba(180,160,100,0.14);" role="presentation">

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
                          <span style="font-size:11px;font-weight:700;color:#b8940f;letter-spacing:0.1em;text-transform:uppercase;">HR Platform Invitation</span>
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
              <p style="margin:0 0 8px;font-size:26px;font-weight:800;color:#a67c00;line-height:1.25;letter-spacing:-0.01em;text-align:center;">Welcome, {{ $hr->name }}!</p>
              <p style="margin:0 0 32px;font-size:14px;color:#8a8178;line-height:1.75;text-align:center;">
                You've been invited to join <strong style="color:#a67c00;">BeeHired</strong> as an HR user. Sign in with the credentials below, then complete a quick verification to activate your account.
              </p>

              {{-- Credentials card --}}
              <table class="cred-table" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fffefb;border:1px solid #f5edd8;border-radius:16px;margin-bottom:28px;" role="presentation">
                <tr>
                  <td style="padding:24px 28px 22px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#c9a800;">Your Login Email</p>
                    <p style="margin:0 0 22px;font-size:15px;font-weight:600;color:#a67c00;">{{ $hr->email }}</p>

                    <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#c9a800;">Temporary Password</p>
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="background:#fdd535;border-radius:12px;padding:12px 20px;">
                          <span style="font-family:'Courier New',Courier,monospace;font-size:18px;font-weight:700;letter-spacing:0.08em;color:#ffffff;">{{ $tempPassword }}</span>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:12px 0 0;font-size:12px;color:#b0a89e;line-height:1.6;">This temporary password expires in <strong style="color:#a67c00;">48 hours</strong>.</p>
                  </td>
                </tr>
              </table>

              {{-- Steps --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;" role="presentation">
                <tr>
                  <td style="background:#fffefb;border:1px solid #f5edd8;border-radius:16px;padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#c9a800;">How to get started</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                      @foreach([
                        ['1', 'Sign in', "Go to <a href=\"".url('/login')."\" style=\"color:#a67c00;font-weight:600;\">beehired.com/login</a> with your email and the temporary password above."],
                        ['2', 'Verify your email', 'A 4-digit verification code will be sent to this email address after you sign in.'],
                        ['3', 'Set your password', 'Create a strong new password to secure your account and gain full access.'],
                      ] as $i => [$num, $title, $desc])
                      <tr>
                        <td style="padding-bottom:{{ $i < 2 ? '14px' : '0' }};">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                            <tr>
                              <td width="28" valign="top">
                                <div style="width:22px;height:22px;background:#fdd535;border-radius:50%;text-align:center;line-height:22px;">
                                  <span style="font-size:11px;font-weight:800;color:#ffffff;">{{ $num }}</span>
                                </div>
                              </td>
                              <td style="padding-left:12px;vertical-align:top;">
                                <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#a67c00;">{{ $title }}</p>
                                <p style="margin:0;font-size:12px;color:#8a8178;line-height:1.6;">{!! $desc !!}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      @endforeach
                    </table>
                  </td>
                </tr>
              </table>

              {{-- CTA --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;" role="presentation">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr>
                        <td style="background:#fdd535;border-radius:14px;box-shadow:0 4px 16px rgba(253,213,53,0.35);">
                          <a href="{{ url('/login') }}" style="display:inline-block;padding:15px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.01em;line-height:1;">
                            Sign In to BeeHired &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#b0a89e;line-height:1.7;text-align:center;">
                If you were not expecting this invitation, you can safely ignore this email.<br>
                Need help? Contact your platform administrator.
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
                      &copy; {{ date('Y') }} BeeHired &nbsp;&middot;&nbsp; This is an automated message, please do not reply.
                    </p>
                    <p style="margin:0;font-size:11px;">
                      <a href="{{ url('/') }}" style="color:#c9a800;font-weight:600;text-decoration:none;">BeeHired.com</a>
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

</body>
</html>
