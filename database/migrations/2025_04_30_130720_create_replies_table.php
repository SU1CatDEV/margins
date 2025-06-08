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
        Schema::create('replies', function (Blueprint $table) {
            $table->id();
            $table->text('text');
            $table->integer('likes')->default(0);
            $table->json('liked_users');
            $table->unsignedBigInteger('previous')->nullable();
            $table->unsignedBigInteger('thread')->nullable();
            $table->timestamps();

            $table->foreignId('question_id')->nullable()->constrained();
            $table->foreignId('solution_id')->nullable()->constrained();
            $table->unsignedBigInteger('user_id');
            $table->foreign('previous')->nullable()->references('id')->on('replies');
            $table->foreign('thread')->nullable()->references('id')->on('replies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('replies');
    }
};
