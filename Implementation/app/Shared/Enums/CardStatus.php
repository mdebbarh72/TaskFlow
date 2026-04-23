<?php

namespace App\Shared\Enums;

enum CardStatus: string
{
    case TODO = 'todo';
    case DOING = 'doing';
    case DONE = 'done';
    case REVIEWING = 'reviewing';
    case TESTING = 'testing';
}
