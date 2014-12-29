# Live reload
We use nodemon for the server side to allow for rapid server side modification

# Playing the game
You should see the README in the client folder to see how to play.
The game is implemented as a SPA currently.

# Possible URL structure
Here is an initial (unimplemented) list of urls, explanation left out 
until someone asks what they mean.

### games
1. get /games ?
2. /game/:id
    1. get /info
    2. post /edit
    3. post /join and /leave ?

### users
If we decide to store some user info on the server side, here would be a structure

1. get /users ?
2. /user/:id
    1. get /info ?
    2. post /edit ?

all gets return json

all posts send query parameters
