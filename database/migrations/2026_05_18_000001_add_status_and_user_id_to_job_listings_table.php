<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->string('status')->default('active')->after('is_active');
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });

        DB::table('job_listings')->where('is_active', true)->update(['status' => 'active']);
        DB::table('job_listings')->where('is_active', false)->update(['status' => 'closed']);
    }

    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['status', 'user_id']);
        });
    }
};
