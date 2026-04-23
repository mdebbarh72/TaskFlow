<?php

namespace App\Shared\Exceptions;

use Exception;

class InvalidCredentialsException extends Exception
{
    protected $message = 'Invalid credentials provided.';
}
