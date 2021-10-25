
# General info
URL shortener created using MERN stack. It stores and tracks every visit of a user to shortened links. It uses chartjs to visualize tracking data with charts.
 Tracking mechanism is fully custom made and there are methods that can display:
 

 - Unique visits to a url per day
 - Total visits to a url per day
 - Total visits of a user
 - Daily visits histry of a user
 - Daily visits history of a user to a given url

## Setup

 1. Create .env file in the root directory with variable called - URI (connection string for mongodb).
 2. Change backend api url in /client/app.js
 3. 3. npm i

## User
Users are defined by their IPs (currently using expressjs's built-in req.ip method, which isn't reliable. Better way of doing it would be using headers('x-forwarded-for', 'x-real-ip') when run behind a proxy) 

## Shortened URL
Shortened URLs are stored with 4 fields.

 - URL - URL given by the user
 - Alias - Alias ("nickname" for shortened URL) given by user or generated automatically using npm package nanoid. 
 - Secret - password for alias. Used for deleting alias (only accessible on backend, no frontend UI)
 - urlVisits - Array of ids' of urlHistory objects that are connected to this alias.	

## URL History and tracking
All the tracking is done in seperate DB collections called 'urlHistory'. It stores relations between user's IP and websites Alias.
It has 5 fields:

 - ip - IP of a user
 - alias - Alias of a shortened URL
 - date - Custom creation date
 - totalVisits - total amounts of visits from a user to alias
 -  urlVisits - This itself is a sub-document with its own fields. It is created every day when user visits alias and keeps track of number of visits.

## urlVisits - subdocument

This is subdocument for urlHistory collection. It has 2 fields:

 - date - custom date of creation
 - visits - number of visits on this day
