<?php

namespace App\Modules\Collaboration\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Board\Models\Card;
use App\Modules\Users\Models\User;

class Comment extends Model
{
    protected $fillable = ['card_id', 'user_id', 'content'];

    public function card()
    {
        return $this->belongsTo(Card::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
