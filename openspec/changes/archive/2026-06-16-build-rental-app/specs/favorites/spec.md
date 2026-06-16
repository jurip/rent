## ADDED Requirements

### Requirement: Add property to favorites
The system SHALL allow authenticated renters to save properties to their favorites list from listing cards and property detail pages.

#### Scenario: Save from listing card
- **WHEN** a renter clicks the heart icon on a property card
- **THEN** the property is added to their favorites, the heart icon is filled with an animation, and a brief toast message "Saved to favorites" is shown

#### Scenario: Unsave from listing card
- **WHEN** a renter clicks the filled heart icon on a favorited property card
- **THEN** the property is removed from favorites, the heart icon returns to outline state, and a toast "Removed from favorites" is shown

#### Scenario: Save from detail page
- **WHEN** a renter clicks the "Save" or heart button on the property detail page
- **THEN** the property is toggled in their favorites (add or remove)

#### Scenario: Unauthenticated save attempt
- **WHEN** an unauthenticated user clicks the heart icon
- **THEN** they are prompted to log in or register with a modal or redirect

### Requirement: View favorites list
The system SHALL provide a dedicated page for renters to view all their favorited properties in a responsive grid.

#### Scenario: Favorites page with items
- **WHEN** a renter navigates to their favorites page
- **THEN** all saved properties are displayed as cards with photo, price, title, location, and the date they were saved

#### Scenario: Empty favorites
- **WHEN** a renter navigates to their favorites page but has no saved properties
- **THEN** an empty state is displayed: "No saved properties yet. Start browsing and save the ones you love!" with a "Browse Listings" CTA button

#### Scenario: Remove from favorites page
- **WHEN** a renter clicks the remove/unsave button on a property in their favorites list
- **THEN** the property card is removed from the list with a fade-out animation

### Requirement: Side-by-side comparison
The system SHALL allow renters to select up to 3 favorited properties and compare them side by side.

#### Scenario: Enter comparison mode
- **WHEN** renter clicks "Compare" and selects 2-3 properties from their favorites
- **THEN** a comparison view is displayed showing properties in columns with rows for: photo, price, bedrooms, bathrooms, square footage, amenities, and location

#### Scenario: Maximum selection
- **WHEN** renter tries to select a 4th property for comparison
- **THEN** a message is shown: "You can compare up to 3 properties at a time"

#### Scenario: Single property comparison
- **WHEN** renter selects only 1 property and clicks compare
- **THEN** the comparison button is disabled until at least 2 properties are selected

### Requirement: Favorites sorting and filtering
The system SHALL allow renters to sort and filter their favorites list.

#### Scenario: Sort favorites by date saved
- **WHEN** renter selects "Recently Saved" sort option
- **THEN** favorites are ordered by save date, most recent first

#### Scenario: Sort favorites by price
- **WHEN** renter selects "Price: Low to High" sort option
- **THEN** favorites are ordered by monthly rent ascending

#### Scenario: Filter favorites by status
- **WHEN** renter filters favorites to show only "Available" properties
- **THEN** only favorited properties that are currently available are displayed

### Requirement: Favorites count badge
The system SHALL display a favorites count badge on relevant navigation elements.

#### Scenario: Favorites count in navigation
- **WHEN** a renter has saved properties
- **THEN** the favorites icon in the navigation header shows a badge with the count of saved properties

#### Scenario: Real-time count update
- **WHEN** a renter adds or removes a property from favorites
- **THEN** the favorites count badge updates immediately without page refresh
