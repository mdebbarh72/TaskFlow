<?php

namespace App\Modules\Board\Models;

use Illuminate\Database\Eloquent\Model;

class Subtask extends Model
{
    protected $fillable = ['card_id', 'title', 'is_completed'];

    protected $casts = [
        'is_completed' => 'boolean',
    ];

    public function card()
    {
        return $this->belongsTo(Card::class);
    }
}
