<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $cv['personal']['name'] ?? 'CV' }} — Creative</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 10.5pt; color: #2d2d2d; margin: 0; }
        .banner { background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 60%, #f5c040 100%); color: #fff; padding: 32px 40px; }
        .banner h1 { font-size: 26pt; font-weight: 700; margin-bottom: 6px; }
        .banner .headline { font-size: 11pt; opacity: 0.9; }
        .banner .contact { margin-top: 12px; font-size: 9pt; opacity: 0.85; }
        .content { padding: 28px 40px; }
        .cv-section h2 { font-size: 11pt; color: #1a1a2e; margin-bottom: 10px; padding-left: 10px; border-left: 4px solid #f5c040; }
        .cv-entry { margin-bottom: 12px; padding-left: 10px; }
        .cv-dates { color: #f5a623; font-size: 9pt; font-weight: 600; }
        ul { padding-left: 16px; }
    </style>
</head>
<body>
@php $p = $cv['personal'] ?? []; @endphp
<div class="banner">
    <h1>{{ $p['name'] ?: 'Your Name' }}</h1>
    @if(!empty($p['headline']))<p class="headline">{{ $p['headline'] }}</p>@endif
    <p class="contact">{{ implode(' · ', array_filter([$p['email'] ?? '', $p['phone'] ?? '', $p['location'] ?? ''])) }}</p>
</div>
<div class="content">
    @include('cv-templates.partials.sections')
</div>
</body>
</html>
