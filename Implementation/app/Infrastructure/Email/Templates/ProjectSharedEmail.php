<?php

namespace App\Infrastructure\Email\Templates;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Modules\Projects\Models\Project;

class ProjectSharedEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Project $project, public string $viewUrl) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'A Project has been shared with you');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.project-shared');
    }
}
