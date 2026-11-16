<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('motif_outfit', function (Blueprint $table) {
            $table->foreignId('tapis_motif_id')->constrained()->cascadeOnDelete();
            $table->foreignId('outfit_id')->constrained()->cascadeOnDelete();
            $table->primary(['tapis_motif_id', 'outfit_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('motif_outfit');
    }
};
