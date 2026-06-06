<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCandidateProfileRequest extends FormRequest
{
    public const JOB_TYPES = ['Remote', 'On-site', 'Hybrid'];

    public const AVAILABILITY_OPTIONS = [
        'Immediately',
        '1 week notice',
        '2 weeks notice',
        '1 month notice',
    ];

    public function authorize(): bool
    {
        return $this->user()?->isCandidate() ?? false;
    }

    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'firstName' => ['required', 'string', 'min:2', 'max:120', 'regex:/^[\pL\s\'-]+$/u'],
            'lastName' => ['required', 'string', 'min:2', 'max:120', 'regex:/^[\pL\s\'-]+$/u'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'phone' => ['required', 'string', 'min:7', 'max:64', 'regex:/^[+]?[\d\s().-]+$/'],
            'location' => ['required', 'string', 'min:2', 'max:255'],
            'dateOfBirth' => ['nullable', 'date', 'before:today', 'after:1900-01-01'],
            'nationality' => ['nullable', 'string', 'max:120', 'regex:/^[\pL\s\'-]+$/u'],
            'jobTitle' => ['required', 'string', 'min:2', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255', 'regex:~^(https?://)?(?:[\w-]+\.)*linkedin\.com/[\w\-./%]+~i'],
            'github' => ['nullable', 'string', 'max:255', 'regex:~^(https?://)?(?:[\w-]+\.)*github\.com/[\w\-./%]+~i'],
            'portfolio' => ['nullable', 'string', 'max:255', 'regex:#^(https?://)?[\w.-]+(\.[\w.-]+)+([\w\-.?%+]*)?$#i'],
            'desiredRole' => ['required', 'string', 'min:2', 'max:255'],
            'jobType' => ['required', 'string', Rule::in(self::JOB_TYPES)],
            'expectedSalary' => ['nullable', 'integer', 'min:0', 'max:99999999'],
            'availability' => ['required', 'string', Rule::in(self::AVAILABILITY_OPTIONS)],
            'about' => ['required', 'string', 'min:20', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'firstName.required' => 'First name is required.',
            'firstName.min' => 'First name must be at least 2 characters.',
            'firstName.regex' => 'First name may only contain letters, spaces, hyphens, and apostrophes.',
            'lastName.required' => 'Last name is required.',
            'lastName.min' => 'Last name must be at least 2 characters.',
            'lastName.regex' => 'Last name may only contain letters, spaces, hyphens, and apostrophes.',
            'email.required' => 'Email is required.',
            'email.email' => 'Enter a valid email address.',
            'email.unique' => 'This email is already in use.',
            'phone.required' => 'Phone number is required.',
            'phone.regex' => 'Enter a valid phone number.',
            'location.required' => 'Location is required.',
            'dateOfBirth.before' => 'Date of birth must be in the past.',
            'dateOfBirth.after' => 'Enter a valid date of birth.',
            'nationality.regex' => 'Nationality may only contain letters, spaces, hyphens, and apostrophes.',
            'jobTitle.required' => 'Professional title is required.',
            'linkedin.regex' => 'Enter a valid LinkedIn URL (e.g. linkedin.com/in/yourname).',
            'github.regex' => 'Enter a valid GitHub URL (e.g. github.com/yourname).',
            'portfolio.regex' => 'Enter a valid portfolio URL (e.g. yoursite.com).',
            'desiredRole.required' => 'Desired role is required.',
            'jobType.required' => 'Select a job type.',
            'jobType.in' => 'Select a valid job type.',
            'expectedSalary.integer' => 'Expected salary must be a whole number.',
            'availability.required' => 'Select your availability.',
            'availability.in' => 'Select a valid availability option.',
            'about.required' => 'About me is required.',
            'about.min' => 'About me must be at least 20 characters.',
            'about.max' => 'About me cannot exceed 500 characters.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $merge = [];

        foreach (['firstName', 'lastName', 'email', 'phone', 'location', 'nationality', 'jobTitle', 'linkedin', 'github', 'portfolio', 'desiredRole', 'about'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $merge[$field] = trim($this->input($field));
            }
        }

        if ($this->has('dateOfBirth') && $this->input('dateOfBirth') === '') {
            $merge['dateOfBirth'] = null;
        }

        if ($this->has('expectedSalary') && ($this->input('expectedSalary') === '' || $this->input('expectedSalary') === null)) {
            $merge['expectedSalary'] = null;
        }

        if ($merge !== []) {
            $this->merge($merge);
        }
    }
}
