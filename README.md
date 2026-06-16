# 🚀 Portfolio Website

A modern, full-stack developer portfolio showcasing projects, skills, and contact information.

## Tech Stack

- **Backend**: Go + Gin
- **Frontend**: React + Vite

## Prerequisites

- Go 1.21+
- Node.js 18+
- npm or yarn

## 🚀 Running the Project

### 1. Start the Backend

```bash
cd backend
go mod tidy
go run main.go
```

Backend will run on: http://localhost:8080

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

### Running Both Together (Separate Terminals)

Open **two terminals**:

- Terminal 1: `cd backend && go run main.go`
- Terminal 2: `cd frontend && npm run dev`

## 📡 API Endpoints

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | /api/health         | Health check         |
| GET    | /api/profile        | Get developer profile|
| GET    | /api/projects       | Get all projects     |
| GET    | /api/projects/:id   | Get project by ID    |

## 📁 Project Structure

```
/portfolio-root
├── /backend          → Go + Gin REST API server
│   ├── main.go
│   ├── go.mod
│   ├── /handlers     → HTTP handler functions
│   ├── /models       → Data structs / models
│   └── /data         → Static JSON seed data (mock database)
│
├── /frontend         → React + Vite SPA
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── /src
│       ├── main.jsx
│       ├── App.jsx
│       ├── /pages
│       ├── /components
│       ├── /hooks
│       └── /styles
│
└── README.md
```

## License

MIT
