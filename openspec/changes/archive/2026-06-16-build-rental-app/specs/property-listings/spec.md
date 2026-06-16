## ADDED Requirements

### Requirement: Property listing search and filtering
The system SHALL allow users to search and filter property listings by location, price range, property type, number of bedrooms and bathrooms, and amenities.

#### Scenario: Search by location
- **WHEN** user enters a city or neighborhood name in the search bar
- **THEN** the system displays properties matching that location, sorted by relevance

#### Scenario: Filter by price range
- **WHEN** user sets minimum and maximum price filters
- **THEN** only properties with monthly rent within that range are displayed

#### Scenario: Filter by property type
- **WHEN** user selects one or more property types (apartment, house, condo, studio)
- **THEN** only properties matching the selected types are displayed

#### Scenario: Filter by bedrooms and bathrooms
- **WHEN** user selects minimum bedroom and bathroom counts
- **THEN** only properties meeting or exceeding those counts are displayed

#### Scenario: Filter by amenities
- **WHEN** user selects amenities (parking, gym, pool, pet-friendly, furnished, etc.)
- **THEN** only properties that have all selected amenities are displayed

### Requirement: Property listing display
The system SHALL display property listings as cards in a responsive grid layout, each card showing property photo, price, title, location, and key stats.

#### Scenario: Grid layout on desktop
- **WHEN** user views listings on a screen wider than 1024px
- **THEN** properties are displayed in a 3-column grid

#### Scenario: Grid layout on tablet
- **WHEN** user views listings on a screen between 768px and 1024px
- **THEN** properties are displayed in a 2-column grid

#### Scenario: List layout on mobile
- **WHEN** user views listings on a screen narrower than 768px
- **THEN** properties are displayed in a single-column list with larger touch targets

#### Scenario: Property card content
- **WHEN** a property card is rendered
- **THEN** it SHALL display the primary photo, monthly rent price, property title, neighborhood/city, and at least bedroom count, bathroom count, and square footage

### Requirement: Property listing sorting
The system SHALL allow users to sort property listings by price (low to high, high to low), newest first, and by rating.

#### Scenario: Sort by price ascending
- **WHEN** user selects "Price: Low to High" sort option
- **THEN** properties are reordered from lowest to highest monthly rent

#### Scenario: Sort by newest
- **WHEN** user selects "Newest" sort option
- **THEN** properties are reordered by listing creation date, newest first

### Requirement: Pagination
The system SHALL paginate property listings with configurable page size and provide page navigation controls.

#### Scenario: Navigate to next page
- **WHEN** user clicks the "Next" pagination button and more results exist
- **THEN** the next page of properties is loaded and displayed

#### Scenario: Last page behavior
- **WHEN** user is on the last page of results
- **THEN** the "Next" button is disabled

### Requirement: Map view toggle
The system SHALL allow users to toggle between a property card grid view and an interactive map view showing property locations.

#### Scenario: Switch to map view
- **WHEN** user clicks the "Map" toggle button
- **THEN** the listing grid is replaced by an interactive map with property markers

#### Scenario: Click map marker
- **WHEN** user clicks a property marker on the map
- **THEN** a popup appears showing the property photo, price, and title with a link to the detail page

### Requirement: Empty and loading states
The system SHALL display appropriate loading skeletons while fetching listings and an empty state message when no properties match the current filters.

#### Scenario: Loading state
- **WHEN** property data is being fetched from the API
- **THEN** skeleton card placeholders are displayed instead of blank space

#### Scenario: No results
- **WHEN** no properties match the current search criteria or filters
- **THEN** a friendly empty state message is shown with suggestions to widen search criteria and a clear-filters button

### Requirement: Error handling
The system SHALL handle API errors gracefully with user-friendly error messages and a retry option.

#### Scenario: API request fails
- **WHEN** the property listing API request fails
- **THEN** an error message is displayed with a "Try Again" button that re-attempts the request
