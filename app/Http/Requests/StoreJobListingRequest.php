<?php

namespace App\Http\Requests;

use App\Models\JobListing;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user && in_array($user->role, [User::ROLE_HR, User::ROLE_ADMIN], true);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:2', 'max:255'],
            'company' => ['required', 'string', 'min:2', 'max:255'],
            'location' => ['required', 'string', 'min:2', 'max:255'],
            'salary' => ['required', 'string', 'min:2', 'max:255'],
            'types' => ['required', 'array', 'min:1'],
            'types.*' => ['required', 'string', Rule::in(JobListing::JOB_TYPES)],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:100'],
            'description' => ['required', 'string', 'min:20', 'max:10000'],
            'benefits' => ['nullable', 'string', 'max:10000'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Job title is required.',
            'title.min' => 'Job title must be at least 2 characters.',
            'company.required' => 'Company name is required.',
            'location.required' => 'Location is required.',
            'salary.required' => 'Salary range is required.',
            'types.required' => 'Select at least one job type.',
            'types.min' => 'Select at least one job type.',
            'types.*.in' => 'One or more selected job types are invalid.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(JobListing::mergeNormalizedInput($this->all()));
    }
}
