<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TapisMotif extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'origin_region',
        'dominant_color',
        'description',
        'history',
        'philosophy',
        'image_path',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function outfits(): BelongsToMany
    {
        return $this->belongsToMany(Outfit::class, 'motif_outfit', 'tapis_motif_id', 'outfit_id');
    }
}
