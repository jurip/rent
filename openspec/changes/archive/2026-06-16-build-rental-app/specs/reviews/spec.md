## ADDED Requirements

### Requirement: Submit property review
The system SHALL allow renters to submit a review for a property they have rented, including a star rating (1-5) and written feedback.

#### Scenario: Submit review
- **WHEN** a renter who has an accepted booking for a property writes a review with a star rating and comment
- **THEN** the review is published on the property's detail page and the renter sees a success confirmation

#### Scenario: Review without booking
- **WHEN** a user attempts to review a property they have not rented
- **THEN** the review form is not available; instead a message "Only verified renters can leave a review" is displayed

#### Scenario: Duplicate review
- **WHEN** a renter attempts to submit a second review for the same property
- **THEN** an error is displayed: "You have already reviewed this property. You can edit your existing review."

#### Scenario: Edit existing review
- **WHEN** a renter edits their existing review
- **THEN** the updated rating and comment replace the previous version; an "Edited" label is shown

### Requirement: Review display on property page
The system SHALL display reviews on the property detail page with aggregate rating, review count, and individual review cards.

#### Scenario: Aggregate rating display
- **WHEN** a property has reviews
- **THEN** the average star rating (to 1 decimal) and total review count are displayed near the property title

#### Scenario: Individual review cards
- **WHEN** user scrolls to the reviews section
- **THEN** each review is displayed as a card with: reviewer name, profile photo, star rating, date, and comment text

#### Scenario: Sort reviews
- **WHEN** user selects a sort option for reviews (newest, highest rated, lowest rated)
- **THEN** reviews are reordered accordingly

#### Scenario: No reviews
- **WHEN** a property has no reviews yet
- **THEN** a message is displayed: "No reviews yet. Be the first to review this property!"

### Requirement: Landlord response to reviews
The system SHALL allow landlords to post a public response to a review on their property.

#### Scenario: Landlord responds to review
- **WHEN** a landlord writes a response to a specific review
- **THEN** the response is displayed below the review with a "Landlord response" label and timestamp

#### Scenario: Edit response
- **WHEN** a landlord edits their existing response
- **THEN** the updated response replaces the previous one with an "Edited" label

### Requirement: Review guidelines and moderation flags
The system SHALL enforce basic review content guidelines and allow users to flag inappropriate reviews.

#### Scenario: Minimum review length
- **WHEN** a user submits a review with fewer than 10 characters in the comment
- **THEN** a validation error is displayed: "Please write at least 10 characters"

#### Scenario: Flag inappropriate review
- **WHEN** a user clicks "Report" on a review
- **THEN** the review is flagged for moderation and the reporting user sees "Thank you for your report. We will review this content."

### Requirement: Review deletion
The system SHALL allow renters to delete their own reviews.

#### Scenario: Delete own review
- **WHEN** a renter clicks "Delete" on their own review and confirms
- **THEN** the review and its rating are removed; the property's aggregate rating is recalculated

#### Scenario: Delete review with landlord response
- **WHEN** a renter deletes a review that has a landlord response
- **THEN** both the review and the landlord response are removed
