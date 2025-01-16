# AP Project Exercise 4
#### By Nati Laufer & Azriel Erenkrantz & Elad Houri
Jira: https://clickazr-1731359928155.atlassian.net/jira/software/projects/AN/boards/3/timeline

This project introduces a Movie Watch System, a web application that utilizes a RESTful API for managing and exploring movies, similar to platforms like Netflix. Users can interact with the application through the API to search for movies, receive personalized recommendations, authenticate, and manage data. All data is securely stored in a MongoDB database.

## How to Use:
The system consists of two servers: a recommendations server and a web server. 

#### Steps to Run the System ####
1. Ensure MongoDB is running before proceeding. 
2. Start the recommendations server. 
3. Run the web server.

The project includes a `Dockerfile` for containerizing the application.

### Run the recommendations server: ###
Navigate to the root directory of the project and follow these steps:

Build the Docker image:
```bash
docker build -t cpp-project -f Dockerfile.main .
```
Run the Docker container:
```bash
docker run -it --network=host -v ./data:/app/data cpp-project <PORT>

```
Replace PORT with the desired port for the recommendations server to listen to.

### Run the web server: ###
In the instructions below, do the following:
- Replace WEB_PORT with the desired port for the web server to listen to.
- Replace RECO_PORT with the port of the recommendations server.
- Replace DATABASE with the desired name for the MongoDB database.

#### 1. Create a configuration file: ####
Create a file named `.env.local` in `./src/web_server/config` with the following content:
```bash
CONNECTION_STRING=mongodb://host.docker.internal:27017/<DATABASE>
PORT=<WEB_PORT>
RECOMMENDATION_IP=host.docker.internal
RECOMMENDATION_PORT=<RECO_PORT>
```
#### 2. Run the web server ####
Navigate to the root directory of the project and follow these steps:

Build the Docker image:
```bash
docker build -t web-server -f Dockerfile.webServer .
```
Run the Docker container:
```bash
docker run -it -p <WEB_PORT>:<WEB_PORT> web-server

```

---

## The Program:

The program allows users to interact with the system using curl commands to perform various actions. Each command corresponds to a specific HTTP request and returns an appropriate status code. Here is an explanation for every command:

```bash
# Create a New User - 'POST' command  that adds a new user to the MongoDB database.
  curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"email": "example@gmail.com", "phoneNumber": "0512345678", "passWord": "a1a2a3a4", "userName": "example123", "fullName": "example example"}'

# Get User Details by ID - GET command that retrieves user details using the user ID (exept user passWord).
  curl -i http://localhost:3000/api/users/677f2fede163dfe459cfd5a1 -H "user-id: 677f2fede163dfe459cfd5a1"

# Authenticate a User - POST command that checks if the user exists in the database based on the provided username and password.
  curl -i -X POST http://localhost:3000/api/tokens -H "Content-Type: application/json" -d '{"userName": "example123", "passWord": "a1a2a3a4"}'

# Get All Categories - GET command that fetches all available movie categories.
  curl -i http://localhost:3000/api/categories -H "user-id: 677fd11c0331f7936dc42f17"

# Create a New Category - POST command that adds a new movie category to the database.
  curl -i -X POST http://localhost:3000/api/categories -H "user-id: 677fd11c0331f7936dc42f17" -H "Content-Type: application/json" -d '{"name": "Drama", "promoted": true}'

# Get Category by ID - GET command that retrieves category details by its ID.
  curl -i http://localhost:3000/api/categories/377f3cbbc2e2dha788d33f43 -H "user-id: 677fd11c0331f7936dc42f17"

# Update Category by ID - PATCH command that updates a movie category using its ID.
  curl -i -X PATCH http://localhost:3000/api/categories/377f3cbbc2e2dha788d33f43 -H "user-id: 677fd11c0331f7936dc42f17" -H "Content-Type: application/json" -d '{"name": "Action & Adventure"}' 

# Delete Category by ID - DELETE command that removes a movie category by its ID.
  curl -i -X DELETE http://localhost:3000/api/categories/377f3cbbc2e2dha788d33f43 -H "user-id: 677fd11c0331f7936dc42f17"

# Get Movies by Categories - GET command that retrieves a list of movies based on categories.
  curl -i http://localhost:3000/api/movies -H "user-id: 677fd11c0331f7936dc42f17"

# Create a New Movie - POST command that adds a new movie to the MongoDB database.
  curl -i -X POST http://localhost:3000/api/movies -H "user-id: 677fd11c0331f7936dc42f17" -H "Content-Type: application/json" -d '{"name": "Inception", "description": "A mind-bending thriller", "picture": "inception.jpg","categories": ["6781ef89a01dd51895fd0bb91"]}'
  
# Get Movie Details by ID - GET command that fetches movie details using the movie ID.
  curl -i http://localhost:3000/api/movies/377f3cbbc2e2dha788d33f43 -H "user-id: 677fd11c0331f7936dc42f17"

# Replace Movie by ID - PUT command that updates an existing movie using its ID.
  curl -i -X PUT http://localhost:3000/api/movies/377f3cbbc2e2dha788d33f43 -H "user-id: 677fd11c0331f7936dc42f17" -H "Content-Type: application/json" -d '{"name": "Titanic", "description": "good movie"}'

# Delete Movie by ID - DELETE command that removes a movie from the database by its ID.
  curl -i -X DELETE http://localhost:3000/api/movies/377f3cbbc2e2dha788d33f43 -H "user-id: 677fd11c0331f7936dc42f17"

# Get Recommended Movies for a User - GET command that retrieves recommended movies for a specific user and movie.
  curl -i http://localhost:3000/api/movies/377f3cbbc2e2dha788d33f43/recommend -H "user-id: 677fd11c0331f7936dc42f17"

# Mark a Movie as Watched - POST command that marks a movie as watched for the current user.
  curl -i -X POST http://localhost:3000/api/movies/377f3cbbc2e2dha788d33f43/recommend -H "user-id: 677fd11c0331f7936dc42f17"

# Search Movies by Query - GET command that searches movies based on a query string.
  curl -i http://localhost:3000/api/movies/search/:query/ -H "user-id: 677fd11c0331f7936dc42f17"
```


