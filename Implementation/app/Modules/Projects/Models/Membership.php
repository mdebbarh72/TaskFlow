<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Membership extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return \Database\Factories\MembershipFactory::new();
    }

    protected $fillable = ['user_id', 'project_id', 'role', 'status', 'left_at'];

    protected function casts(): array
    {
        return [
            'left_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
