<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('company')->nullable()->after('name');
            $table->enum('account_status', ['pending_activation', 'active', 'suspended'])
                ->default('active')
                ->after('company');
            $table->boolean('first_login_completed')->default(false)->after('account_status');
            $table->timestamp('last_login_at')->nullable()->after('first_login_completed');
            $table->timestamp('password_changed_at')->nullable()->after('last_login_at');
            $table->char('verification_code', 4)->nullable()->after('password_changed_at');
            $table->timestamp('verification_code_expires_at')->nullable()->after('verification_code');
            $table->string('onboarding_token', 64)->nullable()->unique()->after('verification_code_expires_at');
            $table->timestamp('onboarding_token_expires_at')->nullable()->after('onboarding_token');
            $table->unsignedBigInteger('invited_by')->nullable()->after('onboarding_token_expires_at');
            $table->foreign('invited_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropForeign(['invited_by']);
            $table->dropColumn([
                'company', 'account_status', 'first_login_completed',
                'last_login_at', 'password_changed_at',
                'verification_code', 'verification_code_expires_at',
                'onboarding_token', 'onboarding_token_expires_at', 'invited_by',
            ]);
        });
    }
};
