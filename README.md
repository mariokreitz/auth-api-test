# Auth API with Docker and Nginx

This project is a **Node.js-based authentication API** deployed using **Docker**, with **Nginx** serving as a reverse proxy. The API uses **MongoDB Atlas** for database storage and includes **JWT-based authentication**, user profile management, and secure email communication.

## Features

- **User Authentication** (JWT)
- **Email Verification**
- **Password Reset**
- **User Profile Management**
- **Admin Role Management**
- **Secure Communication via HTTPS**

## Prerequisites

Before getting started, make sure you have the following:

- **Docker** installed on your machine
- **Docker Compose** to manage multi-container setups
- A **domain** (for production use)
- **SSL certificates** for HTTPS (using Let's Encrypt)
- A **MongoDB Atlas** account for hosting the database

## Project Setup

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/mariokreitz/auth-api-docker.git
cd auth-api-docker
```

### 2. Docker Configuration

The project uses the `compose.yaml` file to define the services and environment variables. The setup includes:

- **Node.js API** (`server` service)
- **Nginx reverse proxy** (`nginx` service)

### 3. Building and Running the Containers

To build and start the containers, run the following command:

```bash
docker compose up --build -d
```

This will run both containers in **detached mode**. The `server` container hosts the Node.js API on port `3000`, while the `nginx` container listens on ports `80` (HTTP) and `443` (HTTPS).

### 4. Nginx Configuration

Nginx is set up to:

1. Redirect all HTTP traffic to HTTPS
2. Act as a reverse proxy for the Node.js API

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

### 5. Restart and Recovery

To ensure the containers restart automatically on failure, the `restart` policy is configured to `unless-stopped` in the `compose.yaml` file:

```yaml
services:
  server:
    restart: unless-stopped
  nginx:
    restart: unless-stopped
```

This guarantees that both the API and Nginx containers will automatically restart unless manually stopped.

### 6. Accessing the API

Once the containers are running, you can access the API at:

```
https://api.example.com
```

Test the authentication and other endpoints using tools like **Postman** or **Insomnia** to send requests to the API.

### 7. Stopping the Containers

To stop the containers, run the following command:

```bash
docker compose down
```

This command will stop and remove the containers, but leave the data volumes intact.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
