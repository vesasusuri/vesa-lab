<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resumes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('original_filename');
            $table->string('path');
            $table->unsignedInteger('file_size');
            $table->longText('extracted_text')->nullable();
            $table->json('parsed_data')->nullable();
            $table->json('ats_rating')->nullable();
            $table->json('job_match')->nullable();
            $table->string('status', 32)->default('uploaded');
            $table->text('error_message')->nullable();
            $table->timestamp('analyzed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resumes');
    }
};
