<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->string('companies_page_hero_eyebrow')->nullable();
            $table->string('companies_page_hero_title')->nullable();
            $table->text('companies_page_hero_description')->nullable();
            $table->string('companies_page_featured_title')->nullable();
            $table->text('companies_page_featured_description')->nullable();
            $table->string('companies_page_primary_cta')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->dropColumn([
                'companies_page_hero_eyebrow',
                'companies_page_hero_title',
                'companies_page_hero_description',
                'companies_page_featured_title',
                'companies_page_featured_description',
                'companies_page_primary_cta',
            ]);
        });
    }
};
