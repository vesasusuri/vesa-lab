<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomePageContent extends Model
{
    protected $fillable = [
        'proof_text',
        'hero_title',
        'hero_subtitle',
        'primary_cta',
        'secondary_cta',
        'categories_title',
        'categories_cta',
        'companies_eyebrow',
        'companies_title',
        'companies_description',
        'companies_cta',
        'companies_page_hero_eyebrow',
        'companies_page_hero_title',
        'companies_page_hero_description',
        'companies_page_featured_title',
        'companies_page_featured_description',
        'companies_page_primary_cta',
        'find_job_title',
        'find_job_highlight',
        'find_job_description',
        'find_job_cta',
        'about_hero_eyebrow',
        'about_hero_title',
        'about_hero_description',
        'about_mission_title',
        'about_mission_description',
        'about_stats_title',
        'about_primary_cta',
        'pricing_hero_eyebrow',
        'pricing_hero_title',
        'pricing_hero_description',
        'pricing_primary_cta',
        'contact_page_hero_eyebrow',
        'contact_page_hero_title',
        'contact_page_hero_description',
        'contact_page_form_title',
        'contact_page_form_description',
        'contact_page_primary_cta',
        'jobs_page_hero_eyebrow',
        'jobs_page_hero_title',
        'jobs_page_hero_description',
        'jobs_page_filter_title',
        'jobs_page_listings_title',
        'jobs_page_primary_cta',
    ];
}
