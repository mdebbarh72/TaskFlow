<?php

namespace App\Infrastructure\Email\Templates;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Modules\Users\Models\User;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user, public string $url) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Verify Your Email');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.verification');
    }
}
