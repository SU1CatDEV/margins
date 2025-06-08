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
        Schema::create('central_saver_sessions', function (Blueprint $table) {
            $table->id();
            $table->boolean('inactive')->default(false);
            $table->timestamp('clearby')->nullable();
            $table->json('diffs')->nullable();
            $table->json('users')->nullable();
            $table->unsignedBigInteger('book_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('central_saver_sessions');
    }
};
