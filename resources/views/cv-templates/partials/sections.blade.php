@php
    $p = $cv['personal'] ?? [];
@endphp

@if(!empty($p['summary']))
    <section class="cv-section">
        <h2>Profile</h2>
        <p>{{ $p['summary'] }}</p>
    </section>
@endif

@if(!empty($cv['skills']))
    <section class="cv-section">
        <h2>Skills</h2>
        <p class="cv-skills-inline">{{ implode(' · ', $cv['skills']) }}</p>
    </section>
@endif

@if(!empty($cv['experience']))
    <section class="cv-section">
        <h2>Experience</h2>
        @foreach($cv['experience'] as $exp)
            <div class="cv-entry">
                <div class="cv-entry-head">
                    <strong>{{ $exp['role'] }}</strong>
                    @if(!empty($exp['company']))<span> — {{ $exp['company'] }}</span>@endif
                    @if(!empty($exp['start_date']) || !empty($exp['end_date']))
                        <em class="cv-dates">{{ $exp['start_date'] }} – {{ $exp['end_date'] ?? 'Present' }}</em>
                    @endif
                </div>
                @if(!empty($exp['bullets']))
                    <ul>
                        @foreach($exp['bullets'] as $bullet)
                            <li>{{ $bullet }}</li>
                        @endforeach
                    </ul>
                @elseif(!empty($exp['description']))
                    <p>{{ $exp['description'] }}</p>
                @endif
            </div>
        @endforeach
    </section>
@endif

@if(!empty($cv['education']))
    <section class="cv-section">
        <h2>Education</h2>
        @foreach($cv['education'] as $edu)
            <div class="cv-entry">
                <strong>{{ $edu['institution'] }}</strong>
                @if(!empty($edu['degree'])) — {{ $edu['degree'] }}@endif
                @if(!empty($edu['start_date']) || !empty($edu['end_date']))
                    <em class="cv-dates">{{ $edu['start_date'] }} – {{ $edu['end_date'] }}</em>
                @endif
            </div>
        @endforeach
    </section>
@endif

@if(!empty($cv['projects']))
    <section class="cv-section">
        <h2>Projects</h2>
        @foreach($cv['projects'] as $project)
            <div class="cv-entry">
                <strong>{{ $project['name'] }}</strong>
                @if(!empty($project['technologies']))
                    <span class="cv-tech">({{ implode(', ', $project['technologies']) }})</span>
                @endif
                @if(!empty($project['description']))<p>{{ $project['description'] }}</p>@endif
            </div>
        @endforeach
    </section>
@endif

@if(!empty($cv['languages']))
    <section class="cv-section">
        <h2>Languages</h2>
        <p class="cv-skills-inline">
            @foreach($cv['languages'] as $lang)
                {{ $lang['language'] }} ({{ $lang['level'] }})@if(!$loop->last), @endif
            @endforeach
        </p>
    </section>
@endif

@if(!empty($cv['certifications']))
    <section class="cv-section">
        <h2>Certifications</h2>
        <ul>
            @foreach($cv['certifications'] as $cert)
                <li>{{ $cert['name'] }}@if(!empty($cert['issuer'])) — {{ $cert['issuer'] }}@endif @if(!empty($cert['year'])) ({{ $cert['year'] }})@endif</li>
            @endforeach
        </ul>
    </section>
@endif
