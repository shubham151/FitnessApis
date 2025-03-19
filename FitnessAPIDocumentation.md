# Fitness API Documentation

This API manages basic functions along with user favorites, saves, ratings, and supports full authentication. The API uses JWT-based authentication and soft-deletes records by marking their status (`rec_status`). Exercises can be created, updated, deleted, reactivated, and searched based on multiple criteria.

> **Note:** All endpoints under `/exercises` require a valid access token in the `Authorization` header (format: `Bearer <token>`).

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
    - [Register](#register)
    - [Login](#login)
    - [Refresh Token](#refresh-token)

2. [Exercise Endpoints](#exercise-endpoints)
    - [Create Exercise](#create-exercise)
    - [Reactivate Exercise](#reactivate-exercise)
    - [Get All Public Exercises](#get-all-public-exercises)
    - [Get Exercise by ID](#get-exercise-by-id)
    - [Update Exercise](#update-exercise)
    - [Delete Exercise](#delete-exercise)
    - [Search Exercises](#search-exercises)
    - [Favorite/Unfavorite Exercise](#favorite-unfavorite-exercise)
    - [Save/Unsave Exercise](#save-unsave-exercise)
    - [Rate Exercise](#rate-exercise)
    - [Get Favorites & Saves List](#get-favorites--saves-list)
    - [Get Users Who Favorited/Saved](#get-users-who-favoritedsaved)

---

## Authentication Endpoints

### Register

**Endpoint:**  
`POST /auth/register`

**Description:**  
Registers a new user. If a user with the same username exists and is deactivated (`rec_status` = 'D'), the account is automatically reactivated.

**Request Body:**

```json
{
  "username": "testuser1",
  "password": "testpassword1"
}
```
**Response (Success) Body:**

**Status: 201 Created (or 200 OK if reactivated)**
```json

{
  "rec_id": "UUID-string",
  "username": "testuser1"
}
```


### Login
**Endpoint:**  
`POST /auth/login`

**Description:**  
Authenticates a user and returns an access token (valid for 15 minutes) and a refresh token (valid for 7 days).

**Request Body:**

```json
{
  "username": "testuser1",
  "password": "testpassword1"
}

```
**Response (Success) Body:**

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

### Refresh Token
**Endpoint:**  
`POST /auth/refresh`

**Description:**  
Provides a new access token using a valid refresh token.

**Request Body:**

```json
{
  "token": "jwt-refresh-token"
}


```
**Response (Success) Body:**

```json
{
  "accessToken": "new-jwt-access-token"
}
```

## Exercise Endpoints

### Create Exercise
**Endpoint:**  
`POST /exercise`

**Description:**  
Creates a new exercise. The endpoint validates the following fields:

- **name:** Required (non-empty).
- **description:** Required (non-empty).
- **difficulty:** Required.
- **isPublic:** Optional (defaults to false).


**Request Body:**

```json
{
  "name": "Pushups",
  "description": "Do 20 pushups",
  "difficulty": 1,
  "isPublic": true
}
```

**Response (Success) Body:**
**Status: 201 Created**
```json
{
  "rec_id": "UUID-string",
  "name": "Pushups",
  "description": "Do 20 pushups",
  "difficulty": 1,
  "is_public": true,
  "created_by": "user-UUID"
}
```

### Create Exercise - Missing Name
**Endpoint:**  
`POST /exercise`

**Description:**  
Creates a new exercise with missing name

**Request Body:**

```json
{
  "description": "No name provided",
  "difficulty": 1,
  "isPublic": true
}

```

**Response Body:**
**Status: 400 Bad request**
```json
{
    "message": "Name is required"
}
```


### Create Exercise - Missing Description
**Endpoint:**  
`POST /exercise`

**Description:**  
Creates a new exercise with missing description

**Request Body:**

```json
{
  "name": "Situps",
  "difficulty": 1,
  "isPublic": true
}
```

**Response Body:**
**Status: 400 Bad request**
```json
{
    "message": "Description is required"
}
```

### Create Exercise - Missing Difficulty
**Endpoint:**  
`POST /exercise`

**Description:**  
Creates a new exercise with missing difficulty

**Request Body:**

```json
{
  "name": "Situps",
  "description": "No difficulty provided",
  "isPublic": true
}
```

**Response Body:**
**Status: 400 Bad request**
```json
{
    "message": "Difficulty is required"
}
```

### Reactivate Exercise

**Endpoint:**  
`POST /exercises/:exerciseId/reactivate`

**Description:**  
Reactivates an exercise that has been disabled (rec_status = 'D'). Only the owner can reactivate

**Example Request URL:**
`POST /exercises/123e4567-e89b-12d3-a456-426614174000/reactivate`

**Response (Success) Body:**
**Status: 201 Created**
```json
{
  "message": "Exercise reactivated",
  "exercise": {
    "rec_id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Exercise Name",
    "description": "Description",
    "difficulty": 1,
    "is_public": true,
    "created_by": "user-UUID"
  }
}

```


### Get All Public Exercises

**Endpoint:**  
`GET /exercises`

**Description:**  
Reactivates an exercise that has been disabled (rec_status = 'D'). Only the owner can reactivate

**Response (Success) Body:**
**Status: 201 Created**
```json
[
  {
    "rec_id": "UUID-string",
    "name": "Pushups",
    "description": "Do 20 pushups",
    "difficulty": 1,
    "is_public": true,
    "favorite_count": 2,
    "save_count": 1,
    "created_by": "user-UUID"
  }
]

```

### Get Exercise by ID

**Endpoint:**  
`GET /exercises/:exerciseId`

**Description:**  
Retrieves a single exercise by its ID. Accessible if the exercise is public or if the logged-in user is the creator. Returns favorite and save counts.

**Response (Success) Body:**
```json
{
  "rec_id": "UUID-string",
  "name": "Pushups",
  "description": "Do 20 pushups",
  "difficulty": 1,
  "is_public": true,
  "created_by": "user-UUID",
  "favorite_count": 2,
  "save_count": 1
}

```


### Update Exercise

**Endpoint:**  
`PATCH /exercises/:exerciseId`

**Description:**  
Updates an existing exercise. Only the creator can update an exercise.

**Request Body:**

```json
{
  "name": "Updated Exercise Name",
  "description": "Updated Description",
  "difficulty": 2,
  "isPublic": false
}

```

**Response (Success) Body:**
```json
{
  "rec_id": "UUID-string",
  "name": "Updated Exercise Name",
  "description": "Updated Description",
  "difficulty": 2,
  "is_public": false
}
```

### Delete Exercise

**Endpoint:**  
`DELETE /exercises/:exerciseId`

**Description:**  
Soft-deletes an exercise by setting `rec_status to 'D'`. Only the creator can delete.


**Response (Success) Body:**
```json
{
  "message": "Exercise deleted"
}

```



### Search Exercises

**Endpoint:**  
`GET /exercises/search`

**Description:**  
Searches for exercises based on query parameters. Returns active exercises that are public or created by the logged-in user.

**Query Parameters:**

- **name:** Case-insensitive search on the exercise name.
- **description:** Case-insensitive search on the description.
- **difficulty:** Filters by difficulty.


**Example URL:**
`GET /exercises/search?name=Push&difficulty=1`

**Response (Success) Body:**
```json
[
  {
    "rec_id": "UUID-string",
    "name": "Pushups",
    "description": "Do 20 pushups",
    "difficulty": 1,
    "is_public": true,
    "created_by": "user-UUID"
  }
]
```



### Favorite Exercise

**Endpoint:**  
`POST /exercises/:exerciseId/favorite`

**Description:**  
Marks an exercise as favorited by the logged-in user.

**Response (Success) Body:**
```json
{
  "message": "Favorited"
}
```

### Unfavorite Exercise

**Endpoint:**  
`DELETE /exercises/:exerciseId/favorite`

**Description:**  
Removes the favorite mark from an exercise.

**Response (Success) Body:**
```json
{
  "message": "Unfavorited"
}
```

### Save Exercise

**Endpoint:**  
`POST /exercises/:exerciseId/save`

**Description:**  
Marks an exercise as saved by the logged-in user.

**Response (Success) Body:**
```json
{
  "message": "Saved"
}

```


### Unsave Exercise

**Endpoint:**  
`DELETE /exercises/:exerciseId/save`

**Description:**  
Removes the saved mark from an exercise.

**Response (Success) Body:**
```json
{
  "message": "Unsaved"
}
```

### Rate Exercise

**Endpoint:**  
`POST /exercises/:exerciseId/rate`

**Description:**  
Allows the logged-in user to rate an exercise. If the user has already rated the exercise, their rating is updated.

**Request Body:**

```json 
{
  "rating": 4
}
```


**Response (Success) Body:**
```json
{
  "message": "Rating submitted"
}

```


### Get Favorites & Saves List

**Endpoint:**  
`GET /exercises/favorites-saves`

**Description:**  
Retrieves a combined list of exercises that the logged-in user has favorited or saved. Each item includes a `type` field indicating whether it’s a favorite or save.

**Response (Success) Body:**
```json
[
  {
    "rec_id": "UUID-string",
    "name": "Pushups",
    "description": "Do 20 pushups",
    "type": "favorite"
  },
  {
    "rec_id": "UUID-string",
    "name": "Situps",
    "description": "Do 30 situps",
    "type": "save"
  }
]

```


### Get Users Who Favorited

**Endpoint:**  
`GET /exercises/:exerciseId/users-who-favorited`

**Description:**  
Returns a list of users who have favorited the specified exercise.

**Response (Success) Body:**
```json
[
  {
    "rec_id": "user-UUID",
    "username": "testuser1"
  },
  {
    "rec_id": "user-UUID",
    "username": "testuser2"
  }
]

```


### Get Users Who Favorited/Saved

**Endpoint:**  
`GET /exercises/:exerciseId/users-who-saved`

**Description:**  
Returns a list of users who have saved the specified exercise.

**Response (Success) Body:**
```json
[
  {
    "rec_id": "user-UUID",
    "username": "testuser1"
  },
  {
    "rec_id": "user-UUID",
    "username": "testuser3"
  }
]


```
