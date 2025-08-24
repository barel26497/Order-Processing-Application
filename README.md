# Order Processing Application

A microservices-based order management system to demonstrate near real-time order processing with asynchronous background worker.
The app features a React frontend, Node.js API, MongoDB database, and RabbitMQ message broker for reliable order processing.

## Features

- **Near Real-time Order Management**: Create, view, and delete orders with near real-time updates (every 2s)
- **Asynchronous Processing**: Background worker automatically process orders
- **Responsive UI**: Clean React interface with near real-time status updates
- **Microservices Architecture**: Containerized services for easy scaling
- **Message Queue Integration**: RabbitMQ handles order processing reliably
- **Persistent Storage**: MongoDB stores all order data

## Architecture Diagram

See the full diagram here: [Order Processing App Architecture (PDF)](Order-Processing-app-architecture.pdf),
or find it directly in the root folder of the project.

## Technology Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS Modules** - Component-scoped styling

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM (Object Document Mapper; maps JavaScript objects to MongoDB documents)

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Service orchestration
- **RabbitMQ** - Message broker
- **Mongo Express** - Web-based MongoDB admin UI
- **Nginx** - Production web server

## Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Node.js** (version 18+ for local development)
- Open ports: **3000** (frontend), **3001** (API), **27017** (MongoDB), **5672/15672** (RabbitMQ)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/barel26497/Order-Processing-Application.git order-processing-app
cd order-processing-app
```

### 2. Make sure you have installed on your machine:

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Node.js** (version 18+ for local development)

Ensure the following ports are available: **3000** (frontend), **3001** (API), **27017** (MongoDB), **5672/15672** (RabbitMQ).

### 3. Environment Configuration

Create a `.env` file in the project root (Copy content below):

```env
RABBITMQ_USER=guest
RABBITMQ_PASS=guestpassword
RABBITMQ_URL=amqp://guest:guestpassword@rabbitmq:5672

MONGO_USER=root
MONGO_PASS=example
MONGO_URL=mongodb://root:example@mongo:27017/?authSource=admin
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASS=pass
MONGO_EXPRESS_URL=mongodb://root:example@mongo:27017/

VITE_API_URL=http://localhost:3001

CORS_ORIGIN=http://localhost:3000
```

### 4. Start the Application

```bash
# Start the Application in detached mode
docker compose up --build -d
```
Note: If you encounter MongoServerError: Authentication failed, run the command below before docker compose up -d --build:

```bash
docker compose down -v
```
This removes old MongoDB volumes so that the root user is recreated on the next startup.

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **RabbitMQ Management**: http://localhost:15672 (login: guest / guestpassword)
- **MongoDB**: localhost:27017
- **Mongo Express UI**: http://localhost:8081 (login: admin / pass)

### 6. Shutting Down

```bash
docker compose down
```

## Project Structure

```
order-processing-app/
├─ .env                           # Environment variables (e.g., MONGO_URL, RABBITMQ_URL, VITE_API_URL)
├─ .gitignore                     # Git ignore rules
├─ compose.yaml                   # Docker Compose for API, Worker, Web, MongoDB, RabbitMQ
├─ README.md                      # README file
├─ api/                           # HTTP API service (Node + Express)
│  ├─ Dockerfile                  # Container build for API
│  ├─ package-lock.json           # Locked dependency versions for reproducible installs
│  ├─ package.json                # API dependencies & npm scripts
│  └─ src/                        # API source code
│     ├─ db.connect.js            # MongoDB connection helper (Mongoose)
│     ├─ index.js                 # API server entrypoint (Express setup)
      ├─ rabbit.publish.js        # Used by orders.router.js to Publishes messages to RabbitMQ
│     └─ routes/                  # Route modules
│        └─ orders.router.js      # Orders endpoints (CRUD & publish to RabbitMQ)
├─ shared/                        # Code shared across services
│  └─ order.model.js              # Order schema/model (Mongoose)
├─ web/                           # Frontend app (Vite + React)
│  ├─ .gitignore                  # Web-specific ignore rules
│  ├─ Dockerfile                  # Container build for frontend
│  ├─ components/                 # Reusable UI components
│  │  ├─ DeleteButton.jsx         # Button to delete an order
│  │  ├─ DeleteButton.module.css  # Scoped styles for DeleteButton
│  │  ├─ OrderForm.jsx            # Form to create a new order
│  │  ├─ OrderForm.module.css     # Scoped styles for OrderForm
│  │  ├─ OrderList.module.css     # Scoped styles for OrdersList
│  │  ├─ OrdersList.jsx           # List of orders
│  │  ├─ StatusTag.jsx            # Visual status indicator badge
│  │  └─ StatusTag.module.css     # Scoped styles for StatusTag
│  ├─ eslint.config.js            # ESLint config
│  ├─ index.html                  # Vite HTML entry
│  ├─ package-lock.json           # Locked dependency versions for the frontend
│  ├─ package.json                # Frontend dependencies & scripts
│  ├─ public/                     # Static assets served as-is
│  │  └─ favicon.ico              # Site favicon
│  ├─ src/                        # Frontend source code
│  │  ├─ App.css                  # App-level styles
│  │  ├─ App.jsx                  # Root application component
│  │  ├─ api/                     # API client utilities (frontend)
│  │  │  └─ index.js              # HTTP calls to backend API
│  │  ├─ assets/                  # Images and other asset files
│  │  ├─ hooks/                   # Custom React hooks
│  │  │  └─ useOrdersService.js   # Hook to fetch/create/delete & poll orders
│  │  ├─ index.css                # Global styles
│  │  └─ main.jsx                 # React bootstrap (mounts <App />)
│  └─ vite.config.js              # Vite configuration
└─ worker/                        # Background worker (RabbitMQ consumer)
   ├─ Dockerfile                  # Container build for worker
   ├─ package-lock.json           # Locked dependency versions for worker
   ├─ package.json                # Worker dependencies & scripts
   └─ src/                        # Worker source code
      ├─ db.connect.js            # MongoDB connection helper for worker
      └─ index.js                 # Worker entrypoint (consume, process, ack/nack)

```

## API Endpoints

### Orders

- `GET /orders` - Retrieve all orders
- `GET /orders/:id` - Retrieve specific order
- `POST /orders` - Create new order
- `DELETE /orders/:id` - Delete order

The application provides UI for creating and managing orders, so you don't need to use these API endpoints directly.

## Order Processing Flow

1. **Order Creation**: User submits order via web interface
2. **API Processing**: Backend validates and stores order in MongoDB
3. **Message Publishing**: Order details published to RabbitMQ
4. **Worker Processing**: Background worker consumes and processes order
5. **Status Update**: Order status updated to "Processed"
6. **Near Real-time Updates**: Frontend polls for updates every 2 seconds

## Docker Configuration

### Services

- **web**: React frontend with Nginx
- **api**: Express.js API server
- **worker**: Background order processor
- **mongo**: MongoDB database
- **mongo-express**: MongoDB web UI (Mongo Express)
- **rabbitmq**: RabbitMQ message broker

### Port Mappings

- Frontend: 3000 → 80 (container)
- API: 3001 → 3001 (container)
- MongoDB: 27017 → 27017 (container)
- Mongo Express: 8081 → 8081 (container, web UI)
- RabbitMQ:
  - 5672 → AMQP protocol (used by API and Worker)
  - 15672 → Management UI (http://localhost:15672)
