## ADDED Requirements

### Requirement: User registration
The system SHALL allow users to register with email, password, full name, phone number, and account type (renter or landlord).

#### Scenario: Successful renter registration
- **WHEN** user submits the registration form with valid email, password (min 8 chars), full name, phone number, and "Renter" role selected
- **THEN** an account is created, a verification email is sent, and user is redirected to the login page with a "Verify your email" message

#### Scenario: Successful landlord registration
- **WHEN** user submits the registration form with valid data and "Landlord" role selected
- **THEN** an account is created with landlord role and the same verification flow applies

#### Scenario: Duplicate email
- **WHEN** user attempts to register with an email that is already registered
- **THEN** the form displays an error "An account with this email already exists" without revealing whether the account is renter or landlord

#### Scenario: Validation errors
- **WHEN** user submits the form with invalid data (weak password, invalid email, missing required fields)
- **THEN** inline validation errors are displayed next to each invalid field and the form is not submitted

### Requirement: User login
The system SHALL authenticate users by email and password and issue JWT access and refresh tokens.

#### Scenario: Successful login
- **WHEN** user submits valid email and password credentials
- **THEN** a JWT access token is returned in the response body and a refresh token is set as an HTTP-only cookie; user is redirected to their dashboard

#### Scenario: Invalid credentials
- **WHEN** user submits incorrect email or password
- **THEN** a generic error "Invalid email or password" is displayed (do not reveal which field is wrong)

#### Scenario: Unverified email login
- **WHEN** user attempts to login before verifying their email
- **THEN** a message is displayed prompting them to check their inbox and offering to resend the verification email

### Requirement: Email verification
The system SHALL require email verification before granting full access to the application.

#### Scenario: Verify email via link
- **WHEN** user clicks the verification link in their email
- **THEN** their account is marked as verified and they are redirected to the login page with a success message

#### Scenario: Resend verification email
- **WHEN** an unverified user clicks "Resend verification email" on the login page
- **THEN** a new verification email is sent and a confirmation message is displayed

### Requirement: Password reset
The system SHALL allow users to request a password reset via email.

#### Scenario: Request password reset
- **WHEN** user submits their email on the "Forgot Password" form
- **THEN** a password reset email is sent if the email exists; a generic success message is displayed regardless of whether the email was found

#### Scenario: Reset password via link
- **WHEN** user clicks the reset link (valid, not expired) and submits a new password
- **THEN** their password is updated and they are redirected to login with a success message

#### Scenario: Expired reset link
- **WHEN** user clicks an expired or already-used reset link
- **THEN** an error message is displayed with a link to request a new reset

### Requirement: Protected routes
The system SHALL prevent unauthenticated users from accessing protected pages and redirect them to login.

#### Scenario: Access protected page without auth
- **WHEN** an unauthenticated user navigates to a protected route (dashboard, favorites, booking flow)
- **THEN** they are redirected to the login page; after successful login, they are redirected back to the originally requested page

#### Scenario: Session expiry
- **WHEN** a user's access token expires during a session
- **THEN** the refresh token is used to silently obtain a new access token; if the refresh token has also expired, the user is redirected to login

### Requirement: Role-based authorization
The system SHALL restrict landlord-only features to landlord accounts and renter-only features to renter accounts.

#### Scenario: Renter accesses landlord feature
- **WHEN** a renter attempts to access a landlord-only endpoint or page (e.g., create listing)
- **THEN** a 403 Forbidden response is returned or the user is redirected to their dashboard

#### Scenario: Landlord accesses renter feature
- **WHEN** a landlord attempts to submit a booking request as a renter
- **THEN** the action is denied with an appropriate error message

### Requirement: Profile management
The system SHALL allow authenticated users to view and edit their profile information including name, phone number, and profile photo.

#### Scenario: Edit profile
- **WHEN** user updates their profile fields and saves
- **THEN** the changes are persisted and a success toast is displayed

#### Scenario: Upload profile photo
- **WHEN** user uploads a profile photo
- **THEN** the image is optimized and saved; the new photo appears in the header and profile sections

### Requirement: Logout
The system SHALL allow users to log out, clearing their session tokens.

#### Scenario: Logout
- **WHEN** user clicks the "Logout" button
- **THEN** the refresh token cookie is cleared, the access token is removed from memory, and the user is redirected to the home page
