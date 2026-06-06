<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $cv['personal']['name'] ?? 'CV' }} — Minimal</title>
    <style>
        body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #222; max-width: 700px; margin: 0 auto; padding: 40px 48px; line-height: 1.5; }
        header { text-align: center; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 1px solid #ccc; }
        h1 { font-size: 22pt; font-weight: normal; letter-spacing: 0.02em; }
        .meta { font-size: 9.5pt; color: #555; margin-top: 8px; }
        .cv-section { margin-bottom: 20px; }
        .cv-section h2 { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.15em; color: #888; margin-bottom: 10px; }
        .cv-entry { margin-bottom: 14px; }
        .cv-dates { font-size: 9pt; color: #777; }
        ul { padding-left: 18px; }
    </style>
</head>
<body>
@php
    $p = $cv['personal'] ?? [];
    $contact = array_filter([$p['email'] ?? '', $p['phone'] ?? '', $p['location'] ?? '']);
@endphp
<header>
    <h1>{{ $p['name'] ?: 'Your Name' }}</h1>
    @if(!empty($p['headline']))<p class="meta">{{ $p['headline'] }}</p>@endif
    @if(count($contact))<p class="meta">{{ implode(' · ', $contact) }}</p>@endif
</header>
@include('cv-templates.partials.sections')
</body>
</html>
