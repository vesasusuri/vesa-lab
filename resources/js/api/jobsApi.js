import axios from 'axios';
import {
  JOB_LISTING_TYPES,
  jobTypesLabel,
  typesIncludingRemoteFromLocation,
} from '../utils/jobFormUtils';

export { JOB_LISTING_TYPES };

function normalizeTags(tags) {
    if (Array.isArray(tags)) {
        return tags;
    }
    if (typeof tags === 'string' && tags.trim()) {
        try {
            const parsed = JSON.parse(tags);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
}

export function jobMatchesTypeFilter(job, filter) {
    const types = typesIncludingRemoteFromLocation(job.types, job.type, job.location);

    return types.includes(filter);
}

export function jobMatchesAllTypeFilters(job, typeFilters) {
    if (!typeFilters.length) {
        return true;
    }

    return typeFilters.every((filter) => jobMatchesTypeFilter(job, filter));
}

export function listJobListings(params = {}) {
    return axios.get('/api/job-listings', { params }).then((response) => response.data);
}

export function filterJobListings(jobs, { typeFilters = [], searchQuery = '' } = {}) {
    let result = jobs;

    if (typeFilters.length > 0) {
        result = result.filter((job) => jobMatchesAllTypeFilters(job, typeFilters));
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
        result = result.filter((job) => {
            const haystack = [
                job.title,
                job.company,
                job.location,
                job.salary,
                job.description,
                job.type,
                ...(job.types || []),
                ...(job.tags || []),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(query);
        });
    }

    return result;
}

export function getJobListing(id) {
    return axios.get(`/api/job-listings/${id}`).then((response) => response.data);
}

export function applyToJob(jobListingId) {
    return axios.post(`/api/job-listings/${jobListingId}/apply`).then((response) => response.data);
}

export function getSavedJobIds() {
    return axios.get('/api/saved-jobs').then((response) => response.data.saved_job_ids || []);
}

export function fetchSavedJobs() {
    return axios.get('/api/saved-jobs').then((response) => response.data.saved_jobs || []);
}

export function saveJob(jobListingId) {
    return axios.post('/api/saved-jobs', { job_listing_id: jobListingId }).then((response) => response.data);
}

export function unsaveJob(jobListingId) {
    return axios.delete(`/api/saved-jobs/${jobListingId}`).then((response) => response.data);
}

export function listJobListingsForHr() {
    return axios.get('/api/job-listings/manage').then((response) => response.data);
}

export function createJobListing(payload) {
    return axios.post('/api/job-listings', payload).then((response) => response.data);
}

export function updateJobListingStatus(id, status) {
    return axios.put(`/api/job-listings/${id}`, { status }).then((response) => response.data);
}

export function updateJobListing(id, payload) {
    return axios.put(`/api/job-listings/${id}`, payload).then((response) => response.data);
}

export function deleteJobListing(id) {
    return axios.delete(`/api/job-listings/${id}`).then((response) => response.data);
}

export function splitJobText(text) {
    if (!text || typeof text !== 'string') {
        return [];
    }

    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

export function mapJobListing(job) {
    const company = job.company || '';
    const initials = company
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const posted = job.created_at ? new Date(job.created_at) : null;
    let time = 'Recently';
    if (posted) {
        const days = Math.floor((Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24));
        if (days === 0) time = 'Today';
        else if (days === 1) time = '1 day ago';
        else time = `${days} days ago`;
    }

    const types = typesIncludingRemoteFromLocation(job.types, job.type, job.location);
    const type = jobTypesLabel(types);

    return {
        id: job.id,
        initials: initials || 'JB',
        title: job.title,
        company: job.company,
        location: job.location || '—',
        salary: job.salary || '—',
        time,
        types,
        type,
        featured: Boolean(job.is_featured),
        tags: normalizeTags(job.tags),
        description: job.description || '',
        benefits: job.benefits || '',
        benefitLines: splitJobText(job.benefits || ''),
        descriptionParagraphs: splitJobText(job.description || ''),
    };
}

export function mapJobListingForHr(job) {
    const base = mapJobListing(job);
    const posted = job.created_at ? new Date(job.created_at) : new Date();
    const postedDays = Math.floor((Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24));
    const status = job.status || (job.is_active ? 'active' : 'closed');

    return {
        ...base,
        status,
        applications: job.applications_count   ?? 0,
        reviewing:    job.reviewing_count       ?? 0,
        shortlisted:  job.shortlisted_count     ?? 0,
        daysLeft: status === 'active' ? 30 : 0,
        postedDays,
        featured: Boolean(job.is_featured),
    };
}
