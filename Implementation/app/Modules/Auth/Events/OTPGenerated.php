<?php

namespace App\Modules\Auth\Events;

use App\Shared\Enums\OTPPurpose;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OTPGenerated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public int        $userId,
        public OTPPurpose $purpose,
        public string     $code
    ) {}
}
