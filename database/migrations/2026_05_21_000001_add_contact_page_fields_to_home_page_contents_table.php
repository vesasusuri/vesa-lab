<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->string('contact_page_hero_eyebrow')->nullable();
            $table->string('contact_page_hero_title')->nullable();
            $table->text('contact_page_hero_description')->nullable();
            $table->string('contact_page_form_title')->nullable();
            $table->text('contact_page_form_description')->nullable();
            $table->string('contact_page_primary_cta')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->dropColumn([
                'contact_page_hero_eyebrow',
                'contact_page_hero_title',
                'contact_page_hero_description',
                'contact_page_form_title',
                'contact_page_form_description',
                'contact_page_primary_cta',
            ]);
        });
    }
};
