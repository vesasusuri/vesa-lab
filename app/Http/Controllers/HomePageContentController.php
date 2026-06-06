<?php

namespace App\Http\Controllers;

use App\Models\HomePageContent;
use App\Models\HomePageSection;
use App\Support\HomePageMediaUrl;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomePageContentController extends Controller
{
    private const DEFAULT_CONTENT = [
        'proof_text' => '1k+ student reviews',
        'hero_title' => 'Build skills. New opportunities.',
        'hero_subtitle' => 'Bee Hired helps you discover new job opportunities and move confidently toward your next step.',
        'primary_cta' => 'Explore the job market',
        'secondary_cta' => 'Browse Jobs',
        'categories_title' => 'Popular category',
        'categories_cta' => 'View All',
        'companies_eyebrow' => 'Top employers',
        'companies_title' => 'Discover companies hiring right now',
        'companies_description' => 'Explore standout companies, compare team size and location, and find the places where your next role could start.',
        'companies_cta' => 'Browse companies',
        'companies_page_hero_eyebrow' => 'Companies',
        'companies_page_hero_title' => 'Discover companies hiring right now',
        'companies_page_hero_description' => 'Compare employers, learn about their teams, and find the place where your next role could start.',
        'companies_page_featured_title' => 'Featured companies',
        'companies_page_featured_description' => 'A curated list of employers actively looking for new talent.',
        'companies_page_primary_cta' => 'Browse companies',
        'find_job_title' => 'Find Your Next Opportunity',
        'find_job_highlight' => 'Opportunity',
        'find_job_description' => 'Browse 20+ open positions across top companies. Your dream job is one search away.',
        'find_job_cta' => 'Explore the job market',
        'about_hero_eyebrow' => 'About Bee Hired',
        'about_hero_title' => 'People hire people. BeeHired keeps it fair.',
        'about_hero_description' => 'From the first announcement to the final shortlist, every step stays visible, structured, and easy for teams to manage together.',
        'about_mission_title' => 'Built to keep hiring clear, structured, and easy to manage',
        'about_mission_description' => 'Recruitment is often fragmented across email, spreadsheets, and disconnected tools. BeeHired consolidates announcements, applications, evaluations, and decisions in one secure platform.',
        'about_overview_eyebrow' => null,
        'about_hero_bg_image' => null,
        'about_stats_title' => 'Our Work',
        'about_primary_cta' => 'Read About BeeHired',
        'pricing_hero_eyebrow' => 'Pricing',
        'pricing_hero_title' => 'Scale your team, not your costs.',
        'pricing_hero_description' => 'Launch lean, scale as you grow, and keep every hiring decision visible from first application to final offer.',
        'pricing_primary_cta' => 'Get Started',
        'contact_page_hero_eyebrow' => 'Contact',
        'contact_page_hero_title' => 'Talk to the Bee Hired team',
        'contact_page_hero_description' => 'Send us a message and we will help with accounts, HR profiles, or platform questions.',
        'contact_page_form_title' => 'Send a message',
        'contact_page_form_description' => 'Tell us what you need and the team will respond as soon as possible.',
        'contact_page_primary_cta' => 'Send message',
        'jobs_page_hero_title' => 'Find the right job for your next step',
        'jobs_page_hero_description' => 'Search roles across design, engineering, marketing, business, and more.',
        'jobs_page_filter_title' => 'Search jobs',
        'jobs_page_listings_title' => 'Latest opportunities',
        'jobs_page_primary_cta' => 'View jobs',
    ];

    private const DEFAULT_SECTIONS = [
        [
            'key' => 'banner',
            'title' => 'Banner Section',
            'is_active' => true,
            'sort_order' => 1,
            'items' => [
                ['title' => 'Avatar 1', 'image_url' => 'https://i.pravatar.cc/80?img=47', 'image_alt' => 'Banner avatar 1', 'sort_order' => 1, 'is_active' => true],
                ['title' => 'Avatar 2', 'image_url' => 'https://i.pravatar.cc/80?img=32', 'image_alt' => 'Banner avatar 2', 'sort_order' => 2, 'is_active' => true],
                ['title' => 'Avatar 3', 'image_url' => 'https://i.pravatar.cc/80?img=68', 'image_alt' => 'Banner avatar 3', 'sort_order' => 3, 'is_active' => true],
            ],
        ],
        [
            'key' => 'trusted_by',
            'title' => 'Trusted By',
            'is_active' => true,
            'sort_order' => 2,
            'items' => [
                ['title' => 'Borek', 'image_url' => 'https://dummyimage.com/100x100/f3f4f6/111827&text=Borek', 'image_alt' => 'Borek', 'metadata' => ['width' => 100, 'height' => 100], 'sort_order' => 1, 'is_active' => true],
                ['title' => 'Munda', 'image_url' => 'https://dummyimage.com/160x120/f3f4f6/111827&text=Munda', 'image_alt' => 'Munda', 'metadata' => ['width' => 160, 'height' => 120], 'sort_order' => 2, 'is_active' => true],
                ['title' => 'NFON', 'image_url' => 'https://dummyimage.com/140x100/f3f4f6/111827&text=NFON', 'image_alt' => 'NFON', 'metadata' => ['width' => 140, 'height' => 100], 'sort_order' => 3, 'is_active' => true],
                ['title' => 'Outsorcy', 'image_url' => 'https://dummyimage.com/120x100/f3f4f6/111827&text=Outsorcy', 'image_alt' => 'Outsorcy', 'metadata' => ['width' => 120, 'height' => 100], 'sort_order' => 4, 'is_active' => true],
                ['title' => 'Shkolla Digjitale', 'image_url' => 'https://dummyimage.com/130x100/f3f4f6/111827&text=ShD', 'image_alt' => 'Shkolla Digjitale', 'metadata' => ['width' => 130, 'height' => 100], 'sort_order' => 5, 'is_active' => true],
                ['title' => 'Speeex', 'image_url' => 'https://dummyimage.com/130x100/f3f4f6/111827&text=Speeex', 'image_alt' => 'Speeex', 'metadata' => ['width' => 130, 'height' => 100], 'sort_order' => 6, 'is_active' => true],
                ['title' => 'Telkos', 'image_url' => 'https://dummyimage.com/130x100/f3f4f6/111827&text=Telkos', 'image_alt' => 'Telkos', 'metadata' => ['width' => 130, 'height' => 100], 'sort_order' => 7, 'is_active' => true],
            ],
        ],
        [
            'key' => 'categories',
            'title' => 'Popular categories',
            'is_active' => true,
            'sort_order' => 3,
            'items' => [
                ['title' => 'Graphics & Design', 'metadata' => ['slug' => 'graphics-design', 'positions' => 357, 'iconKey' => 'FaPenNib'], 'sort_order' => 1, 'is_active' => true],
                ['title' => 'Code & Programing', 'metadata' => ['slug' => 'code-programming', 'positions' => 312, 'iconKey' => 'FaCode'], 'sort_order' => 2, 'is_active' => true],
                ['title' => 'Digital Marketing', 'metadata' => ['slug' => 'digital-marketing', 'positions' => 297, 'iconKey' => 'FaBullhorn'], 'sort_order' => 3, 'is_active' => true],
                ['title' => 'Video & Animation', 'metadata' => ['slug' => 'video-animation', 'positions' => 247, 'iconKey' => 'FaCirclePlay'], 'sort_order' => 4, 'is_active' => true],
                ['title' => 'Music & Audio', 'metadata' => ['slug' => 'music-audio', 'positions' => 204, 'iconKey' => 'FaMusic'], 'sort_order' => 5, 'is_active' => true],
                ['title' => 'Account & Finance', 'metadata' => ['slug' => 'account-finance', 'positions' => 167, 'iconKey' => 'FaChartColumn'], 'sort_order' => 6, 'is_active' => true],
                ['title' => 'Health & Care', 'metadata' => ['slug' => 'health-care', 'positions' => 125, 'iconKey' => 'FaBriefcaseMedical'], 'sort_order' => 7, 'is_active' => true],
                ['title' => 'Data & Science', 'metadata' => ['slug' => 'data-science', 'positions' => 57, 'iconKey' => 'FaDatabase'], 'sort_order' => 8, 'is_active' => true],
            ],
        ],
        [
            'key' => 'companies_cards',
            'title' => 'Featured companies',
            'is_active' => true,
            'sort_order' => 4,
            'items' => [
                ['title' => 'NFON', 'description' => 'Build scalable communication tools used by modern distributed teams.', 'subtitle' => 'Cloud Communications', 'image_url' => 'https://dummyimage.com/120x80/f3f4f6/111827&text=NFON', 'image_alt' => 'NFON', 'metadata' => ['companyId' => 1, 'employees' => '900+ employees', 'location' => 'Prizren, Kosovo', 'openRoles' => '12 open roles', 'detailIntro' => 'Learn about NFON and read feedback shared by people who have worked there.', 'history' => 'NFON started as a cloud communications pioneer and quickly expanded into a trusted partner for modern business telephony. Their teams now support companies across Europe with secure and scalable collaboration solutions.', 'reviews' => [['id' => 1, 'author' => 'Ardita M.', 'role' => 'Frontend Developer', 'rating' => 5, 'comment' => 'Strong engineering culture, clear goals, and very supportive teammates.'], ['id' => 2, 'author' => 'Luan K.', 'role' => 'QA Engineer', 'rating' => 4, 'comment' => 'Good process and mentorship. Product ownership is taken seriously here.']]], 'sort_order' => 1, 'is_active' => true],
                ['title' => 'Outsorcy', 'description' => 'Fast-moving support and operations teams with strong growth across Europe.', 'subtitle' => 'Outsourcing & Support', 'image_url' => 'https://dummyimage.com/120x80/f3f4f6/111827&text=Outsorcy', 'image_alt' => 'Outsorcy', 'metadata' => ['companyId' => 2, 'employees' => '150+ employees', 'location' => 'Pristina, Kosovo', 'openRoles' => '8 open roles', 'detailIntro' => 'Learn about Outsorcy and read feedback shared by people who have worked there.', 'history' => 'Outsorcy began with a focus on operational excellence and customer support services. Over time, it has built multidisciplinary teams delivering scalable outsourcing solutions for international clients.', 'reviews' => [['id' => 1, 'author' => 'Blerim S.', 'role' => 'Operations Lead', 'rating' => 4, 'comment' => 'Clear communication and lots of opportunities to take initiative.'], ['id' => 2, 'author' => 'Rina A.', 'role' => 'Support Specialist', 'rating' => 5, 'comment' => 'Friendly culture and consistent training make onboarding very smooth.']]], 'sort_order' => 2, 'is_active' => true],
                ['title' => 'Borek', 'description' => 'Well-known regional brand expanding its operations, logistics, and customer teams.', 'subtitle' => 'Food & Retail', 'image_url' => 'https://dummyimage.com/120x80/f3f4f6/111827&text=Borek', 'image_alt' => 'Borek', 'metadata' => ['companyId' => 3, 'employees' => '300+ employees', 'location' => 'Prizren, Kosovo', 'openRoles' => '6 open roles', 'detailIntro' => 'Learn about Borek and read feedback shared by people who have worked there.', 'history' => 'Borek has evolved from a local food brand into a recognized regional name with growing retail and logistics operations. Its expansion is driven by reliable service and a customer-first approach.', 'reviews' => [['id' => 1, 'author' => 'Vesa T.', 'role' => 'Marketing Coordinator', 'rating' => 4, 'comment' => 'The brand is well-known and teams work closely across departments.']]], 'sort_order' => 3, 'is_active' => true],
                ['title' => 'Munda', 'description' => 'Product-focused company shipping design and development work for international clients.', 'subtitle' => 'Digital Product Studio', 'image_url' => 'https://dummyimage.com/120x80/f3f4f6/111827&text=Munda', 'image_alt' => 'Munda', 'metadata' => ['companyId' => 4, 'employees' => '120+ employees', 'location' => 'Pristina, Kosovo', 'openRoles' => '5 open roles', 'detailIntro' => 'Learn about Munda and read feedback shared by people who have worked there.', 'history' => 'Munda grew as a digital product studio focused on design and software delivery for international partners. It combines product thinking with engineering quality to build meaningful user experiences.', 'reviews' => [['id' => 1, 'author' => 'Arbnor J.', 'role' => 'UI/UX Designer', 'rating' => 5, 'comment' => 'Creative freedom and strong collaboration between design and dev teams.']]], 'sort_order' => 4, 'is_active' => true],
                ['title' => 'Speeex', 'description' => 'Remote-friendly teams building communication and localization services at speed.', 'subtitle' => 'Language Services', 'image_url' => 'https://dummyimage.com/120x80/f3f4f6/111827&text=Speeex', 'image_alt' => 'Speeex', 'metadata' => ['companyId' => 5, 'employees' => '80+ employees', 'location' => 'Remote First', 'openRoles' => '4 open roles', 'detailIntro' => 'Learn about Speeex and read feedback shared by people who have worked there.', 'history' => 'Speeex started as a language services team and expanded into a remote-first organization supporting multilingual communication worldwide. Flexibility and quality are central to its growth.', 'reviews' => [['id' => 1, 'author' => 'Jonida M.', 'role' => 'Localization Specialist', 'rating' => 5, 'comment' => 'Remote setup is excellent and communication stays very organized.']]], 'sort_order' => 5, 'is_active' => true],
                ['title' => 'Shkolla Digjitale', 'description' => 'Education and technology teams helping the next generation build practical digital skills.', 'subtitle' => 'Education', 'image_url' => 'https://dummyimage.com/120x80/f3f4f6/111827&text=ShD', 'image_alt' => 'Shkolla Digjitale', 'metadata' => ['companyId' => 6, 'employees' => '60+ employees', 'location' => 'Pristina, Kosovo', 'openRoles' => '7 open roles', 'detailIntro' => 'Learn about Shkolla Digjitale and read feedback shared by people who have worked there.', 'history' => 'Shkolla Digjitale was founded to help students build practical digital skills through hands-on education. It now serves a broad community through modern learning programs and industry-focused training.', 'reviews' => [['id' => 1, 'author' => 'Besart F.', 'role' => 'Program Instructor', 'rating' => 5, 'comment' => 'Mission-driven environment where education and innovation go together.']]], 'sort_order' => 6, 'is_active' => true],
            ],
        ],
        [
            'key' => 'find_job',
            'title' => 'Find job CTA',
            'is_active' => true,
            'sort_order' => 5,
            'items' => [
                [
                    'title' => 'Find Your Next Opportunity',
                    'subtitle' => 'Opportunity',
                    'description' => 'Browse 20+ open positions across top companies. Your dream job is one search away.',
                    'cta_text' => 'Explore the job market',
                    'metadata' => ['ctaHref' => '/jobs'],
                    'sort_order' => 1,
                    'is_active' => true,
                ],
            ],
        ],
        [
            'key' => 'testimonials',
            'title' => 'What our clients say about us',
            'is_active' => true,
            'sort_order' => 6,
            'items' => [
                ['title' => 'Ardit Krasniqi', 'subtitle' => 'Junior Developer, Kosovo', 'description' => 'This platform helped me land my first developer job way faster than I expected. The process was smooth, and the job matches were actually relevant to my skills.', 'sort_order' => 1, 'is_active' => true],
                ['title' => 'Elena Schmidt', 'subtitle' => 'HR Manager, Germany', 'description' => 'We were able to hire two highly qualified engineers within weeks. The candidate quality here is honestly on another level compared to other platforms.', 'sort_order' => 2, 'is_active' => true],
                ['title' => 'Liridona Berisha', 'subtitle' => 'Frontend Developer, Albania', 'description' => 'I love how easy it is to apply and track applications. It feels modern and actually built for developers, not outdated like most job boards.', 'sort_order' => 3, 'is_active' => true],
                ['title' => 'Markus Weber', 'subtitle' => 'Tech Lead, Switzerland', 'description' => 'The filtering system saved us so much time. We only saw candidates that matched exactly what we needed, which made hiring way more efficient.', 'sort_order' => 4, 'is_active' => true],
            ],
        ],
        [
            'key' => 'footer',
            'title' => 'Site footer',
            'is_active' => true,
            'sort_order' => 7,
            'items' => [
                [
                    'title' => 'footer_config',
                    'sort_order' => 1,
                    'is_active' => true,
                    'metadata' => [
                        'brand' => [
                            'tagline' => 'Find the best job for you.',
                            'phone' => '+383 48 777 888',
                            'email' => 'beehired@gmail.com',
                        ],
                        'social' => [
                            ['iconKey' => 'FaLinkedinIn', 'url' => 'https://linkedin.com', 'label' => 'LinkedIn'],
                            ['iconKey' => 'FaTwitter', 'url' => 'https://twitter.com', 'label' => 'Twitter'],
                            ['iconKey' => 'FaFacebookF', 'url' => 'https://facebook.com', 'label' => 'Facebook'],
                            ['iconKey' => 'FaInstagram', 'url' => 'https://instagram.com', 'label' => 'Instagram'],
                        ],
                        'columns' => [
                            [
                                'category' => 'Company',
                                'links' => [
                                    ['label' => 'About Us', 'href' => '/about-us'],
                                    ['label' => 'Careers', 'href' => '/jobs'],
                                    ['label' => 'Press', 'href' => '/contact-us'],
                                    ['label' => 'Blog', 'href' => '/jobs'],
                                ],
                            ],
                            [
                                'category' => 'For Candidates',
                                'links' => [
                                    ['label' => 'Browse Jobs', 'href' => '/jobs'],
                                    ['label' => 'Create Profile', 'href' => '/profile'],
                                    ['label' => 'Career Advice', 'href' => '/about-us'],
                                    ['label' => 'Job Alerts', 'href' => '/jobs'],
                                ],
                            ],
                            [
                                'category' => 'For Employers',
                                'links' => [
                                    ['label' => 'Post a Job', 'href' => '/hire-dashboard/listings'],
                                    ['label' => 'Search Candidates', 'href' => '/hire-dashboard'],
                                    ['label' => 'Pricing', 'href' => '/pricing'],
                                    ['label' => 'Recruitment Solutions', 'href' => '/contact-us'],
                                ],
                            ],
                            [
                                'category' => 'Support',
                                'links' => [
                                    ['label' => 'Help Center', 'href' => '/contact-us'],
                                    ['label' => 'Contact Us', 'href' => '/contact-us'],
                                    ['label' => 'FAQ', 'href' => '/contact-us'],
                                ],
                            ],
                            [
                                'category' => 'Legal',
                                'links' => [
                                    ['label' => 'Privacy Policy', 'href' => '/contact-us'],
                                    ['label' => 'Terms of Use', 'href' => '/contact-us'],
                                    ['label' => 'Cookie Policy', 'href' => '/contact-us'],
                                    ['label' => 'Security', 'href' => '/contact-us'],
                                ],
                            ],
                        ],
                        'copyright' => '© 2026 BEE HIRED  | ALL RIGHTS RESERVED',
                    ],
                ],
            ],
        ],
        [
            'key' => 'about_stats',
            'title' => 'Our Work',
            'is_active' => true,
            'sort_order' => 8,
            'items' => [
                ['title' => '2500', 'subtitle' => 'Applications Processed', 'sort_order' => 1, 'is_active' => true],
                ['title' => '340',  'subtitle' => 'Positions Published',    'sort_order' => 2, 'is_active' => true],
                ['title' => '120',  'subtitle' => 'Companies',              'sort_order' => 3, 'is_active' => true],
                ['title' => '345',  'subtitle' => 'Employed Students',      'sort_order' => 4, 'is_active' => true],
            ],
        ],
        [
            'key' => 'about_overview',
            'title' => 'Mission & Overview',
            'is_active' => true,
            'sort_order' => 9,
            'items' => [
                ['title' => 'What BeeHired Solves', 'description' => 'Recruitment is often fragmented across email, spreadsheets, and disconnected tools. BeeHired consolidates announcements, applications, evaluations, and decisions in one secure platform.', 'sort_order' => 1, 'is_active' => true],
                ['title' => 'Why Organizations Use It', 'description' => 'Faster processing, better visibility, and consistent candidate handling. Teams can collaborate efficiently while maintaining professional standards and audit-ready records.', 'sort_order' => 2, 'is_active' => true],
            ],
        ],
    ];

    public function show(): JsonResponse
    {
        $content = $this->ensureDefaultContent();
        $this->ensureDefaultSections();

        return response()->json([
            'homeContent' => $this->toFrontendShape($content),
            'pageContent' => $this->toPageContentShape($content),
            'homeSections' => $this->sectionsToFrontendShape(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            '_pageKey' => ['nullable', 'string', 'in:home,companies,contact,pricing,about,jobs'],
            'proofText' => ['nullable', 'string', 'max:255'],
            'heroTitle' => ['nullable', 'string', 'max:255'],
            'heroSubtitle' => ['nullable', 'string'],
            'primaryCta' => ['nullable', 'string', 'max:255'],
            'secondaryCta' => ['nullable', 'string', 'max:255'],
            'categoriesTitle' => ['nullable', 'string', 'max:255'],
            'categoriesCta' => ['nullable', 'string', 'max:255'],
            'companiesEyebrow' => ['nullable', 'string', 'max:255'],
            'companiesTitle' => ['nullable', 'string', 'max:255'],
            'companiesDescription' => ['nullable', 'string'],
            'companiesCta' => ['nullable', 'string', 'max:255'],
            'heroEyebrow' => ['nullable', 'string', 'max:255'],
            'heroDescription' => ['nullable', 'string'],
            'featuredTitle' => ['nullable', 'string', 'max:255'],
            'featuredDescription' => ['nullable', 'string'],
            'findJobTitle' => ['nullable', 'string', 'max:255'],
            'findJobHighlight' => ['nullable', 'string', 'max:255'],
            'findJobDescription' => ['nullable', 'string'],
            'findJobCta' => ['nullable', 'string', 'max:255'],
            'heroEyebrow' => ['nullable', 'string', 'max:255'],
            'missionTitle' => ['nullable', 'string', 'max:255'],
            'missionDescription' => ['nullable', 'string'],
            'overviewEyebrow' => ['nullable', 'string', 'max:255'],
            'heroBgImage'     => ['nullable', 'string', 'max:500'],
            'statsTitle' => ['nullable', 'string', 'max:255'],
            'plansTitle' => ['nullable', 'string', 'max:255'],
            'faqTitle' => ['nullable', 'string', 'max:255'],
            'formTitle' => ['nullable', 'string', 'max:255'],
            'formDescription' => ['nullable', 'string'],
            'filterTitle' => ['nullable', 'string', 'max:255'],
            'listingsTitle' => ['nullable', 'string', 'max:255'],
        ]);

        $content = $this->ensureDefaultContent();
        $pageKey = $validated['_pageKey'] ?? 'home';

        if ($pageKey === 'jobs') {
            $content->fill([
                'jobs_page_hero_title' => $validated['heroTitle'] ?? $content->jobs_page_hero_title,
                'jobs_page_hero_description' => $validated['heroDescription'] ?? $content->jobs_page_hero_description,
                'jobs_page_filter_title' => $validated['filterTitle'] ?? $content->jobs_page_filter_title,
                'jobs_page_listings_title' => $validated['listingsTitle'] ?? $content->jobs_page_listings_title,
                'jobs_page_primary_cta' => $validated['primaryCta'] ?? $content->jobs_page_primary_cta,
            ]);
            $content->save();

            return response()->json([
                'message' => 'Jobs page content updated successfully.',
                'pageContent' => $this->toPageContentShape($content),
            ]);
        }

        if ($pageKey === 'contact') {
            $content->fill([
                'contact_page_hero_eyebrow'   => $validated['heroEyebrow']     ?? $content->contact_page_hero_eyebrow,
                'contact_page_hero_title'     => $validated['heroTitle']        ?? $content->contact_page_hero_title,
                'contact_page_hero_description' => $validated['heroDescription'] ?? $content->contact_page_hero_description,
                'contact_page_form_title'     => $validated['formTitle']        ?? $content->contact_page_form_title,
                'contact_page_form_description' => $validated['formDescription'] ?? $content->contact_page_form_description,
                'contact_page_primary_cta'    => $validated['primaryCta']       ?? $content->contact_page_primary_cta,
            ]);
            $content->save();

            return response()->json([
                'message'     => 'Contact page content updated successfully.',
                'pageContent' => $this->toPageContentShape($content),
            ]);
        }

        if ($pageKey === 'pricing') {
            $content->fill([
                'pricing_hero_eyebrow'     => $validated['heroEyebrow']     ?? $content->pricing_hero_eyebrow,
                'pricing_hero_title'       => $validated['heroTitle']        ?? $content->pricing_hero_title,
                'pricing_hero_description' => $validated['heroDescription']  ?? $content->pricing_hero_description,
                'pricing_primary_cta'      => $validated['primaryCta']       ?? $content->pricing_primary_cta,
            ]);
            $content->save();

            return response()->json([
                'message'     => 'Pricing page content updated successfully.',
                'pageContent' => $this->toPageContentShape($content),
            ]);
        }

        if ($pageKey === 'about') {
            $content->fill([
                'about_hero_eyebrow'        => $validated['heroEyebrow']        ?? $content->about_hero_eyebrow,
                'about_hero_title'          => $validated['heroTitle']          ?? $content->about_hero_title,
                'about_hero_description'    => $validated['heroDescription']    ?? $content->about_hero_description,
                'about_mission_title'       => $validated['missionTitle']       ?? $content->about_mission_title,
                'about_mission_description' => $validated['missionDescription'] ?? $content->about_mission_description,
                'about_overview_eyebrow'    => $validated['overviewEyebrow']    ?? $content->about_overview_eyebrow,
                'about_hero_bg_image'       => $validated['heroBgImage']        ?? $content->about_hero_bg_image,
                'about_stats_title'         => $validated['statsTitle']         ?? $content->about_stats_title,
                'about_primary_cta'         => $validated['primaryCta']         ?? $content->about_primary_cta,
            ]);
            $content->save();

            return response()->json([
                'message' => 'About page content updated successfully.',
                'pageContent' => $this->toPageContentShape($content),
            ]);
        }

        if ($pageKey === 'companies') {
            $content->fill([
                'companies_page_hero_eyebrow' => $validated['heroEyebrow'] ?? $content->companies_page_hero_eyebrow,
                'companies_page_hero_title' => $validated['heroTitle'] ?? $content->companies_page_hero_title,
                'companies_page_hero_description' => $validated['heroDescription'] ?? $content->companies_page_hero_description,
                'companies_page_featured_title' => $validated['featuredTitle'] ?? $content->companies_page_featured_title,
                'companies_page_featured_description' => $validated['featuredDescription'] ?? $content->companies_page_featured_description,
                'companies_page_primary_cta' => $validated['primaryCta'] ?? $content->companies_page_primary_cta,
            ]);
        } else {
            $content->fill([
                'proof_text' => $validated['proofText'] ?? $content->proof_text,
                'hero_title' => $validated['heroTitle'] ?? $content->hero_title,
                'hero_subtitle' => $validated['heroSubtitle'] ?? $content->hero_subtitle,
                'primary_cta' => $validated['primaryCta'] ?? $content->primary_cta,
                'secondary_cta' => $validated['secondaryCta'] ?? $content->secondary_cta,
                'categories_title' => $validated['categoriesTitle'] ?? $content->categories_title,
                'categories_cta' => $validated['categoriesCta'] ?? $content->categories_cta,
                'companies_eyebrow' => $validated['companiesEyebrow'] ?? $content->companies_eyebrow,
                'companies_title' => $validated['companiesTitle'] ?? $content->companies_title,
                'companies_description' => $validated['companiesDescription'] ?? $content->companies_description,
                'companies_cta' => $validated['companiesCta'] ?? $content->companies_cta,
                'find_job_title' => $validated['findJobTitle'] ?? $content->find_job_title,
                'find_job_highlight' => $validated['findJobHighlight'] ?? $content->find_job_highlight,
                'find_job_description' => $validated['findJobDescription'] ?? $content->find_job_description,
                'find_job_cta' => $validated['findJobCta'] ?? $content->find_job_cta,
            ]);
        }
        $content->save();

        return response()->json([
            'message' => 'Home page content updated successfully.',
            'homeContent' => $this->toFrontendShape($content),
            'pageContent' => $this->toPageContentShape($content),
        ]);
    }

    public function updateSections(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sections' => ['required', 'array'],
            'sections.*.key' => ['required', 'string', 'max:120'],
            'sections.*.title' => ['nullable', 'string', 'max:255'],
            'sections.*.isActive' => ['nullable', 'boolean'],
            'sections.*.sortOrder' => ['nullable', 'integer', 'min:0'],
            'sections.*.items' => ['nullable', 'array'],
            'sections.*.items.*.id' => ['nullable', 'integer'],
            'sections.*.items.*.title' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.subtitle' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.description' => ['nullable', 'string'],
            'sections.*.items.*.ctaText' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.imageUrl' => ['nullable', 'string'],
            'sections.*.items.*.imageAlt' => ['nullable', 'string', 'max:255'],
            'sections.*.items.*.metadata' => ['nullable', 'array'],
            'sections.*.items.*.sortOrder' => ['nullable', 'integer', 'min:0'],
            'sections.*.items.*.isActive' => ['nullable', 'boolean'],
        ]);

        foreach ($validated['sections'] as $sectionPayload) {
            $section = HomePageSection::query()->firstOrCreate(
                ['key' => $sectionPayload['key']],
                [
                    'title' => $sectionPayload['title'] ?? null,
                    'is_active' => $sectionPayload['isActive'] ?? true,
                    'sort_order' => $sectionPayload['sortOrder'] ?? 0,
                ]
            );

            $section->fill([
                'title' => $sectionPayload['title'] ?? $section->title,
                'is_active' => $sectionPayload['isActive'] ?? $section->is_active,
                'sort_order' => $sectionPayload['sortOrder'] ?? $section->sort_order,
            ]);
            $section->save();

            $payloadItems = $sectionPayload['items'] ?? [];
            $incomingIds = collect($payloadItems)->pluck('id')->filter()->map(fn ($id) => (int) $id)->all();

            if (!empty($incomingIds)) {
                $section->items()->whereNotIn('id', $incomingIds)->delete();
            } else {
                $section->items()->delete();
            }

            foreach ($payloadItems as $index => $itemPayload) {
                $item = null;
                if (!empty($itemPayload['id'])) {
                    $item = $section->items()->where('id', $itemPayload['id'])->first();
                }

                if (!$item) {
                    $item = $section->items()->make();
                }

                $item->fill([
                    'title' => $itemPayload['title'] ?? null,
                    'subtitle' => $itemPayload['subtitle'] ?? null,
                    'description' => $itemPayload['description'] ?? null,
                    'cta_text' => $itemPayload['ctaText'] ?? null,
                    'image_url' => $itemPayload['imageUrl'] ?? null,
                    'image_alt' => $itemPayload['imageAlt'] ?? null,
                    'metadata' => $itemPayload['metadata'] ?? null,
                    'sort_order' => $itemPayload['sortOrder'] ?? $index,
                    'is_active' => $itemPayload['isActive'] ?? true,
                ]);
                $item->save();
            }
        }

        return response()->json([
            'message' => 'Home page sections updated successfully.',
            'homeSections' => $this->sectionsToFrontendShape(),
        ]);
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:5120'],
            'sectionKey' => ['nullable', 'string', 'max:120'],
        ]);

        $folder = 'home-sections';
        if (!empty($validated['sectionKey'])) {
            $folder .= '/' . str_replace(' ', '-', strtolower($validated['sectionKey']));
        }

        $path = $request->file('image')->store($folder, 'public');

        return response()->json([
            'message' => 'Image uploaded successfully.',
            'imageUrl' => HomePageMediaUrl::toPublic($path),
            'path' => $path,
        ]);
    }

    public function media(string $path): Response|ResponseFactory
    {
        $safePath = ltrim($path, '/');

        if (!Storage::disk('public')->exists($safePath)) {
            abort(404);
        }

        $mimeType = Storage::disk('public')->mimeType($safePath) ?? 'application/octet-stream';
        $contents = Storage::disk('public')->get($safePath);

        return response($contents, 200)->header('Content-Type', $mimeType);
    }

    private function toFrontendShape(HomePageContent $content): array
    {
        return [
            'proofText' => $content->proof_text,
            'heroTitle' => $content->hero_title,
            'heroSubtitle' => $content->hero_subtitle,
            'primaryCta' => $content->primary_cta,
            'secondaryCta' => $content->secondary_cta,
            'categoriesTitle' => $content->categories_title,
            'categoriesCta' => $content->categories_cta,
            'companiesEyebrow' => $content->companies_eyebrow,
            'companiesTitle' => $content->companies_title,
            'companiesDescription' => $content->companies_description,
            'companiesCta' => $content->companies_cta,
            'findJobTitle' => $content->find_job_title,
            'findJobHighlight' => $content->find_job_highlight,
            'findJobDescription' => $content->find_job_description,
            'findJobCta' => $content->find_job_cta,
        ];
    }

    private function toPageContentShape(HomePageContent $content): array
    {
        return [
            'home' => $this->toFrontendShape($content),
            'companies' => [
                'heroEyebrow'        => $content->companies_page_hero_eyebrow,
                'heroTitle'          => $content->companies_page_hero_title,
                'heroDescription'    => $content->companies_page_hero_description,
                'featuredTitle'      => $content->companies_page_featured_title,
                'featuredDescription'=> $content->companies_page_featured_description,
                'primaryCta'         => $content->companies_page_primary_cta,
            ],
            'pricing' => [
                'heroEyebrow'    => $content->pricing_hero_eyebrow,
                'heroTitle'      => $content->pricing_hero_title,
                'heroDescription'=> $content->pricing_hero_description,
                'primaryCta'     => $content->pricing_primary_cta,
            ],
            'about' => [
                'heroEyebrow'        => $content->about_hero_eyebrow,
                'heroTitle'          => $content->about_hero_title,
                'heroDescription'    => $content->about_hero_description,
                'missionTitle'       => $content->about_mission_title,
                'missionDescription' => $content->about_mission_description,
                'overviewEyebrow'    => $content->about_overview_eyebrow,
                'heroBgImage'        => $content->about_hero_bg_image,
                'statsTitle'         => $content->about_stats_title,
                'primaryCta'         => $content->about_primary_cta,
            ],
            'contact' => [
                'heroEyebrow'     => $content->contact_page_hero_eyebrow,
                'heroTitle'       => $content->contact_page_hero_title,
                'heroDescription' => $content->contact_page_hero_description,
                'formTitle'       => $content->contact_page_form_title,
                'formDescription' => $content->contact_page_form_description,
                'primaryCta'      => $content->contact_page_primary_cta,
            ],
            'jobs' => [
                'heroTitle'       => $content->jobs_page_hero_title,
                'heroDescription' => $content->jobs_page_hero_description,
                'filterTitle'     => $content->jobs_page_filter_title,
                'listingsTitle'   => $content->jobs_page_listings_title,
                'primaryCta'      => $content->jobs_page_primary_cta,
            ],
        ];
    }

    private function ensureDefaultContent(): HomePageContent
    {
        $content = HomePageContent::query()->first();

        if (!$content) {
            $content = HomePageContent::query()->create(self::DEFAULT_CONTENT);
        }

        $missingDefaults = [];
        foreach (self::DEFAULT_CONTENT as $key => $value) {
            if ($content->{$key} === null) {
                $missingDefaults[$key] = $value;
            }
        }

        if (!empty($missingDefaults)) {
            $content->fill($missingDefaults);
            $content->save();
        }

        return $content;
    }

    private function ensureDefaultSections(): void
    {
        foreach (self::DEFAULT_SECTIONS as $sectionSeed) {
            $section = HomePageSection::query()->firstOrCreate(
                ['key' => $sectionSeed['key']],
                [
                    'title' => $sectionSeed['title'],
                    'is_active' => $sectionSeed['is_active'],
                    'sort_order' => $sectionSeed['sort_order'],
                ]
            );

            if ($section->items()->count() > 0) {
                if ($sectionSeed['key'] === 'companies_cards') {
                    foreach ($sectionSeed['items'] as $itemSeed) {
                        $item = $section->items()
                            ->where('title', $itemSeed['title'])
                            ->first();

                        if (!$item) {
                            continue;
                        }

                        $metadata = $item->metadata ?? [];
                        $seedMetadata = $itemSeed['metadata'] ?? [];
                        $nextMetadata = array_replace_recursive($seedMetadata, $metadata);

                        if ($nextMetadata !== $metadata) {
                            $item->metadata = $nextMetadata;
                            $item->save();
                        }
                    }
                }
                continue;
            }

            foreach ($sectionSeed['items'] as $itemSeed) {
                $section->items()->create([
                    'title' => $itemSeed['title'] ?? null,
                    'subtitle' => $itemSeed['subtitle'] ?? null,
                    'description' => $itemSeed['description'] ?? null,
                    'cta_text' => $itemSeed['cta_text'] ?? null,
                    'image_url' => $itemSeed['image_url'] ?? null,
                    'image_alt' => $itemSeed['image_alt'] ?? null,
                    'metadata' => $itemSeed['metadata'] ?? null,
                    'sort_order' => $itemSeed['sort_order'] ?? 0,
                    'is_active' => $itemSeed['is_active'] ?? true,
                ]);
            }
        }
    }

    private function sectionsToFrontendShape(): array
    {
        $sections = HomePageSection::query()->with('items')->orderBy('sort_order')->get();

        return $sections->map(function (HomePageSection $section) {
            return [
                'id' => $section->id,
                'key' => $section->key,
                'title' => $section->title,
                'isActive' => (bool) $section->is_active,
                'sortOrder' => $section->sort_order,
                'items' => $section->items
                    ->sortBy('sort_order')
                    ->values()
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'title' => $item->title,
                            'subtitle' => $item->subtitle,
                            'description' => $item->description,
                            'ctaText' => $item->cta_text,
                            'imageUrl' => HomePageMediaUrl::toPublic($item->image_url),
                            'imageAlt' => $item->image_alt,
                            'metadata' => $item->metadata,
                            'sortOrder' => $item->sort_order,
                            'isActive' => (bool) $item->is_active,
                        ];
                    })
                    ->all(),
            ];
        })->all();
    }

}
