<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cv_profiles', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('user_id');
            $table->string('last_name')->nullable()->after('first_name');
            $table->date('date_of_birth')->nullable()->after('location');
            $table->string('nationality', 120)->nullable()->after('date_of_birth');
            $table->string('desired_role')->nullable()->after('portfolio_links');
            $table->string('job_type', 32)->nullable()->after('desired_role');
            $table->unsignedInteger('expected_salary')->nullable()->after('job_type');
            $table->string('availability', 64)->nullable()->after('expected_salary');
            $table->string('avatar_path')->nullable()->after('availability');
        });
    }

    public function down(): void
    {
        Schema::table('cv_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'date_of_birth',
                'nationality',
                'desired_role',
                'job_type',
                'expected_salary',
                'availability',
                'avatar_path',
            ]);
        });
    }
};
