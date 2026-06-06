<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HrInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $hr,
        public readonly string $tempPassword,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'You\'ve been invited to BeeHired');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.hr-invitation');
    }
}
