## ADDED Requirements

### Requirement: Renter dashboard overview
The system SHALL provide renters a dashboard showing a summary of their saved properties, active booking requests, and recent activity.

#### Scenario: Dashboard cards summary
- **WHEN** a renter navigates to their dashboard
- **THEN** they SHALL see summary cards showing: count of saved/favorited properties, count of pending booking requests, count of accepted bookings, and a recent activity feed

#### Scenario: Quick access to saved properties
- **WHEN** renter clicks the "Saved Properties" summary card
- **THEN** they are navigated to their full favorites list

#### Scenario: Quick access to bookings
- **WHEN** renter clicks the "Booking Requests" summary card
- **THEN** they are navigated to their booking requests list

### Requirement: Landlord dashboard overview
The system SHALL provide landlords a dashboard showing their listing statistics, pending booking requests, and property management tools.

#### Scenario: Dashboard statistics
- **WHEN** a landlord navigates to their dashboard
- **THEN** they SHALL see: total active listings count, total views across all listings, pending booking requests count, and monthly inquiry trend

#### Scenario: Quick actions
- **WHEN** landlord views the dashboard
- **THEN** prominent action buttons are displayed: "Add New Listing", "Manage Listings", and "View Booking Requests"

#### Scenario: Recent activity feed
- **WHEN** landlord views the dashboard
- **THEN** a chronological activity feed shows: new booking requests, request status changes, listing view milestones

### Requirement: Property management (landlord)
The system SHALL allow landlords to create, edit, and manage their property listings.

#### Scenario: Create new listing
- **WHEN** landlord clicks "Add New Listing" and fills in the multi-step form (property details, photos, pricing, amenities)
- **THEN** the new listing is created and appears in their property list with status "active"

#### Scenario: Edit existing listing
- **WHEN** landlord clicks "Edit" on one of their listings and modifies fields
- **THEN** the listing is updated and changes are reflected immediately on the public listing page

#### Scenario: Deactivate listing
- **WHEN** landlord toggles a listing to "inactive"
- **THEN** the listing is hidden from public search results but remains editable in the landlord's management view

#### Scenario: Delete listing
- **WHEN** landlord clicks "Delete" on a listing and confirms the deletion
- **THEN** the listing and all associated images are permanently removed; any pending booking requests for this property are cancelled with a notification to renters

### Requirement: Photo upload for listings
The system SHALL allow landlords to upload, reorder, and delete photos for their property listings.

#### Scenario: Upload photos
- **WHEN** landlord uploads property photos (up to 20 images, max 10MB each)
- **THEN** images are optimized to multiple sizes, stored on the server, and displayed as a sortable gallery in the listing form

#### Scenario: Reorder photos
- **WHEN** landlord drags and drops photos to reorder them in the listing form
- **THEN** the new order is persisted and reflected in the property detail gallery

#### Scenario: Delete photo
- **WHEN** landlord clicks the delete icon on a photo in the listing form
- **THEN** the photo is removed from the listing and deleted from storage

### Requirement: User profile settings
The system SHALL provide a settings page for users to manage their profile, password, and notification preferences.

#### Scenario: Change password
- **WHEN** user enters current password and new password on the settings page
- **THEN** their password is updated and all existing sessions are invalidated

#### Scenario: Notification preferences
- **WHEN** user toggles notification settings (email notifications for booking updates, new messages)
- **THEN** preferences are saved and applied to future notifications

### Requirement: Dashboard empty states
The system SHALL display appropriate empty states and onboarding guidance for new users with no data.

#### Scenario: New renter dashboard
- **WHEN** a newly registered renter visits their empty dashboard
- **THEN** they SHALL see onboarding prompts: "Browse properties to find your next home", "Save properties you like to compare them later"

#### Scenario: New landlord dashboard
- **WHEN** a newly registered landlord visits their empty dashboard
- **THEN** they SHALL see an onboarding prompt: "Create your first listing to start receiving booking requests" with a prominent CTA button

### Requirement: Responsive dashboard layout
The system SHALL adapt the dashboard layout for mobile and desktop viewports.

#### Scenario: Desktop dashboard layout
- **WHEN** dashboard is viewed on a screen wider than 1024px
- **THEN** a sidebar navigation and multi-column card layout is used

#### Scenario: Mobile dashboard layout
- **WHEN** dashboard is viewed on a screen narrower than 768px
- **THEN** a bottom tab bar or hamburger menu navigation is used with stacked single-column cards