## Run Examples:
![Screenshot at 2025-01-11 17-09-29](https://github.com/user-attachments/assets/b9771c0c-3519-4d85-b38b-1d1bc3ef94c6)

---
![Screenshot at 2025-01-11 17-10-02](https://github.com/user-attachments/assets/d5207ee2-42c5-41fe-b09e-dd39a550bafc)

---
![Screenshot at 2025-01-11 17-49-38](https://github.com/user-attachments/assets/35fb72e6-e65b-477e-b5ad-58bf74adfa45)

 ---
![Screenshot at 2025-01-11 20-57-08](https://github.com/user-attachments/assets/2001e8f7-d8a0-4bf6-8adf-57caac14e17d)

 ---
![Screenshot at 2025-01-11 20-58-35](https://github.com/user-attachments/assets/d656cd74-aaab-4a3b-a096-089ab13b9d4b)

 ---
![Screenshot at 2025-01-11 21-03-47](https://github.com/user-attachments/assets/107b2941-dd6d-4b8b-9d65-1e40ad11a4be)

 ---
![Screenshot at 2025-01-11 21-04-04](https://github.com/user-attachments/assets/242ddf9d-dbac-4e1a-b4a5-6cd63eba6c5e)

 ---
 
![Screenshot at 2025-01-11 21-35-18](https://github.com/user-attachments/assets/3975f959-1741-4fc1-94a4-a47a9ba3ecef)

---

![Screenshot at 2025-01-11 21-36-20](https://github.com/user-attachments/assets/b932202d-f3ec-4932-894d-3e54f9b3e816)

---
![Screenshot at 2025-01-11 22-12-44](https://github.com/user-attachments/assets/85af5319-1faf-4eca-8370-7a7ec6be0fa1)

---

![Screenshot at 2025-01-11 22-12-51](https://github.com/user-attachments/assets/32316a34-8e7f-4cfb-86da-6e2131fa1692)

---

![Screenshot at 2025-01-11 22-40-15](https://github.com/user-attachments/assets/7aa94443-0a4c-4d27-a8ae-d6c5282f5255)

---
![Screenshot at 2025-01-11 22-51-05](https://github.com/user-attachments/assets/d19227b8-5d17-4ae7-81e5-60905efd39dd)

---
![Screenshot at 2025-01-11 22-53-25](https://github.com/user-attachments/assets/a9503dd1-a3d6-4e84-9ee9-565f8c747806)

---
![Screenshot at 2025-01-11 23-10-39](https://github.com/user-attachments/assets/b3e70d46-f4d1-48e0-bee0-1f985d69ff01)

---
![Screenshot at 2025-01-11 23-20-06](https://github.com/user-attachments/assets/903ead68-4922-4eac-a2f7-600fa17a3542)

---
![terminal-recommend](https://github.com/user-attachments/assets/2c6f60bc-98ad-4c33-9fa1-f05faad4b85a)

---

   
### Notes:
* **Communication Protocol:** The system uses a client-server model with the HTTP protocol over a TCP connection to handle communication. The client sends commands to the server, which processes the requests and sends appropriate responses. This design ensures reliable and efficient data transfer between the client and server.
* **Unrecognized/Not Possible Commands:** The system handles cases where the command is unrecognized or not possible, returning a status code of 400 or 404 along with a JSON explanation. This ensures that the user is informed of the error and can take appropriate action.
* **SOLID Principles:** In this code, we adhered to the SOLID principles, focusing on writing modular and maintainable code. This approach ensures that the system is both flexible and scalable, allowing for easy modification and extension in the future.
* **Documentation and Task Management on JIRA:** All content documentation, stand-up meeting summaries, and task distribution have been managed on JIRA. This platform has been used to track progress, assign tasks, and document important decisions and updates throughout the development process.
