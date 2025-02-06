# AP Project Exercise 4
#### By Nati Laufer & Azriel Erenkrantz & Elad Houri  
Jira: [Project Jira](https://clickazr-1731359928155.atlassian.net/jira/software/projects/AN/boards/3/timeline) <br>
Wiki: [Wiki](docs/wiki.md)
## **Movie Watch System** 🎬
This project is a **Movie Watch System**, a web-based movie streaming and recommendation platform inspired by services like Netflix. It allows users to:
- **Search for movies** 🔎
- **Receive personalized recommendations** 🎥✨
- **Authenticate and manage user accounts** 🔐
- **Interact with a RESTful API** for seamless data handling 🌐

The system is built using a **microservices architecture** and consists of four core components:
1. **MongoDB (Database)** - Stores user and movie data 🗄️
2. **Recommendation Server** - Generates movie suggestions 🎞️
3. **Web Server** - Handles user authentication and API requests 🚀
4. **React Frontend/Android Frontend** - Provides the user interface 🖥️

The system is containerized using **Docker Compose**, making it easy to deploy and manage all services.

---

## **How to Run the System** 🛠️
The system consists of **four services**:  
1. **MongoDB (Database)**  
2. **Recommendation Server**  
3. **Web Server**  
4. **React/Android Frontend**  

### 📌 **Setup Instructions**  

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
```
#### 2️⃣ **Build the project**  
Once the docker-compose.yml file is updated, simply run:
```bash
docker-compose build
```

#### 3️⃣ **Run the project**  
Once the containers are built, simply run them with this command:
```bash
docker-compose up -d
```

After that, you can browse our web service at the URL **http://localhost:<REACT_PORT>**.  
For the Android studio, change inside app/src/main/java/com/example/netflix_android/Constants.java to youe port number, and then run with the Emulator 
---

### **Additional Notes** 📌
- **Communication Protocol:** The system uses a client-server model with the HTTP protocol over a TCP connection to handle communication. The client sends commands to the server, which processes the requests and sends appropriate responses. This design ensures reliable and efficient data transfer between the client and server.
- **Error Handling:** The system handles cases where the command is unrecognized or not possible, returning a status code of `400` or `404` along with a JSON explanation. This ensures that the user is informed of the error and can take appropriate action.
- **SOLID Principles:** The code follows **SOLID** principles, ensuring modularity and maintainability. This makes the system flexible and scalable for future updates.
- **Documentation and Task Management on JIRA:** All documentation, stand-up meeting summaries, and task distribution have been managed on **JIRA**. This platform has been used to track progress, assign tasks, and document key decisions throughout development.

🚀 **Enjoy watching movies with our system!** 🎬

