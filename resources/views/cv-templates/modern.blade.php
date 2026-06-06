<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $cv['personal']['name'] ?? 'CV' }} — Modern</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.45; }
        .cv { display: grid; grid-template-columns: 200px 1fr; min-height: 100vh; }
        .cv-sidebar { background: #1a1a2e; color: #fff; padding: 28px 20px; }
        .cv-sidebar h1 { font-size: 18pt; margin-bottom: 6px; line-height: 1.2; }
        .cv-sidebar .headline { font-size: 9pt; color: #f5c040; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
        .cv-contact p { font-size: 8.5pt; margin-bottom: 8px; color: #ddd; word-break: break-word; }
        .cv-main { padding: 28px 32px; }
        .cv-section { margin-bottom: 18px; }
        .cv-section h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a2e; border-bottom: 2px solid #f5c040; padding-bottom: 4px; margin-bottom: 10px; }
        .cv-entry { margin-bottom: 12px; }
        .cv-entry-head { margin-bottom: 4px; }
        .cv-dates { display: block; font-size: 8.5pt; color: #666; font-style: normal; margin-top: 2px; }
        ul { padding-left: 16px; }
        li { margin-bottom: 3px; }
        .cv-skills-inline { color: #444; }
    </style>
</head>
<body>
@php $p = $cv['personal'] ?? []; @endphp
<div class="cv">
    <aside class="cv-sidebar">
        <h1>{{ $p['name'] ?: 'Your Name' }}</h1>
        @if(!empty($p['headline']))<p class="headline">{{ $p['headline'] }}</p>@endif
        <div class="cv-contact">
            @if(!empty($p['email']))<p>{{ $p['email'] }}</p>@endif
            @if(!empty($p['phone']))<p>{{ $p['phone'] }}</p>@endif
            @if(!empty($p['location']))<p>{{ $p['location'] }}</p>@endif
            @if(!empty($p['website']))<p>{{ $p['website'] }}</p>@endif
            @if(!empty($p['linkedin']))<p>{{ $p['linkedin'] }}</p>@endif
        </div>
        @if(!empty($cv['skills']))
            <section class="cv-section" style="margin-top:24px">
                <h2 style="color:#f5c040;border-color:#f5c040">Skills</h2>
                @foreach($cv['skills'] as $skill)
                    <p style="font-size:9pt;margin-bottom:4px">• {{ $skill }}</p>
                @endforeach
            </section>
        @endif
        @if(!empty($cv['languages']))
            <section class="cv-section">
                <h2 style="color:#f5c040;border-color:#f5c040">Languages</h2>
                @foreach($cv['languages'] as $lang)
                    <p style="font-size:9pt;margin-bottom:4px">{{ $lang['language'] }} — {{ $lang['level'] }}</p>
                @endforeach
            </section>
        @endif
    </aside>
    <main class="cv-main">
        @include('cv-templates.partials.sections', ['cv' => array_merge($cv, ['skills' => [], 'languages' => []])])
    </main>
</div>
</body>
</html>
