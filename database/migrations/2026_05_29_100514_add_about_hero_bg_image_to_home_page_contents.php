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
            $table->string('about_hero_bg_image', 500)->nullable()->after('about_overview_eyebrow');
        });
    }

    public function down(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->dropColumn('about_hero_bg_image');
        });
    }
};
