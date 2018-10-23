# exprest
REST API structure built with Express and contains customizable models.

Try live version at heroku: https://exprest.herokuapp.com/

#

## API Doc

### Sample Post resource
**GET /posts** - Finds all posts.

**GET /posts/{id}** - Finds the post with given id.

**POST /posts** - Creates a new post.

    {
        "title": "New Title", 
        "body": "Post body"
    }

**PATCH /posts/{id}** - Updates the existing post with given id. 

**DELETE /posts/{id}** - Removes the existing post with given id.

### Sample User resource
**GET /users** - Finds all users.

**GET /users/{id}** - Finds the user with given id.

**GET /users/me** - Finds the user who made the request.

**POST /users/** - Creates a new user.

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

**DELETE /users/{id}** - Removes the existing user with given id.