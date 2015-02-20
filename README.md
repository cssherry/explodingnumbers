# Exploding Numbers

[Website][website]

[website]: http://www.cssherry.com/exploding_numbers

## Minimum Viable Product
The game should be a tetris of numbers.

- [ ] Numbers fall and there is an initial layer of numbers on floor
- [ ] Game displays random arithmetic operations (+, -, /, and *) with answers that can be created from fallen numbers.
- [ ] Fallen/falling numbers should be clickable. Difficulty increases with every successful click.
- [ ] Difficulty is defined by quicker falling rate and larger numbers.

## Design Docs
### Classes
* View
* Game
* FallingScreen
* Equation

## Implementation Timeline

### Phase 1: User Authentication (~0.5 day)
I'll create the user authentication framework that will allow people to sign up, sign in, and view albums. Initially all albums will be public.

### Phase 2: Create Albums and Photos JSON API and Backbone Views (~2 days)
I will create API routes for albums, then photos, while creating the corresponding Backbone models and collections to fetch the data from these routes. Cloudinary will be implemented for uploading photos to the website.

### Phase 3: Editing and Tagging Albums/Photos (~2.5 day)
A third party api (probably Google Places), will be used to tag albums with locations. Tagged locations will collect all the albums from that location and display them.

### Phase 4: Viewing albums and photos on map (~2 day)
Using Google Maps, images and albums will be shown on a map. Albums will be shown on a map on the user's page, and images will be shown on a map on the album show page. Images without locations will be mapped to the albums location or will be grabbed from the image metadata. Albums without locations will grab locations from photos. There will be a navigation bar at the top of the page that will display all the countries, then states, then cities that albums appear.

### Bonus Features
- [ ] Point system based on difficulty and final score can be saved.
- [ ] Two modes, default mode ends game when numbers reach top of screen, timer method will return score at the end of 5 minutes.

## Technology used:
### JavaScript
- jQuery
  - jQuery UI
- AJAX
- YAML to save scores
### Canvas
