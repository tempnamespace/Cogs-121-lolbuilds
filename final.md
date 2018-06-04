Team Interacting-with-but-not-selling-real-world-data:

Adam Schachne
- Designed our technology stack for the project. Introduced React and revamped our old version of the webpage. Programmed the front end webm animations and backend interactions with the champion grid.

Kelvin Pan
- Designed the analysis page and the data visualization for player roles. Worked on front end design and set up scss for the project

Timothy Bian
- Set up backend calls to Riot and data APIs for champion builds and runes and utilized them in frontend components.

server.js: The backend node server set up with express. Also sets up all of our backend Riot API calls using LeagueJs wrapper.

App.js: Creates the React app with routes to each of our main component pages.

index.js: Set up to export the app for Node.

analysis.jsx: Analyze the current profile's match history and draw a chart with their past 10 roles.  

build.jsx: Fetch a build recommendation with this champion from the backend and render it on screen

clock.jsx: Timer/clock used in the profile's current active game checking interval

ellipsis.jsx: "..." that is rendered additively depending on time interval

game.jsx: Checks if the profile has a current game and fetch the info via calls from the backend. Use clock and ellipses in the searching process for the activegame. Also parses the current game info for the build component.

home.jsx: just a simple home component

navButtons.jsx: buttons to help navigate to the route pages 

profile.jsx: Allow user to populate the current profile by searching a user name. We will fetch from the backend for this user, parse the information related to the account and display it along with the corresponding photos and webm animation.

search.jsx: The search bar properties of the profile search in profile.jsx

search.scss: style the animations to be in the correct dimension and colors in order to sync everything and to place the searched user neatly into the webm animation.

settings.jsx: Allows user to clear the current searched profile manually

championgrid.jsx: Renders the grid of all League of Legends champions. Clicking on any champion will open a rune suggestion for the champion.

runes.jsx: fetches from the backend a runes path for the champion and render it accordingly on a modal.

champions.js & championsToId.jsx: Large array that list all the champion names and a large object that maps each champion to its ID, respectively.






