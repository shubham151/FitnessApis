# Fitness API Test Cases

This repository includes a comprehensive Postman collection for testing the Fitness API endpoints. The collection covers:

- **Authentication Endpoints:**  
  - Register (6 users)  
  - Login (multiple users)  
  - Refresh Token

- **Exercise Endpoints:**  
  - Create Exercise (with various test cases: valid, missing name, missing description, missing difficulty, and without authentication)  
  - Reactivate Exercise  
  - Get All Public Exercises  
  - Get Exercise by ID  
  - Update Exercise  
  - Delete Exercise  
  - Search Exercises (by name, description, difficulty, and combinations)
  - Favorite/Unfavorite Exercise  
  - Save/Unsave Exercise  
  - Rate Exercise  
  - Get Favorites & Saves List  
  - Get Users Who Favorited  
  - Get Users Who Saved

---

## Table of Contents

1. [Importing the Postman Collection](#importing-the-postman-collection)
2. [Configuring the Environment](#configuring-the-environment)
3. [Overview of Test Cases](#overview-of-test-cases)
   - [Authentication Test Cases](#authentication-test-cases)
   - [Exercise Test Cases](#exercise-test-cases)
   - [Search Test Cases](#search-test-cases)
   - [Bonus Endpoint Test Cases](#bonus-endpoint-test-cases)
4. [Running the Test Cases](#running-the-test-cases)
5. [Additional Notes](#additional-notes)

---

## Importing the Postman Collection

1. **Download the Collection JSON:**
   - Locate the provided JSON file (e.g., `FitnessAPIs/test/postmanTestCases.json`).
   - Download this file.

2. **Open Postman:**
   - Launch Postman and click on the **Import** button in the top-left corner.
   - In the Import modal, select **Upload Files**, then drag and drop the JSON file or click **Select Files** to browse for it.
   - Click **Import**. You should see a new collection named "Fitness APIs Comprehensive Test" in your sidebar.

---

## Configuring the Environment

1. **Create a New Environment:**
   - Click the gear icon (Manage Environments) in the top-right corner of Postman.
   - Click **Add** and name your environment (e.g., "Fitness API Environment").

2. **Set the Following Variables:**
   - `base_url`: `http://localhost:4000` (or your API server URL)
   - `access_token`: Leave blank (will be set automatically after a successful login)
   - `refresh_token`: Leave blank (will be set automatically after a successful login)
   - `exerciseId`: Leave blank (will be set automatically after creating an exercise)

3. **Select Your Environment:**
   - In the top-right dropdown, select the newly created environment.

---

## Overview of Test Cases

### Authentication Test Cases

- **Register Users (1-6):**  
  Tests registration for multiple users. If a username already exists, the API either rejects registration or reactivates a disabled account.

- **Login:**  
  Logs in a user (e.g., testuser1) and automatically sets the `access_token` and `refresh_token` in the environment using test scripts.

- **Refresh Token:**  
  Uses the stored refresh token to obtain a new access token.

### Exercise Test Cases

- **Create Exercise:**  
  - *Valid Request:* All required fields are provided.  
  - *Missing Name:* Returns an error `"Name is required"`.  
  - *Missing Description:* Returns an error `"Description is required"`.  
  - *Missing Difficulty:* Returns an error `"Difficulty is required"`.  
  - *Without Authentication:* Should return a 401 Unauthorized error.

- **Reactivate Exercise:**  
  Reactivates a soft-deleted exercise (with `rec_status` = 'D'). Only available to the creator.

- **Get All Public Exercises:**  
  Returns a list of active exercises (public or created by the user) with favorite and save counts.

- **Get Exercise By ID:**  
  Returns the details of a specific exercise if it’s public or owned by the user.

- **Update Exercise:**  
  Updates an existing exercise (creator-only).

- **Delete Exercise:**  
  Soft-deletes an exercise by updating its status to 'D'.

### Search Test Cases

- **Search by Name Only:**  
  e.g., `GET /exercises/search?name=Push`

- **Search by Description Only:**  
  e.g., `GET /exercises/search?description=pushups`

- **Search by Difficulty Only:**  
  e.g., `GET /exercises/search?difficulty=1`

- **Search by Name and Difficulty:**  
  e.g., `GET /exercises/search?name=Push&difficulty=1`

- **Search by Name, Description, and Difficulty:**  
  e.g., `GET /exercises/search?name=Push&description=pushups&difficulty=1`


- **Favorite/Unfavorite Exercise:**  
  Toggle favorite status.

- **Save/Unsave Exercise:**  
  Toggle saved status.

- **Rate Exercise:**  
  Submit or update a rating for an exercise.

- **Get Favorites & Saves List:**  
  Retrieve a combined list of favorited and saved exercises.

- **Get Users Who Favorited/Saved:**  
  Get lists of users who favorited or saved a specific exercise.

---

## Running the Test Cases

1. **Authentication:**
   - Run the registration requests under the **Auth** folder to create the six test users.
   - Execute a login request (e.g., Login User1).  
     - Open the Postman Console (View > Show Postman Console) to verify that tokens are logged.
     - Check that the environment variables `access_token` and `refresh_token` are set.

2. **Exercise Operations:**
   - **Create Exercise:**  
     Run the “Create Exercise” tests:
     - *Valid:* Should create an exercise and set the `exerciseId` variable.
     - *Missing Name / Description / Difficulty:* Should return 400 errors with the appropriate message.
     - *Without Auth:* Should return a 401 Unauthorized error.
   - **Reactivate Exercise:**  
     After soft-deleting an exercise, use the Reactivate Exercise endpoint to re-enable it.
   - **Get, Update, Delete:**  
     Test retrieval by ID, update, and deletion of the exercise using the `exerciseId`.
   - **Search:**  
     Run the search test cases with various query parameters to verify correct filtering.

   - Execute favorite, unfavorite, save, unsave, and rate requests.
   - Verify the combined favorites & saves list and the user lists for favorited/saved exercises.

---

## Additional Notes

- **Postman Console:**  
  Use the console to view `console.log` outputs from test scripts.

- **Environment Quick Look:**  
  Click the eye icon in the top-right to verify that variables are correctly set.

- **Variable Updates:**  
  The `exerciseId` variable is updated automatically after a successful exercise creation. Ensure you use the correct value for subsequent requests.

- **Error Handling:**  
  Negative test cases should return appropriate error responses (e.g., 400, 401, 403, 404).

