<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_definition_id')->constrained()->cascadeOnDelete();
            // Distance range from the user's mat settings at time of play
            $table->unsignedSmallInteger('min_distance');
            $table->unsignedSmallInteger('max_distance');
            // Final numeric score (meaning varies per game)
            $table->integer('score')->nullable();
            // Human-readable score e.g. "-3", "streak: 8", "12 putts"
            $table->string('score_label')->nullable();
            // Null until the session is finished
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_sessions');
    }
};
