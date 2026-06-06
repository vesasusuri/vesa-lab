<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cv_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('cv_profiles', 'github')) {
                $table->string('github')->nullable()->after('linkedin');
            }
            if (!Schema::hasColumn('cv_profiles', 'github_repositories')) {
                $table->json('github_repositories')->nullable()->after('github');
            }
            if (!Schema::hasColumn('cv_profiles', 'portfolio_links')) {
                $table->json('portfolio_links')->nullable()->after('github_repositories');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cv_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('cv_profiles', 'github')) {
                $table->dropColumn('github');
            }
            if (Schema::hasColumn('cv_profiles', 'github_repositories')) {
                $table->dropColumn('github_repositories');
            }
            if (Schema::hasColumn('cv_profiles', 'portfolio_links')) {
                $table->dropColumn('portfolio_links');
            }
        });
    }
};
