# BookStore Website 

This repository contains the source code for a BookStore website with various features implemented. The application is built using Node.js/Express.js for the server-side, MongoDB for the database, and EJS for rendering views.

Project Structure
public/ - Static files (CSS, images, etc.)
views/ - EJS view templates
routes/ - Route handlers
models/ - MongoDB data models
controllers/ - Application logic
config/ - Configuration files
app.js - Main application file

Dependencies
Express
Mongoose (MongoDB)
EJS
Body-parser
Express-session

Usage
Register a new account or log in.
Browse the bookstore, add books to the cart.
Search for books using the search bar.
View and manage the shopping cart.
Check the user menu for profile information.
Place an order with the required details.

Getting Started
Clone the repository: git clone git@github.com:m-s1621/Bookstore.git
Set up MongoDB and configure connection in the application.
Install dependencies: 
npm install passport-local-mongoose mongoose express ejs cookie-session passport express-session connect-ensure-login
node app.js
Go to http://localhost:3000 to access the BookStore website.

Book Display 
The main bookstore page displays all books with titles, images, prices, and 'add to cart' buttons.

Shopping Cart 
Users can add books to a shopping cart.
An item-number is displayed on the main bookstore page, indicating the number of books in the shopping cart. 
Users can show/hide the shopping cart.

Shopping Cart Features 
The shopping cart displays added books with images, prices, and titles.
Total price is calculated and displayed.
Users can remove, add, or reduce the quantity of each book in the cart.
Search Functionality (10 points)
The website includes a functioning search bar for searching by book titles or prices.

User Menu 
The main page has a user menu for users to check their profiles.

Search Functionality 
The website includes a functioning search bar for searching by book titles or prices.

User Authentication 
New users can register an account with information including last name, first name, email, zip code, username, and password.
MongoDB is used as the database for user information.

Login and Redirect 
Users can log in using a local strategy (username + password).
Upon successful login, users are redirected to the main bookstore page, displaying a welcome message.

Server-Side Implementation 
The server-side app is written in Node.js/Express.js.
The entire website is hosted on an Express.js local server.
Separate request handlers are defined to handle all routes

Technologies Used
HTMl
CSS
JavaScript
Node.js
Express.js
MongoDB
EJS (Embedded JavaScript for views)

License
This project is licensed under the MIT License.

