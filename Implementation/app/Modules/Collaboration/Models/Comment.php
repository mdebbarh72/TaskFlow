<?php

namespace App\Modules\Collaboration\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Board\Models\Card;
use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use SoftDeletes;

    protected $fillable = ['card_id', 'user_id', 'description'];

    public function card()
    {
        return $this->belongsTo(Card::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
