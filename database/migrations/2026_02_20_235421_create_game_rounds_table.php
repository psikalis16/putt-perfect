<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_rounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_session_id')->constrained()->cascadeOnDelete();
            // Which hole/attempt this is (1-based)
            $table->unsignedSmallInteger('hole_number');
            // Distance in feet for this attempt
            $table->unsignedSmallInteger('distance');
            // Total putts taken on this hole/attempt
            $table->unsignedSmallInteger('putts_taken')->default(1);
            // Whether the first putt was holed
            $table->boolean('made')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_rounds');
    }
};
