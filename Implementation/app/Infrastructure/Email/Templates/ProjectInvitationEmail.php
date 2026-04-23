<?php

namespace App\Infrastructure\Email\Templates;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Modules\Projects\Models\Project;

class ProjectInvitationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Project $project, public string $inviteUrl) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'You are invited to a Project');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.project-invitation');
    }
}
