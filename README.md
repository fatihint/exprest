# exprest
REST API structure built with Express and contains customizable models.

Try live version at heroku: https://exprest.herokuapp.com/

#

## Installation

Install dependencies, create `config.json` in which you can declare "MONGODB_URI" and/or "PORT" variables then start the server.
```
$ cd exprest

$ npm install

$ node server
```

#

## API Doc

**Note:** There are 2 types of users in the API. An `ADMIN`, which has access all of the users and posts in the database, and there's normal `USER`, who only has access of it's own user information and posts owned by.

**Authentication:** Every request except User Login and User Register requires authentication. In order to authenticate, HTTP header called `x-auth` must be set and sent with requests. To get the valid token, send a **POST** request to **/users/login** with user info in the body,and get the token back, which you can use for your next requests.

Test Admin User Information for [Heroku App](https://exprest.herokuapp.com/):

 Email: admin@admin.com

 Password: password 

#

### Sample Post resource

**GET /posts** - Finds all posts.

**GET /posts/{id}** - Finds the post with given id.

**POST /posts** - Creates a new post with given info:

    {
        "title": "New Title", 
        "body": "Post body"
    }

**PATCH /posts/{id}** - Updates the existing post with given id. 

**DELETE /posts/{id}** - Removes the existing post with given id.

#

### Sample User resource

**GET /users** - Finds all users.

**GET /users/{id}** - Finds the user with given id.

**GET /users/me** - Finds the user who made the request.

**POST /users/** - Creates a new user with given info: 

    {
        "email": "example@example.com", 
        "password": "password"
    }

**POST /users/login** - Creates an authentication token and returns it back to user.

    {
        "email": "example@example.com", 
        "password": "password"
    }

**PATCH /users/{id}** - Updates the existing user with given id.

    {
        "email": "updated@example.com", 
        "password": "updatedpassword"
    }

**DELETE /users/{id}** - Removes the existing user with given id.