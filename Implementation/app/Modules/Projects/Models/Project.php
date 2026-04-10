<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Users\Models\User;
use App\Shared\Traits\HasActivityLog;
use App\Shared\Enums\MembershipStatus;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasActivityLog, HasFactory, SoftDeletes;

    protected static function newFactory()
    {
        return \Database\Factories\ProjectFactory::new();
    }

    protected $fillable = ['name', 'description', 'owner_id'];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function memberships()
    {
        return $this->hasMany(Membership::class);
    }

    public function sprints()
    {
        return $this->hasMany(\App\Modules\Board\Models\Sprint::class);
    }

    public function cards()
    {
        return $this->hasMany(\App\Modules\Board\Models\Card::class);
    }
}
