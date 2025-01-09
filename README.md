# Auth API with Docker and Nginx

This project is a Node.js-based authentication API that is deployed using Docker, with Nginx serving as a reverse proxy. The API uses MongoDB Atlas for database storage and includes JWT-based authentication, user profile management, and secure email communication.

## Features

- **User Authentication** (JWT)
- **Email Verification**
- **Password Reset**
- **User Profile Management**
- **Admin Role Management**
- **Secure Communication via HTTPS**

## Prerequisites

- Docker
- Docker Compose
- A domain (for production use)
- SSL certificates for HTTPS (using Let's Encrypt)
- MongoDB Atlas account for database hosting

## Project Setup

### 1. Clone the repository:

```bash
git clone https://github.com/mariokreitz/auth-api-docker.git
cd auth-api-docker
```

### 2. Environment Configuration

Create a `.env` file based on the `.sample.env` provided in the repository.

```bash
cp .sample.env .env
```

Edit the `.env` file with the following information:

```env
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
EMAIL_USER=<your_email_user>
EMAIL_PASS=<your_email_pass>
```

### 3. Docker Configuration

#### Dockerfile

A `Dockerfile` is provided to build the application in a Node.js container. It installs the necessary dependencies and runs the API.

#### Docker Compose

`docker-compose.yml` is configured to run the app in two containers:

1. **Node.js API** (`server` service)
2. **Nginx reverse proxy** (`nginx` service)

The Nginx container handles SSL termination and proxies requests to the API.

### 4. Building and Running the Containers

To build and run the containers, use the following command:

```bash
docker-compose up --build -d
```

This will start both containers in detached mode. The `server` container runs the Node.js app on port 3000, and the `nginx` container listens on ports 80 (HTTP) and 443 (HTTPS).

### 5. Nginx Configuration

Nginx is configured to redirect all HTTP traffic to HTTPS and act as a reverse proxy for the Node.js API. The configuration file is mounted from the host machine to the container.

In the `nginx.conf` file, make sure to replace `yourdomain.com` with your actual domain, e.g., `api.example.com`.

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

To ensure the containers automatically restart on failure, the `restart` policy is set to `unless-stopped` in the `docker-compose.yml` file:

```yaml
services:
  server:
    restart: unless-stopped
  nginx:
    restart: unless-stopped
```

This ensures that both the API and Nginx containers will restart automatically unless manually stopped.

### 7. Accessing the API

Once the containers are running, you can access the API at `https://api.example.com`.

To test the authentication and other endpoints, use tools like Postman or Insomnia to send requests to the API.

### 8. Stopping the Containers

To stop the containers, use:

```bash
docker-compose down
```

This will stop and remove the containers, but leave the volumes intact.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
