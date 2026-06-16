# Property Detail Page

## Purpose

Provide a comprehensive property detail view with image gallery, property information, location map, landlord card, and availability calendar.

## Requirements

### Requirement: Property image gallery
The system SHALL display a responsive image gallery on the property detail page with navigation controls and fullscreen lightbox.

#### Scenario: Gallery navigation
- **WHEN** user clicks left or right arrow buttons on the gallery
- **THEN** the gallery advances to the previous or next image with a smooth slide animation

#### Scenario: Thumbnail selection
- **WHEN** user clicks a thumbnail image below the main gallery
- **THEN** the main gallery displays the selected image at full resolution

#### Scenario: Lightbox fullscreen
- **WHEN** user clicks the main gallery image
- **THEN** the image opens in a fullscreen lightbox with zoom capability and swipe navigation

#### Scenario: No images available
- **WHEN** a property has no uploaded images
- **THEN** a styled placeholder image with the property type icon is displayed

### Requirement: Property information display
The system SHALL display comprehensive property information including title, description, price breakdown, address, property details, and amenities.

#### Scenario: Price display
- **WHEN** the property detail page loads
- **THEN** the monthly rent is prominently displayed along with any additional fees (security deposit, utilities estimate)

#### Scenario: Property details section
- **WHEN** user scrolls to the details section
- **THEN** property details SHALL include: property type, year built, floor number (if applicable), total square footage, bedroom count, bathroom count, furnished status, and available date

#### Scenario: Amenities display
- **WHEN** user views the amenities section
- **THEN** amenities are displayed as icon-labeled chips or badges in a grid layout

### Requirement: Location map
The system SHALL display an interactive map showing the property's location with the surrounding neighborhood.

#### Scenario: Map display
- **WHEN** user scrolls to the location section
- **THEN** an interactive map is displayed centered on the property's coordinates with a custom marker

#### Scenario: Nearby points of interest
- **WHEN** the map is displayed
- **THEN** nearby points of interest (transit stops, grocery stores, restaurants) are optionally shown

### Requirement: Landlord information card
The system SHALL display a card with the landlord's name, photo, response rate, and contact options.

#### Scenario: Landlord card display
- **WHEN** user views the property detail sidebar
- **THEN** the landlord's name, profile photo, average response time, and response rate are displayed

#### Scenario: Contact landlord
- **WHEN** user clicks "Contact Landlord" button
- **THEN** a contact form or the booking request flow is initiated (depending on context — general inquiry or rental request)

### Requirement: Availability calendar
The system SHALL display a calendar showing the property's availability status, highlighting available and unavailable dates.

#### Scenario: Calendar display
- **WHEN** user views the availability section
- **THEN** a monthly calendar is displayed with unavailable dates visually distinguished (grayed out or crossed out)

#### Scenario: Navigate months
- **WHEN** user clicks next/previous month buttons
- **THEN** the calendar advances to the next or previous month

### Requirement: Share and save actions
The system SHALL provide share and save/favorite actions on the property detail page.

#### Scenario: Save to favorites
- **WHEN** an authenticated renter clicks the heart/save button
- **THEN** the property is added to their favorites and the button shows a filled heart state

#### Scenario: Share property
- **WHEN** user clicks the share button
- **THEN** the property URL is copied to clipboard and a brief "Link copied" confirmation is shown

### Requirement: Loading and error states
The system SHALL handle missing properties and loading states gracefully on the detail page.

#### Scenario: Property not found
- **WHEN** a user navigates to a property ID that does not exist
- **THEN** a 404 state is displayed with a "Browse Listings" link back to the search page

#### Scenario: Detail page loading
- **WHEN** property data is loading
- **THEN** skeleton placeholders are shown for the gallery, title, description, and sidebar sections
