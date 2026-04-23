<?php

namespace App\Infrastructure\Email\DTOs;

class SendEmailDTO
{
    public function __construct(
        public readonly string $to,
        public readonly string $subject,
        public readonly string $template,
        public readonly array  $data = [],
    ) {}
}
