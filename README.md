# AP Project Exercise 4
#### By Nati Laufer & Azriel Erenkrantz & Elad Houri  
Jira: [Project Jira](https://clickazr-1731359928155.atlassian.net/jira/software/projects/AN/boards/3/timeline)

This project introduces a **Movie Watch System**, a web application similar to platforms like Netflix. It allows users to search for movies, receive personalized recommendations, authenticate, and manage data via a **RESTful API**. Data is stored in a **MongoDB** database.

## How to Run the System  

The system consists of **four services**:  
1. **MongoDB (Database)**  
2. **Recommendation Server**  
3. **Web Server**  
4. **React Frontend**  

### 📌 Setup Instructions  

#### 1️⃣ **Update the `docker-compose.yml` file**  
Modify the following values in `docker-compose.yml` (lines with comments) to configure your environment:  

```yaml
services:
  mongo:
    ports:
      - "27017:27017"  # <mongo_port: mongo_port>

  recommendation-server:
    ports:
      - "8000:8000"  # "<RECO_PORT>:<RECO_PORT>"
    command: ["8000"]  # "<RECO_PORT>"

  web-server:
    ports:
      - "7000:7000"  # "<WEB_PORT>:<WEB_PORT>"
    environment:
      CONNECTION_STRING: mongodb://mongo:27017/config  # mongodb://mongo:27017/<DATABASE>
      PORT: 7000  # <WEB_PORT>
      RECOMMENDATION_PORT: 8000  # <RECO_PORT>
      REACT_PORT: 3100  # <REACT_PORT>

  react-app:
    args:
      REACT_APP_WEB_PORT: 7000  # <WEB_PORT>
      REACT_APP_REACT_PORT: 3100 # <REACT_PORT>
    ports:
      - "3100:3100"  # "<REACT_PORT>:<REACT_PORT>"
    environment:
      REACT_APP_WEB_PORT: 7000  # <WEB_PORT>

#### 2. Run the project ####
Once the docker-compose.yml file is updated, simply run:
```bash
docker-compose up --build
```


   
### Notes:
* **Communication Protocol:** The system uses a client-server model with the HTTP protocol over a TCP connection to handle communication. The client sends commands to the server, which processes the requests and sends appropriate responses. This design ensures reliable and efficient data transfer between the client and server.
* **Unrecognized/Not Possible Commands:** The system handles cases where the command is unrecognized or not possible, returning a status code of 400 or 404 along with a JSON explanation. This ensures that the user is informed of the error and can take appropriate action.
* **SOLID Principles:** In this code, we adhered to the SOLID principles, focusing on writing modular and maintainable code. This approach ensures that the system is both flexible and scalable, allowing for easy modification and extension in the future.
* **Documentation and Task Management on JIRA:** All content documentation, stand-up meeting summaries, and task distribution have been managed on JIRA. This platform has been used to track progress, assign tasks, and document important decisions and updates throughout the development process.
