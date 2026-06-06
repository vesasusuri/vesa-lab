<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cv_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('full_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 64)->nullable();
            $table->string('headline')->nullable();
            $table->text('summary')->nullable();
            $table->string('location')->nullable();
            $table->string('website')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('github')->nullable();
            $table->json('github_repositories')->nullable();
            $table->json('portfolio_links')->nullable();
            $table->timestamps();
        });

        Schema::create('cv_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cv_profile_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('category', 32)->default('general');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('cv_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cv_profile_id')->constrained()->cascadeOnDelete();
            $table->string('company');
            $table->string('role');
            $table->string('start_date', 16)->nullable();
            $table->string('end_date', 16)->nullable();
            $table->boolean('is_current')->default(false);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('cv_education', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cv_profile_id')->constrained()->cascadeOnDelete();
            $table->string('institution');
            $table->string('degree')->nullable();
            $table->string('field_of_study')->nullable();
            $table->string('start_date', 16)->nullable();
            $table->string('end_date', 16)->nullable();
            $table->boolean('is_current')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('cv_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cv_profile_id')->constrained()->cascadeOnDelete();
            $table->string('language');
            $table->string('level', 32)->default('Fluent');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('cv_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cv_profile_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('technologies')->nullable();
            $table->string('url')->nullable();
            $table->string('start_date', 16)->nullable();
            $table->string('end_date', 16)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('cv_certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cv_profile_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('issuer')->nullable();
            $table->string('year', 8)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('cv_templates', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('view')->comment('Blade view name under cv-templates');
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::table('resumes', function (Blueprint $table) {
            $table->foreignId('cv_profile_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('resumes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('cv_profile_id');
        });

        Schema::dropIfExists('cv_templates');
        Schema::dropIfExists('cv_certifications');
        Schema::dropIfExists('cv_projects');
        Schema::dropIfExists('cv_languages');
        Schema::dropIfExists('cv_education');
        Schema::dropIfExists('cv_experiences');
        Schema::dropIfExists('cv_skills');
        Schema::dropIfExists('cv_profiles');
    }
};
