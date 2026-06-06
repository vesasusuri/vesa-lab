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
        Schema::create('home_page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('proof_text')->nullable();
            $table->string('hero_title')->nullable();
            $table->text('hero_subtitle')->nullable();
            $table->string('primary_cta')->nullable();
            $table->string('secondary_cta')->nullable();
            $table->string('categories_title')->nullable();
            $table->string('categories_cta')->nullable();
            $table->string('companies_eyebrow')->nullable();
            $table->string('companies_title')->nullable();
            $table->text('companies_description')->nullable();
            $table->string('companies_cta')->nullable();
            $table->string('find_job_title')->nullable();
            $table->string('find_job_highlight')->nullable();
            $table->text('find_job_description')->nullable();
            $table->string('find_job_cta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_page_contents');
    }
};
