<?php

namespace App\Modules\Collaboration\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Modules\Users\Models\User;

class ActivityLog extends Model
{
    protected $fillable = ['user_id', 'name', 'description', 'action', 'actionable_id', 'actionable_type', 'project_id'];

    public function actionable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
