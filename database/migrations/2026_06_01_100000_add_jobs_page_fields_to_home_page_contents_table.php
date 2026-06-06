<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->string('jobs_page_hero_eyebrow')->nullable();
            $table->string('jobs_page_hero_title')->nullable();
            $table->text('jobs_page_hero_description')->nullable();
            $table->string('jobs_page_filter_title')->nullable();
            $table->string('jobs_page_listings_title')->nullable();
            $table->string('jobs_page_primary_cta')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->dropColumn([
                'jobs_page_hero_eyebrow',
                'jobs_page_hero_title',
                'jobs_page_hero_description',
                'jobs_page_filter_title',
                'jobs_page_listings_title',
                'jobs_page_primary_cta',
            ]);
        });
    }
};
