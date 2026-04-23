<?php

namespace App\Shared\Enums;

enum OTPPurpose: string
{
    case PASSWORD_RESET = 'password_reset';
    case SUSPICIOUS_LOGIN = 'suspicious_login';
    case NEW_IP = 'new_ip';
}
