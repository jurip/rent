## ADDED Requirements

### Requirement: Submit booking request
The system SHALL allow authenticated renters to submit a booking or rental inquiry request for a property, including desired move-in date, rental duration, and a message to the landlord.

#### Scenario: Submit booking request
- **WHEN** an authenticated renter fills in the booking form (move-in date, lease duration, personal message) and clicks "Send Request"
- **THEN** the booking request is created with status "pending" and the renter sees a success confirmation with the request details

#### Scenario: Unauthenticated booking attempt
- **WHEN** an unauthenticated user clicks "Request to Book" on a property detail page
- **THEN** they are redirected to login with a message "Please log in to book this property"; after login they are returned to the booking form

#### Scenario: Booking your own property
- **WHEN** a landlord attempts to submit a booking request for their own property
- **THEN** the request is rejected with error "You cannot book your own property"

#### Scenario: Validation errors
- **WHEN** user submits the booking form with a past move-in date or missing required fields
- **THEN** inline validation errors are displayed and the form is not submitted

### Requirement: View booking requests (landlord)
The system SHALL allow landlords to view all booking requests for their properties, filterable by status (pending, accepted, rejected).

#### Scenario: View pending requests
- **WHEN** a landlord navigates to their booking requests dashboard
- **THEN** all booking requests for their properties are displayed, grouped by property, with pending requests shown first

#### Scenario: Filter by status
- **WHEN** landlord filters requests by status "Accepted"
- **THEN** only accepted booking requests are displayed

#### Scenario: No requests
- **WHEN** a landlord has no booking requests for their properties
- **THEN** an empty state message is displayed: "No booking requests yet. When renters are interested in your properties, their requests will appear here."

### Requirement: Accept or reject booking request
The system SHALL allow landlords to accept or reject a pending booking request with an optional response message.

#### Scenario: Accept request
- **WHEN** landlord clicks "Accept" on a pending booking request and optionally writes a message
- **THEN** the request status changes to "accepted", the renter is notified, and the property's availability calendar is updated

#### Scenario: Reject request
- **WHEN** landlord clicks "Reject" on a pending booking request and optionally writes a message
- **THEN** the request status changes to "rejected", the renter is notified, and the property remains available

#### Scenario: Already processed request
- **WHEN** landlord attempts to accept or reject a request that is no longer pending
- **THEN** an error is displayed: "This request has already been processed"

### Requirement: View booking requests (renter)
The system SHALL allow renters to view the status of all booking requests they have submitted, filterable by status.

#### Scenario: View sent requests
- **WHEN** a renter navigates to "My Booking Requests" in their dashboard
- **THEN** all their submitted booking requests are displayed with status badges (pending, accepted, rejected) and property thumbnails

#### Scenario: Request status updates
- **WHEN** a landlord accepts or rejects a renter's booking request
- **THEN** the renter sees the updated status in their dashboard on next page load or via notification

### Requirement: Booking request notification
The system SHALL notify users about booking request status changes.

#### Scenario: Landlord receives new request notification
- **WHEN** a renter submits a new booking request
- **THEN** the property's landlord sees a notification badge on their dashboard indicating a new pending request

#### Scenario: Renter receives response notification
- **WHEN** a landlord accepts or rejects a request
- **THEN** the renter sees a notification badge indicating their request status has changed

### Requirement: Cancel booking request
The system SHALL allow renters to cancel a pending booking request before the landlord responds.

#### Scenario: Cancel pending request
- **WHEN** a renter clicks "Cancel Request" on a pending booking and confirms
- **THEN** the request status changes to "cancelled" and the landlord is notified

#### Scenario: Cancel already processed request
- **WHEN** a renter attempts to cancel a request that has already been accepted or rejected
- **THEN** the cancel action is not available; only cancellation of pending requests is allowed
