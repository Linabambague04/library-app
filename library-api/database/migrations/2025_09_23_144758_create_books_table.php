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
            $table->foreignId('author_id')->constrained('authors')->onDelete('cascade');
            $table->foreignId('editorial_id')->nullable()->constrained('editorials')->onDelete('set null');
            $table->string('language')->nullable();
            $table->text('synopsis')->nullable();
            $table->string('file')->nullable();
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
