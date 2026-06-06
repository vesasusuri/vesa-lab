<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\FirstLoginController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomePageContentController;
use App\Http\Controllers\HomePageSectionItemController;
use App\Http\Controllers\HrController;
use App\Http\Controllers\HrTeamNoteController;
use App\Http\Controllers\HrSettingsController;
use App\Http\Controllers\HrTeamController;
use App\Http\Controllers\SavedJobController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CandidateProfileController;
use App\Http\Controllers\HiresController;
use App\Http\Controllers\CvProfileController;
use App\Http\Controllers\ResumeController;
use App\Http\Controllers\PricingPlanController;
use App\Http\Controllers\TeamMemberController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::view('/hire-dashboard', 'welcome');
Route::view('/hire-dashboard/interviews', 'welcome');
Route::view('/hire-dashboard/hires', 'welcome');
Route::view('/hire-dashboard/analytics', 'welcome');
Route::view('/hire-dashboard/settings', 'welcome');
Route::view('/hire-dashboard/applications', 'welcome');
Route::view('/hire-dashboard/listings', 'welcome');
Route::view('/hire-dashboard/messages', 'welcome');
Route::view('/hire-dashboard/team', 'welcome');
Route::view('/admin-dashboard', 'welcome');
Route::view('/admin-dashboard/content', 'welcome');
Route::view('/admin-dashboard/users', 'welcome');
Route::view('/admin-dashboard/logs', 'welcome');
Route::view('/admin-dashboard/settings', 'welcome');
Route::view('/admin-dashboard/messages', 'welcome');
Route::view('/admin-dashboard/team', 'welcome');
Route::view('/admin-dashboard/pricing', 'welcome');
Route::view('/about-us', 'welcome');
Route::view('/companies', 'welcome');
Route::view('/companies/{any}', 'welcome')->where('any', '.*');
Route::view('/jobs', 'welcome');
Route::view('/contact-us', 'welcome');
Route::view('/pricing', 'welcome');
Route::view('/login', 'welcome')->name('login');
Route::view('/signup', 'welcome')->name('signup');
Route::view('/first-login', 'welcome');
Route::view('/jobs/{any}', 'welcome');
Route::view('/dashboard', 'welcome');
Route::view('/profile', 'welcome');
Route::view('/applied-jobs', 'welcome');
Route::view('/saved-jobs', 'welcome');
Route::view('/interviews', 'welcome');
Route::view('/interviews/join/{token}', 'welcome');
Route::view('/interviews/{roomName}', 'welcome');
Route::view('/messages', 'welcome');
Route::view('/resume', 'welcome');
Route::view('/user-dashboard', 'welcome');
Route::view('/user-dashboard/dashboard', 'welcome');
Route::view('/user-dashboard/profile', 'welcome');
Route::view('/user-dashboard/applied-jobs', 'welcome');
Route::view('/user-dashboard/saved-jobs', 'welcome');
Route::view('/user-dashboard/interviews', 'welcome');
Route::view('/user-dashboard/interviews/join/{token}', 'welcome');
Route::view('/user-dashboard/interviews/{roomName}', 'welcome');
Route::view('/user-dashboard/messages', 'welcome');
Route::view('/user-dashboard/resume', 'welcome');

Route::get('/api/pricing-plans', [PricingPlanController::class, 'index']);
Route::post('/api/pricing-plans', [PricingPlanController::class, 'store']);
Route::post('/api/pricing-plans/{id}', [PricingPlanController::class, 'update']);
Route::delete('/api/pricing-plans/{id}', [PricingPlanController::class, 'destroy']);

Route::get('/api/team-members', [TeamMemberController::class, 'index']);
Route::post('/api/team-members', [TeamMemberController::class, 'store']);
Route::post('/api/team-members/{id}', [TeamMemberController::class, 'update']);
Route::delete('/api/team-members/{id}', [TeamMemberController::class, 'destroy']);

Route::get('/api/home-page-content', [HomePageContentController::class, 'show']);
Route::get('/api/home-page-sections/media/{path}', [HomePageContentController::class, 'media'])->where('path', '.*');
Route::put('/api/admin/home-page-content', [HomePageContentController::class, 'update']);
Route::put('/api/admin/home-page-sections', [HomePageContentController::class, 'updateSections']);
Route::post('/api/admin/home-page-sections/upload-image', [HomePageContentController::class, 'uploadImage']);
Route::post('/api/admin/home-page-sections/{sectionKey}/items', [HomePageSectionItemController::class, 'store']);
Route::put('/api/admin/home-page-section-items/{item}', [HomePageSectionItemController::class, 'update']);
Route::delete('/api/admin/home-page-section-items/{item}', [HomePageSectionItemController::class, 'destroy']);

Route::get('/api/job-listings', [JobListingController::class, 'index']);
Route::post('/api/contact', [ContactController::class, 'store']);
Route::get('/api/admin/contact-submissions', [ContactController::class, 'index'])->middleware('auth:api');

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/refresh', [AuthController::class, 'refresh']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::get('/auth/user', [AuthController::class, 'user'])->middleware('auth:api');

