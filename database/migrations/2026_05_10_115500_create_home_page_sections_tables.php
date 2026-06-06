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
        Schema::create('home_page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('title')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('home_page_section_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('home_page_sections')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('cta_text')->nullable();
            $table->text('image_url')->nullable();
            $table->string('image_alt')->nullable();
            $table->json('metadata')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_page_section_items');
        Schema::dropIfExists('home_page_sections');
    }
};
