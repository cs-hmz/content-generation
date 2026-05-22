<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('template_id')->nullable()->constrained()->nullOnDelete();
            $table->text('prompt');
            $table->longText('result')->nullable();
            $table->string('model');
            $table->string('status'); // pending, streaming, completed, failed
            $table->integer('tokens_used')->default(0);
            $table->integer('cost_micro_usd')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generations');
    }
};