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
        Schema::table('team_members', function (Blueprint $table) {
            if (!Schema::hasColumn('team_members', 'name'))       $table->string('name', 100);
            if (!Schema::hasColumn('team_members', 'occupation')) $table->string('occupation', 100);
            if (!Schema::hasColumn('team_members', 'bio'))        $table->text('bio');
            if (!Schema::hasColumn('team_members', 'image_path')) $table->string('image_path')->nullable();
            if (!Schema::hasColumn('team_members', 'sort_order')) $table->unsignedInteger('sort_order')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('team_members', function (Blueprint $table) {
            $table->dropColumn(['name', 'occupation', 'bio', 'image_path', 'sort_order']);
        });
    }
};
