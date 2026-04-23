<?php

namespace App\Modules\Auth\Events;

use App\Modules\Users\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewIpLoginAttempt
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public User   $user,
        public string $ipAddress
    ) {}
}
