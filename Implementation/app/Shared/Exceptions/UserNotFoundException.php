<?php

namespace App\Shared\Exceptions;

use Exception;

class UserNotFoundException extends Exception
{
    protected $message = 'User not found.';
}
