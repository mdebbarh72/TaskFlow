<?php

namespace App\Shared\Exceptions;

use Exception;

class OTPExpiredException extends Exception
{
    protected $message = 'The OTP has expired or is invalid.';
}
