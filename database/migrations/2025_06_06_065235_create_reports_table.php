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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string("name_requester");
            $table->string("name_owner");
            $table->string("work_title");
            $table->string("work_description");
            $table->string("infringing_material");
            $table->string("infringing_description");
            $table->string("location_url");
            $table->string("infringed_work");
            $table->string("email");
            $table->string("phone");
            $table->string("post");
            $table->string("preference");
            $table->string("full_name");
            $table->string("esignature");
            $table->unsignedBigInteger('reporter');
            $table->unsignedBigInteger('infringer');
            $table->unsignedBigInteger('book_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
