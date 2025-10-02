<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('book_reader', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
            $table->foreignId('reader_id')->constrained('readers')->onDelete('cascade');
            $table->enum('status', ['reading', 'completed', 'wishlist'])->default('reading');
            $table->date('started_at')->nullable();
            $table->date('finished_at')->nullable();
            $table->integer('rating')->nullable(); 
            $table->unique(['book_id', 'reader_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_reader');
    }
};
