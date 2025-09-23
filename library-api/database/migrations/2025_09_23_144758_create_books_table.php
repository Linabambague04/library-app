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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('ISBN');
            $table->string('title');
            $table->string('image')->nullable();
            $table->string('subtitle')->nullable();
            $table->date('publication_date')->nullable();
            $table->integer('number_pages')->nullable();
            $table->string('genre')->nullable();
            $table->string('editorial')->nullable();
            $table->foreignId('id_author')->constrained('authors');
            $table->string('language')->nullable();
            $table->text('synopsis')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
