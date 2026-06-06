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
            $table->string('pricing_hero_eyebrow')->nullable();
            $table->string('pricing_hero_title')->nullable();
            $table->text('pricing_hero_description')->nullable();
            $table->string('pricing_primary_cta')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('home_page_contents', function (Blueprint $table) {
            $table->dropColumn([
                'pricing_hero_eyebrow',
                'pricing_hero_title',
                'pricing_hero_description',
                'pricing_primary_cta',
            ]);
        });
    }
};
