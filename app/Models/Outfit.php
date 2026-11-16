<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Outfit extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category',
        'skintone_match',
        'description',
        'mix_match_notes',
        'image_path',
    ];

    protected function casts(): array
    {
        return ['skintone_match' => 'array'];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function motifs(): BelongsToMany
    {
        return $this->belongsToMany(TapisMotif::class, 'motif_outfit', 'outfit_id', 'tapis_motif_id');
    }
}
