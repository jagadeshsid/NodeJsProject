
# NodeJS application
## Description
This is a basic NodeJS applicatin with CRUD functionality. There is a go background job which runs every 10 seconds and logs the total number of users in mongodb to console.
## Prerequisites:
Before you begin, ensure you have met the following requirements:

    1. Docker and Docker Compose installed (for containerization and local development)
    2. Kubernetes and kubectl installed (for deployment in Kubernetes)
    3. Minikube or Docker Desktop (for local Kubernetes testing)
    4. Node.js and NPM installed (for Node.js API development)


## Installation & Running Locally:

### Clone the Repository
    git clone [your-repo-link]
    cd project-root

### Running with Docker Compose
To run the application with Docker Compose:

    docker-compose up

This will start the Node.js API, Go background worker, MongoDB, and Redis services.

### Running on Kubernetes:

To deploy to a local Kubernetes cluster:

Start Minikube or Docker Desktop's Kubernetes.
Apply the Kubernetes manifests:

        kubectl apply -f k8s/  
         
## Application Components

### Node.js API (user-api/)
Purpose: Handles CRUD operations for user data.

Libraries Used:

    express: Web server framework for handling HTTP requests.
    mongoose: MongoDB object modeling for Node.js.
    Dockerfile: Containerizes the Node.js API.
## Go Background Worker (user-worker/)
Purpose: Periodically processes and logs users count.

Libraries Used:

    fmt, log: Basic Go libraries for logging.
    time: Handles time-related functions.
    MongoDB Go Driver: Interacts with MongoDB.

## MongoDB (k8s/mongodb-statefulset.yaml)
    Purpose: Stores user data persistently.
    Kubernetes StatefulSet: Ensures persistent storage and stable identity.
## Redis (k8s/redis-deployment.yaml)
    Purpose: Provides fast, in-memory data storage and caching.
    Kubernetes Deployment: Manages Redis instances.
## Kubernetes Configuration (k8s/)
    Contains Kubernetes manifest files for deploying the components.
    Includes services, deployments, and StatefulSet configurations.
## Docker Compose (docker-compose.yml)
    Defines and runs multi-container Docker applications for local development.
## Autoscaling in Kubernetes
    Horizontal Pod Autoscalers are configured for the Node.js API and potentially other components to handle load efficiently.
    Make sure Metrics Server is deployed in your Kubernetes cluster for HPA to function.
