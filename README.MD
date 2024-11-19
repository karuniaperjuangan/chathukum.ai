<div align="center">
<h1>
ChatHukum.ai
</h1>
</div>
ChatHukum.ai is an AI-based platform where you can ask about the contents of all laws and regulations in Indonesia. ChatHukum.ai is directly connected to 250,000+ legal documents. ChatHukum.ai is able to answer questions quickly and accurately using LLM technology.

## Tech Stack

<div syle="display: flex; justify-content: space-around;">
<img src="https://insightface.ai/assets/img/custom/logo3.jpg" alt="Insightface" style="height: 50px;"/>
          <img
            src="https://images.credly.com/images/1c2c86e1-16ce-4e4d-a425-d1ac96bb026d/express.png"
            style="height: 50px;"
          />
          <img
            src="https://avatars.githubusercontent.com/u/108468352?v=4"
            style="height: 50px;"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/993px-Postgresql_elephant.svg.png"
            style="height: 50px;"
          />
          <img
            src="https://miro.medium.com/v2/resize:fit:622/1*MVJZLfszGGNiJ-UFK4U31A.png"
            style="height: 50px;"
          />
          <img
            src="https://logos-world.net/wp-content/uploads/2024/08/OpenAI-Logo.png"
            style="height: 50px;"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/862px-React-icon.svg.png"
            style="height: 50px;"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1280px-Tailwind_CSS_Logo.svg.png"
            style="height: 50px;"
          />
</div>

## Screenshot

<div style="display: flex; justify-content: space-around;">

![Example 1](frontend/src/assets/guides/0.dashboard.png)

![Example 2](frontend/src/assets/guides/1.login.png)

![Example 3](frontend/src/assets/guides/2.add_document.png)

![Example 4](frontend/src/assets/guides/3.chat.png)

![Example 5](frontend/src/assets/guides/4.history.png)

</div>

## Setup Instructions

### Prerequisites

- Docker
- Docker Compose

### Cloning the Repository

```bash
git clone https://github.com/karuniaperjuangan/guesswho-webapp.git
cd guesswho-webapp
```

### Running the Application


1. Download the database from [This Link](https://drive.google.com/file/d/1C7zcIxtDTF48N-5D_u2oTxllwEZ_LU31/view?usp=sharing) and put it to `./vector-database` directory

2. Navigate to the project directory:

    ```bash
    cd guesswho-webapp
    ```
2. Create `.env` in 'frontend' folder and 'backend'. By default, you can just copy `.env.example` file to `.env

    ```bash
    cp frontend/.env.example frontend/.env
    cp backend/.env.example backend/.env
    ```

3. Build and start the containers:

    ```bash
    docker-compose --profile prod up --build 
    ```

4. Access the application:
    - Frontend: `http://localhost`
    - Backend: `http://localhost:6789`
