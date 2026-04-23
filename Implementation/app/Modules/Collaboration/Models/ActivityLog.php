<?php

namespace App\Modules\Collaboration\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Modules\Users\Models\User;

class ActivityLog extends Model
{
    protected $fillable = ['user_id', 'action', 'actionable_id', 'actionable_type'];

    public function actionable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
