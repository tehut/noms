# Improvements for web application
  If I were to re-address this project as a website I would focus on three areas
  - Authentication
  - Endpoint Selection
  - Decoupling Rendering and Processing
  
## Authentication
  Noms currently calls the SF Municipal API with a hardcoded header token declared at the top of the file.  In a web application I would store that key as an environment variable separate from the logic of my application.  I'd need to run regular health checks to make sure the token was still valid and 
  provision a script to renew the token in advance of expiration.
  
## Dynamic Endpoint Selection
  As currently designed, the Noms CLI references hardcoded column values. A better approach for a web api would be to call the API on load (possibly with a limit of 1 to minimize load on the system) and parse that value to populate a list of possible columns for a user to chose from.  That way we would never have to worry about column strings being out of sync with an updated version of the API and we would be providing a better user experience.

## Rendering
  Currently the data is processed and printed in a single function, in a web application that logic would be split up in a more atomic fashion.