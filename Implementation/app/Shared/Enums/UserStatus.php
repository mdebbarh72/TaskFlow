<?php

namespace App\Shared\Enums;

enum UserStatus: string
{
    case ACTIVE = 'active';
    case BANNED = 'banned';
}
