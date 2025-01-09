# 🚀 Auth API with Docker and Nginx

[![License](https://img.shields.io/github/license/mariokreitz/auth-api-docker?style=flat-square)](LICENSE)
[![Docker](https://img.shields.io/docker/automated/mariokreitz/auth-api-docker?style=flat-square)](https://hub.docker.com/repository/docker/mariokreitz/auth-api-docker)
[![Node.js](https://img.shields.io/badge/Node.js-v16.x-brightgreen?style=flat-square)](https://nodejs.org/en/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square)](https://www.mongodb.com/cloud/atlas)
[![Version](https://img.shields.io/github/v/release/mariokreitz/auth-api-docker?style=flat-square)](https://github.com/mariokreitz/auth-api-docker/releases)

This project is a **Node.js-based authentication API** deployed using **Docker**, with **Nginx** serving as a reverse proxy. The API uses **MongoDB Atlas** for database storage and includes **JWT-based authentication**, user profile management, and secure email communication. 🔐

## 🛠 Features

- **User Authentication** (JWT) 🔑
- **Email Verification** 📧
- **Password Reset** 🔄
- **User Profile Management** 🧑‍💼
- **Admin Role Management** 👨‍💻
- **Secure Communication via HTTPS** 🌐

## 📝 Prerequisites

Before getting started, make sure you have the following:

- **Docker** 🐳 installed on your machine
- **Docker Compose** to manage multi-container setups 🛠
- A **domain** (for production use) 🌍
- **SSL certificates** for HTTPS (using Let's Encrypt) 🔒
- A **MongoDB Atlas** account for hosting the database 🌱

## 🚀 Project Setup

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/mariokreitz/auth-api-docker.git
cd auth-api-docker
```

### 2. Docker Configuration

The project uses the `compose.yaml` file to define the services and environment variables. The setup includes:

- **Node.js API** (`server` service) 🖥️
- **Nginx reverse proxy** (`nginx` service) 🌐

#### Set Up the Production Data

In the `compose.yaml`, replace the environment variables with your production values:

```yaml
services:
  server:
    build:
      context: .
    environment:
      PORT: 3000
      NODE_ENV: production
      MONGO_URI: mongodb+srv://<your_mongo_uri>
      JWT_SECRET: <your_jwt_secret>
      EMAIL_USER: <your_email_user>
      EMAIL_PASS: <your_email_pass>
    expose:
      - "3000"
    networks:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:latest
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    ports:
      - "443:443"
      - "80:80"
    depends_on:
      - server
    networks:
      - backend
    restart: unless-stopped

networks:
  backend:
    driver: bridge
```

Replace the following placeholders with your real values:
- `<your_mongo_uri>`
- `<your_jwt_secret>`
- `<your_email_user>`
- `<your_email_pass>`

### 3. Copy Nginx Configuration

Copy the `.sample.nginx.conf` file to `nginx.conf` and replace `yourdomain.com` with your actual domain in the configuration:

```bash
cp .sample.nginx.conf nginx.conf
```

Then, in `nginx.conf`, replace:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}
```

With your real domain, for example:

```nginx
server {
    listen 80;
    server_name api.example.com www.api.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}
```

### 4. Building and Running the Containers

To build and start the containers, run the following command:

```bash
docker compose up --build -d
```

This will run both containers in **detached mode**. The `server` container hosts the Node.js API on port `3000`, while the `nginx` container listens on ports `80` (HTTP) and `443` (HTTPS).

### 5. Nginx Configuration

Nginx is set up to:

1. Redirect all HTTP traffic to HTTPS 🔄
2. Act as a reverse proxy for the Node.js API 🖥️

Make sure to replace `yourdomain.com` with your actual domain (e.g., `api.example.com`) in the `nginx.conf` file.

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (mounted from host)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;

    # Reverse proxy for backend API
    location / {
        proxy_pass http://server:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Restart and Recovery

To ensure the containers restart automatically on failure, the `restart` policy is configured to `unless-stopped` in the `compose.yaml` file:

```yaml
services:
  server:
    restart: unless-stopped
  nginx:
    restart: unless-stopped
```

This guarantees that both the API and Nginx containers will automatically restart unless manually stopped.

### 7. Accessing the API

Once the containers are running, you can access the API at:

```
https://api.example.com
```

Test the authentication and other endpoints using tools like **Postman** or **Insomnia** to send requests to the API. 🔑

### 8. Stopping the Containers

To stop the containers, run the following command:

```bash
docker compose down
```

This command will stop and remove the containers, but leave the data volumes intact.

---

## 📑 API Documentation

The full API documentation for this project is available through Postman. You can view the documentation, including detailed information about all available endpoints, request/response formats, and usage examples by clicking the link below:

[**Auth API Documentation**](https://documenter.getpostman.com/view/40182248/2sAYQUqZXM) 📖

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details. 📄
