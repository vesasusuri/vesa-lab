<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->string('about_hero_eyebrow')->nullable();
            $table->string('about_hero_title')->nullable();
            $table->text('about_hero_description')->nullable();
            $table->string('about_mission_title')->nullable();
            $table->text('about_mission_description')->nullable();
            $table->string('about_stats_title')->nullable();
            $table->string('about_primary_cta')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->dropColumn([
                'about_hero_eyebrow',
                'about_hero_title',
                'about_hero_description',
                'about_mission_title',
                'about_mission_description',
                'about_stats_title',
                'about_primary_cta',
            ]);
        });
    }
};