Route::middleware('auth:api')->group(function () {
    Route::get('/api/job-listings/manage', [JobListingController::class, 'manage']);
    Route::post('/api/job-listings', [JobListingController::class, 'store']);
    Route::put('/api/job-listings/{jobListing}', [JobListingController::class, 'update']);
    Route::delete('/api/job-listings/{jobListing}', [JobListingController::class, 'destroy']);
    Route::post('/api/job-listings/{jobListing}/apply', [HrController::class, 'apply']);
    Route::get('/api/saved-jobs', [SavedJobController::class, 'index']);
    Route::post('/api/saved-jobs', [SavedJobController::class, 'store']);
    Route::delete('/api/saved-jobs/{jobListingId}', [SavedJobController::class, 'destroy']);

    Route::get('/api/resume', [ResumeController::class, 'show']);
    Route::post('/api/resume/upload', [ResumeController::class, 'upload']);
    Route::post('/api/resume/{resume}/analyze', [ResumeController::class, 'analyze']);
    Route::get('/api/resume/{resume}/ats', [ResumeController::class, 'atsScore']);
    Route::get('/api/resume/{resume}/job-match', [ResumeController::class, 'jobMatch']);

    Route::get('/api/candidate/profile', [CandidateProfileController::class, 'show']);
    Route::put('/api/candidate/profile', [CandidateProfileController::class, 'update']);
    Route::post('/api/candidate/profile/avatar', [CandidateProfileController::class, 'uploadAvatar']);
    Route::delete('/api/candidate/profile', [CandidateProfileController::class, 'destroy']);

    Route::get('/api/cv/profile', [CvProfileController::class, 'show']);
    Route::put('/api/cv/profile', [CvProfileController::class, 'update']);
    Route::get('/api/cv/templates', [CvProfileController::class, 'templates']);
    Route::get('/api/cv/preview/{slug}', [CvProfileController::class, 'preview']);
    Route::post('/api/cv/export/pdf', [CvProfileController::class, 'exportPdf']);

    Route::get('/api/interviews', [InterviewController::class, 'index']);
    Route::get('/api/interviews/candidates', [InterviewController::class, 'candidates']);
    Route::post('/api/interviews', [InterviewController::class, 'store']);
    Route::get('/api/interviews/access/{token}', [InterviewController::class, 'roomAccess']);
    Route::get('/api/interviews/{interview}', [InterviewController::class, 'show']);
    Route::put('/api/interviews/{interview}', [InterviewController::class, 'update']);
    Route::delete('/api/interviews/{interview}', [InterviewController::class, 'destroy']);

    Route::get('/api/hr/overview-stats',                         [HrController::class,       'overviewStats']);
    Route::get('/api/hr/analytics',                              [HrController::class,       'analytics']);
    Route::get('/api/hr/applications',                           [HrController::class,       'applications']);
    Route::put('/api/hr/applications/{id}',                      [HrController::class,       'updateApplication']);
    Route::get('/api/hr/hires',                                  [HrController::class,       'hires']);
    Route::get('/api/hr/candidates/{userId}/resume/download',     [HrController::class,       'downloadCandidateResume']);
    Route::get('/api/hr/candidates/{userId}',                    [HrController::class,       'candidateProfile']);
    Route::get('/api/hr/job-listings/{jobListingId}/applicants', [HrController::class,       'jobApplicants']);
    Route::get('/api/hr/team',                                   [HrTeamController::class,     'index']);
    Route::post('/api/hr/team',                                  [HrTeamController::class,     'store']);
    Route::delete('/api/hr/team/{id}',                           [HrTeamController::class,     'destroy']);
    Route::get('/api/hr/team/notes',                             [HrTeamNoteController::class, 'index']);
    Route::post('/api/hr/team/notes',                            [HrTeamNoteController::class, 'store']);
    Route::put('/api/hr/team/notes/{id}',                        [HrTeamNoteController::class, 'update']);
    Route::delete('/api/hr/team/notes/{id}',                     [HrTeamNoteController::class, 'destroy']);
    Route::get('/api/hr/settings',                               [HrSettingsController::class, 'show']);
    Route::put('/api/hr/settings',                               [HrSettingsController::class, 'update']);
    Route::put('/api/hr/account',                                [HrSettingsController::class, 'updateAccount']);
    Route::put('/api/hr/notifications',                          [HrSettingsController::class, 'updateNotifications']);

    Route::get('/api/candidate/applications', [HrController::class, 'myApplications']);

    Route::get('/api/notifications', [NotificationController::class, 'index']);
    Route::get('/api/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/api/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::post('/api/notifications/{notification}/read', [NotificationController::class, 'markRead']);

    Route::get('/api/hires', [HiresController::class, 'index']);
    Route::delete('/api/hires/{application}', [HiresController::class, 'destroy']);

    Route::get('/api/conversations', [ConversationController::class, 'index']);
    Route::get('/api/conversations/messageable-candidates', [ConversationController::class, 'messageableCandidates']);
    Route::post('/api/conversations', [ConversationController::class, 'store']);
    Route::get('/api/conversations/{conversation}/messages', [ConversationController::class, 'messages']);
    Route::post('/api/conversations/{conversation}/messages', [ConversationController::class, 'storeMessage']);
});

Route::get('/api/job-listings/{jobListing}', [JobListingController::class, 'show']);

Route::post('/auth/first-login/send-code',    [FirstLoginController::class, 'sendCode']);
Route::post('/auth/first-login/verify-code',  [FirstLoginController::class, 'verifyCode']);
Route::post('/auth/first-login/set-password', [FirstLoginController::class, 'setPassword']);
Route::post('/auth/first-login/resend-code',  [FirstLoginController::class, 'resendCode']);

Route::middleware(['auth:api', 'admin'])->prefix('api/admin')->group(function () {
    Route::get('/stats',                          [AdminController::class, 'stats']);
    Route::get('/hr-users',                       [AdminController::class, 'index']);
    Route::post('/hr-users',                      [AdminController::class, 'store']);
    Route::put('/hr-users/{id}',                  [AdminController::class, 'update']);
    Route::post('/hr-users/{id}/deactivate',      [AdminController::class, 'deactivate']);
    Route::post('/hr-users/{id}/reactivate',      [AdminController::class, 'reactivate']);
    Route::post('/hr-users/{id}/reset-password',  [AdminController::class, 'resetPassword']);
    Route::get('/logs',                           [AdminController::class, 'logs']);
});
