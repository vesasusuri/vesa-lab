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
            $table->json('types')->nullable()->after('type');
        });

        $rows = DB::table('job_listings')->whereNotNull('type')->where('type', '!=', '')->get(['id', 'type']);

        foreach ($rows as $row) {
            DB::table('job_listings')->where('id', $row->id)->update([
                'types' => json_encode([$row->type]),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropColumn('types');
        });
    }
};
