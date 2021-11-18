# Awesome Todos: API Server

In this lab we will implement an API rest server that handles CRUDing Todos. You will have a client that consumes the API already implemented that communicates with the server using `/api` path only.

The client also has the sign in with google feature already configured. However, your API server needs to handle signing with google logic internally. To accomplish this, it requires credentials from Google, which can be obtained by setting up a project in [Google APIs console](https://console.cloud.google.com/apis/credentials).

To start the lab run the following commands in the root directory:

- `yarn run setup`: This is required after first start only to install node_modules
- `yarn start`: Run this every time to start the containers

## Routes

The NGINX reverse proxy is setup to redirect any request starting with `/api` to the express api server. Thus, all your routes need to start with `/api`. Additionally, the client is already set up to communicate over the following routes.

### Auth

- `GET /api/auth/google`: When a user clicks `Sign in with Google` the client will redirect the user to this route. It needs to handle redirecting the user to google OAuth consent page.
- `GET /api/auth/google/callback`: This route won't be used by the client. However, it is needed for any OAuth application. Rememeber to add it to [Google APIs console](https://console.cloud.google.com/apis/credentials) settings as well. By successful authentication, it should set an authentication cookie that holds the user JWT.
- `GET /api/auth/me`: This is an **authenticated only** endpoint that should respond with a user object as specified in the user schema below.
- `GET /api/auth/logout`: This is an **authenticated only** endpoint that should clear the authentication cookie and log the user out.

### Todos

These endpoints are **authenticated only**. They are to create, read, update, and delete Todos.

- `GET /api/todos`: Should respond with a JSON array of current user's todo items in the database.
- `POST /api/todos`: Should validate, and create todo item in the database related to current user, then respond with the created todo.
- `PUT /api/todos/:id`: Should
  - find todo with the given `:id`,
  - validate it belongs to current user,
  - validate correct schema,
  - and update the said todo in the database,
  - then respond with the updated todo.
- `DELETE /api/todos/:id`: Should
  - find todo with the given `:id`,
  - validate it belongs to current user,
  - delete said todo from database,
  - then repsond with 204

## Schema

The client is setup to handle the following schemas.

### User

User object is declared with the following type:

```ts
type User = {
  name: string,
  email: string,
  avatar: string // url to profile picture image from google profile payload
}
```

### Todo

Todo object is declared with the following type:

```ts
type Todo = {
  id: string,
  done: boolean,
  text: string
}
```

## Authentication

Authentication in this app will be stateless. That means you shouldn't use any session inside the express server. Instead we will be using JWTs that are saved as cookies in the client to prevent Cross-site scripting attacks (XSS). Additionally, we will be using **Sign in with Google** to authenticate users instead of passwords. To learn more on how to setup Google OAuth application, check out [this guide](./GoogleOAuth.md).

Once you have google app credentials, make sure to add them to the .env file in the root of your project.

```env
GAPP_CLIENT_ID=PUT_YOUR_GOOGLE_CLIENT_ID
GAPP_CLIENT_SECRET=PUT_YOUR_GOOGLE_CLIENT_SECRET
```

### Flow

When Sign in with Google button is clicked in the client, the user will be redirected to your server's `/api/auth/google` which in turn, holding the credentials for the google app, redirects to Google's authorization page. You should ask for the scopes `profile email openid`.

Once the user consent sharing their profile with your app, google will redirect the user to the supplied redirect endpoint. Your server needs to listen to the redirect endpoint in order to receive the credentials from google.

> 💡 TIP: You can use [`passport`](https://www.npmjs.com/package/passport) with any [google oauth](http://www.passportjs.org/packages/passport-google-oauth20) strategy to implement the sign in with google function.

When google user profile is shared with your app, you need to check if that user is a new or returning user by checking your database. If new, you need to create a new user in the database.

Once you have a new user, your redirect endpoint should generate a JSON Web token (JWT) that holds the user details. This JWT needs to be sent as cookie to the client. And it should expire in 14 days. Then redirect again to `/` to open the Todos app.

JWT Should have the following claims:

- `name`: full name of the user
- `email`: user's email supplied by google
- `providerId`: a string that matches `google-${GOOGLE_USER_ID}`
- `exp`: expiration of the token, 14 days from issue
- `iat`: Issued at date, date the token was issued
- `avatar`: user's profile picture url supplied by google

Note that `iat` - `exp` should equal 14 days (1209600 seconds)

> 📍 INFO: Traditionally, JWTs were saved in the browsers `localStorage`, and sent in the `Authorization` header. However, recent trends prefer the JWTs to be saved in a `httpOnly` cookies to prevent XSS Attacks. Read more [here](https://stormpath.com/blog/token-auth-spa) and [here](https://supertokens.io/blog/are-you-using-jwts-for-user-sessions-in-the-correct-way).

For security reasons, it is preferred to *encrypt* and *sign* your JWT cookie. That's because it won't be used as JWT in the client, it will only be transferred to your server with future requests as a cookie. Thus, only your server should know how to create it and read it. To decrypt and parse signed cookies, the following libraries can be used: [`cookie-parser`](https://www.npmjs.com/package/cookie-parser) and [`encrypt-cookie`](https://www.npmjs.com/package/encrypt-cookie).

The app is already bundled with an app secret inside `process.env.SECRET_KEY` that can be used to sign and encrypt your cookies.

> ⚠️ WARNING: If you change the app secret, make sure you change it inside the .env file too because it will be used for the tests as well.

To authenticate future requests, another library can be used to read, and validate the JWT in the cookies. Some suggestions are [`passport-jwt-cookiecombo`](http://www.passportjs.org/packages/passport-jwt-cookiecombo/), [`express-jwt`](https://www.npmjs.com/package/express-jwt), and [`passport-jwt`](http://www.passportjs.org/packages/passport-jwt/).

The user can be logged out by clearing the authentication cookie, thus deleting it from the client.

## Tests

To successfully pass this lab, the tests will check the following:

### Auth endpoints

- `GET /api/auth/google` redirects correctly to google authorization page
  - The request params contains valid `redirect_uri`, `scope`, and `client_id`
- `GET REDIRECT_URI` with incorrect credentials redirects to `/` without cookie
- `GET REDIRECT_URI` with correct credentials redirects to `/` with cookie holding a valid JWT as described above.
- `GET /api/auth/me` Sends a JSON response that have the user schema above when user is logged in
- `GET /api/auth/me` Responds with 401 when the user isn't signed in (no auth cookie)
- `GET /api/auth/logout` clears the auth cookie and responds with 200

### Todos endpoints

All endpoints should respond with 401 when user isn't signed in (no auth cookie)

When user is signed in:

- GET, POST endpoints should get all todos, and create a new Todo respectively
- PUT, DELETE endpoints should update and delete one Todo respectively, **only** if it belong to the logged in user. Otherwise respond with 401

## Working with Docker

This project already contains all docker configurations. You work can all be inside `./server` directory.

To start the server, you can run `yarn run setup` then `yarn start` in the root directory. It will create and run all the required containers for your server and client. Then you can navigate to `http:localhost:3000` to start using the app.

### Installing packages

To install packages for the express server, simply cd into `./server` then `yarn add PACKAGE_NAME`. It will get installed inside the running container as well.

### Scripts

- `yarn run start`: Runs docker-compose with built client package.
- `yarn run dev`: Runs docker-compose with development client library
- `yarn run build`: Builds docker images then runs the containers
- `yarn run build:dev`: Builds docker images then runs the containers with react dev server
- `yarn run stop`: Stops the running containers
- `yarn run down`: Stops and removes running containers
- `yarn run prune`: Stops and removes running containers and their asscociated data and columes
- `yarn run build:client`: Builds client react app, and deploys it to nginx
- `yarn run test`: Runs auto grading tests agains the api server
- `yarn run setup`: Installs node_modules for server and client
