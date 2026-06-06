<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $cv['personal']['name'] ?? 'CV' }}</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; margin: 36px 40px; line-height: 1.4; }
        h1 { font-size: 16pt; margin-bottom: 4px; }
        .contact { font-size: 10pt; margin-bottom: 16px; }
        h2 { font-size: 11pt; margin: 16px 0 8px; text-transform: uppercase; border-bottom: 1px solid #000; }
        .cv-entry { margin-bottom: 10px; }
        .cv-dates { font-size: 10pt; }
        ul { margin: 4px 0 0 20px; }
    </style>
</head>
<body>
@php $p = $cv['personal'] ?? []; @endphp
<h1>{{ $p['name'] ?: 'Your Name' }}</h1>
<p class="contact">
    {{ implode(' | ', array_filter([$p['email'] ?? '', $p['phone'] ?? '', $p['location'] ?? '', $p['headline'] ?? ''])) }}
</p>
@include('cv-templates.partials.sections')
</body>
</html>
