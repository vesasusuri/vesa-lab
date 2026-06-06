<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hr_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('candidate_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('access_token', 64)->unique();
            $table->string('room_name', 128)->unique();
            $table->string('title');
            $table->string('company')->nullable();
            $table->unsignedBigInteger('application_id')->nullable();
            $table->dateTime('scheduled_at');
            $table->unsignedSmallInteger('duration_minutes')->default(60);
            $table->string('type', 20)->default('video');
            $table->string('status', 20)->default('scheduled');
            $table->string('location')->nullable();
            $table->string('interviewer_name')->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['hr_user_id', 'status']);
            $table->index(['candidate_user_id', 'status']);
            $table->index('scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
