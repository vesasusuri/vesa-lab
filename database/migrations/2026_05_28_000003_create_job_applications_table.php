<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('job_listing_id')->constrained('job_listings')->cascadeOnDelete();
            $table->string('status', 32)->default('reviewing');
            $table->timestamps();

            $table->unique(['candidate_user_id', 'job_listing_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
