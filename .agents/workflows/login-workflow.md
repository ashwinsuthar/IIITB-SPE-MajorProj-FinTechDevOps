---
description: How to run Java microservices and understand the Login workflow within the UI.
---
# Running Java Microservices

Currently, the Java microservices (like `user-service`, `api-gateway`) are structurally scaffolded but require you to create specific `application.yml` files containing your database and Kafka credentials to start properly without application exceptions. 

To run a specific service for local testing:
1. Navigate to the specific service folder, e.g., `cd user-service`
2. Start the service using the Maven wrapper: `./mvnw spring-boot:run`

If you are setting up the **API Gateway** as the single entry point for all UI traffic, you would typically run them in this order:
1. `eureka-server` (Default: Port 8761)
2. `config-server` (Default: Port 8888)
3. `api-gateway` (Default: Port 8080)
4. `user-service` (Default: Port 8081)

# Full Login Workflow (URL & Architecture Flow)

Since the frontend currently renders a live dashboard directly, a complete authentication implementation requires integrating the following workflow:

1. **User Request**: The user visits `http://localhost:5173/login` on the React Frontend.
2. **Frontend Submission**: Standard credentials (Username/Password) are entered. The React UI uses Axios to send a `POST` request to the API Gateway: `http://localhost:8080/api/auth/login`.
3. **Gateway Routing**: The **API Gateway** intercepts the request and routes it dynamically via Eureka Service Discovery to the **User Service**.
4. **Authentication Layer**: The **User Service** looks up the user inside PostgreSQL via Spring Data JPA. If the credentials are valid, it generates an encrypted **JWT (JSON Web Token)** using the secret stored securely in HashiCorp Vault.
5. **Frontend Storage**: The **User Service** responds with the JWT token. The React Frontend receives the token and stores it securely in the Redux store (and/or `localStorage`).
6. **UI Redirection**: The user is immediately redirected to the main dashboard: `http://localhost:5173/dashboard`.
7. **Secure API Calling**: When the user takes a secured action (like clicking "Buy Stock"), React sends a `POST` to `http://localhost:8080/api/orders/buy` attaching the token in the headers as `Authorization: Bearer <JWT>`. The Gateway drops invalid tokens, or routes valid ones to the **Order Execution Service**.
