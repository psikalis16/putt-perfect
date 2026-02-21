<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_definitions', function (Blueprint $table) {
            $table->id();
            // URL-safe identifier used for routing
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description');
            // Emoji icon displayed on game cards
            $table->string('icon')->default('⛳');
            // 1–3 difficulty rating
            $table->unsignedTinyInteger('difficulty')->default(1);
            // JSON blob for game-specific config (time limits, steps, etc.)
            $table->json('config')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_definitions');
    }
};
