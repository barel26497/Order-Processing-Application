# Order Processing Application

A microservices-based order management system to demonstrate real-time order processing with asynchronous background workers. The app features a React frontend, Node.js API, MongoDB database, and RabbitMQ message broker for reliable order processing.

## 🚀 Features

- **Real-time Order Management**: Create, view, and delete orders with live updates
- **Asynchronous Processing**: Background workers automatically process orders
- **Responsive UI**: Clean React interface with real-time status updates
- **Microservices Architecture**: Containerized services for easy scaling
- **Message Queue Integration**: RabbitMQ handles order processing reliably
- **Persistent Storage**: MongoDB stores all order data

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      USER INTERFACE (Vite + React)                              │
│                               3000 -> :80                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ uses
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND API Client Module                            │
│                        ┌─────────────────────────┐                              │
│                        │ • HTTP fetch helpers    │                              │
│                        │ • JSON parse + errors   │                              │
│                        │ • Base URL: VITE_API_URL│                              │
│                        └─────────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTP Requests (GET/POST/DELETE)
                                        │ Order data (item, quantity)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND API Service                                   │
│                              Port: 3001                                         │
│                        ┌─────────────────────────┐                              │
│                        │ • CORS handling         │                              │
│                        │ • Data validation       │                              │
│                        │ • Database operations   │                              │
│                        │ • Message publishing    │                              │
│                        └─────────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                        CRUD            │ Publish orders.create
                    ┌───────────────────┼
                    │                   │
                    ▼                   ▼
        ┌─────────────────┐  ┌─────────────────┐
        │   MongoDB       │  │   RabbitMQ      │
        │   Port: 27017   │  │   Port:15672    │
        │                 │  │                 │
        │ • Store orders  │  │ • Order queue   │
        │ • Read orders   │  │ • Message pub   │
        │ • Update status │  │ • Async proc    │
        └─────────────────┘  └─────────────────┘
                    ▲                   │
Order status        │                   │
updates             │                   ▼
(Pending →          │           ┌─────────────────┐
Processed)          │           │   Worker        │
                    │           │   (Processor)   │
                    │           │                 │
                    │           │ • Consume msgs  │
                    │           │ • Process orders│
                    │           │ • Update status │
                    │           └─────────────────┘
                    │                   │
                    │                   │
                    │                   │
                    └───────────────────┘
                                        │
                                        ▼
                            ┌─────────────────────────┐
                            │   Real-time Updates     │
                            │   (Polling every 2.5s)  │
                            └─────────────────────────┘
                                        │
                                        │ Updated order data
                                        ▼
                            ┌─────────────────────────┐
                            │   Frontend Refresh      │
                            │   (React state update)  │
                            └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SHARED RESOURCES                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                                       │
                    ▼                                       ▼
        ┌─────────────────┐                         ┌─────────────────┐
        │ order.model.js  │                         │ Environment     │
        │ (Mongoose)      │                         │ Variables       │
        │                 │                         │                 │
        │ • Schema def    │                         │ • Database URLs │
        │ • Validation    │                         │ • API keys      │
        │ • Timestamps    │                         │ • CORS origins  │
        └─────────────────┘                         └─────────────────┘



```

## 🛠️ Technology Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS Modules** - Component-scoped styling

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Service orchestration
- **RabbitMQ** - Message broker
- **Nginx** - Production web server

## 📋 Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Node.js** (version 18+ for local development)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/barel26497/Order-Processing-Application.git order-processing-app
cd order-processing-app
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# MongoDB Configuration
MONGO_USER=root
MONGO_PASS=example
MONGO_URL=mongodb://root:example@mongo:27017/?authSource=admin

# RabbitMQ Configuration
RABBITMQ_USER=guest
RABBITMQ_PASS=guestpassword
RABBITMQ_URL=amqp://guest:guestpassword@rabbitmq:5672

# API Configuration
VITE_API_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3000
```

### 3. Start the Application

```bash
# Start the Application in detached mode
docker compose up --build -d
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **RabbitMQ Management**: http://localhost:15672 (guest/guestpassword)
- **MongoDB**: localhost:27017

## 📁 Project Structure

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

## 📊 API Endpoints

### Orders

- `GET /orders` - Retrieve all orders
- `GET /orders/:id` - Retrieve specific order
- `POST /orders` - Create new order
- `DELETE /orders/:id` - Delete order

The application provides UI for creating and managing orders, so you don't need to use these API endpoints directly.

## 🔄 Order Processing Flow

1. **Order Creation**: User submits order via web interface
2. **API Processing**: Backend validates and stores order in MongoDB
3. **Message Publishing**: Order details published to RabbitMQ
4. **Worker Processing**: Background worker consumes and processes order
5. **Status Update**: Order status updated to "Processed"
6. **Real-time Updates**: Frontend polls for updates every 2.5 seconds

## 🐳 Docker Configuration

### Services

- **web**: React frontend with Nginx
- **api**: Express.js API server
- **worker**: Background order processor
- **mongo**: MongoDB database
- **rabbitmq**: RabbitMQ message broker

### Port Mappings

- Frontend: 3000 → 80 (container)
- API: 3001 → 3001 (container)
- MongoDB: 27017 → 27017 (container)
- RabbitMQ: 5672 → 5672, 15672 → 15672 (container)

## 🔒 Security Considerations

- **Input Validation**: Both client and server-side validation
- **CORS Configuration**: Configurable origin restrictions
- **Database Authentication**: Secure MongoDB access with user credentials
- **Error Handling**: No sensitive information exposed in error responses

## 📈 Performance & Scalability

- **Containerized Services**: Easy horizontal scaling across multiple instances
- **Message Queuing**: Asynchronous processing for better throughput
- **Polling Strategy**: Efficient real-time updates with configurable intervals
