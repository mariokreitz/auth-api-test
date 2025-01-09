Here’s a `SECURITY.md` for your project to outline security practices and provide guidance on maintaining the security of the application:

---

# 🔒 Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark:  |
| 0.x.x   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, we would appreciate it if you would report it to us responsibly. Please do **not** post it publicly.

To report a vulnerability, please email us at:

**Email**: [contact@mariokreitz.com](mailto:contact@mariokreitz.com)

We will respond as soon as possible with a fix or mitigation.

## Security Features

This project employs several key security features to ensure the integrity, confidentiality, and availability of user data:

### 1. Authentication and Authorization

- **JWT-based authentication**: Secure token-based authentication for users.
- **Role-based access control**: Admin and user roles for restricting access to sensitive information and resources.
- **Password hashing**: Uses **bcrypt** to securely hash passwords before storing them in the database.
- **Email verification**: Ensures only verified email addresses can access the system.
  
### 2. Secure Communication

- **HTTPS**: All communication between the client and server is encrypted via HTTPS using SSL/TLS.
- **Nginx Reverse Proxy**: Nginx is configured to ensure encrypted connections (via SSL certificates).

### 3. Sensitive Data Protection

- **Environment Variables**: Sensitive information such as database credentials, JWT secret keys, and email credentials are stored in environment variables (and Docker secrets for production).
- **MongoDB Atlas**: The database is hosted on MongoDB Atlas, which offers robust security features such as IP whitelisting, encryption at rest, and automatic backups.
  
### 4. Security Headers

- **Helmet.js**: The application uses [Helmet.js](https://helmetjs.github.io/) to set various HTTP headers to enhance the security of the API.
- **Content Security Policy (CSP)**: Configured to avoid the injection of malicious scripts and resources into the application.

### 5. Rate Limiting and Brute Force Protection

- **Rate Limiting**: Implements a **rate-limiting** middleware to mitigate brute-force attacks (e.g., limiting login attempts to 3 per IP every 15 minutes).
- **Brute Force Protection**: Specifically applied to routes such as login, password reset, and account registration to minimize the risk of unauthorized access.

### 6. Input Validation

- **Express Validator**: Ensures input data is validated to prevent SQL injection and other malicious input.
  
### 7. Password Reset Flow

- **Secure Token for Password Reset**: A time-limited, securely signed token is used for the password reset process.
- **Limit Reset Requests**: Rate-limited to prevent abuse and unauthorized access.

## Best Practices for Contributing

We take security seriously and encourage everyone to follow these best practices when contributing to the project:

- **Validate all inputs**: Always sanitize user input to prevent malicious attacks such as XSS, SQL injection, etc.
- **Keep dependencies up to date**: Regularly check for updates on the dependencies and update them when vulnerabilities are disclosed.
- **Review security practices**: Ensure that any new features or changes respect the security features outlined in this document.

## Security Tools and Libraries Used

- **JWT (JSON Web Token)**: Secure token-based authentication and authorization.
- **bcrypt**: Strong password hashing algorithm for user credentials.
- **Helmet.js**: Helps secure Express apps by setting various HTTP headers.
- **Nginx**: Used as a reverse proxy with SSL for secure communication.
- **MongoDB Atlas**: Cloud database service with robust security features.
- **express-rate-limit**: Protects against brute-force attacks by limiting the number of requests from a single IP.

---

Let me know if you'd like to add more details or any other specific practices! 😊
