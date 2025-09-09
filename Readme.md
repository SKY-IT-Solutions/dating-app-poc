Express TypeScript PoC API with Prisma
This is a small Proof of Concept (PoC) API built with Express, TypeScript, and Prisma, using Neon PostgreSQL for data storage. It implements JWT-based authentication and simplified match logic for a swipe-based application.
Features

Auth:
/signup: Register a user with email and password (bcrypt hashed).
/login: Authenticate user and return a signed JWT.


Match Logic:
/swipe: Store a user's swipe (left or right) on another user.
If two users swipe "right" on each other, return "It's a match!".


Database: Neon PostgreSQL with Prisma ORM.

Prerequisites

Node.js (v16 or higher)
Neon PostgreSQL account and database URL
Git

Setup Instructions

Clone the Repository:
git clone <your-repo-url>
cd <repo_name>


Install Dependencies:
npm install


Set Up Environment Variables:Create a .env file in the root directory and add:
DATABASE_URL=<your-neon-postgres-url>
JWT_SECRET=<your-jwt-secret>
PORT=3000


Set Up Prisma:Initialize the database schema:
npx prisma migrate dev
npx pirsma generate

Build and Run the Application:
npm run build
npm run dev


Project Structure
poc-api/
├── prisma/
│   └── schema.prisma          # Prisma schema
├── src/
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts            # Auth endpoints
│   │   └── swipe.ts           # Swipe endpoints
│   ├── index.ts               # Main entry point
│   └── types.ts               # TypeScript interfaces
├── .env                       # Environment variables
├── package.json               # Node.js dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation

Endpoints

### Three API Endpoints

**Base URL**: `http://localhost:3000`

#### 1. POST /auth/signup
- **Headers**: `Content-Type: application/json`
- **Body**: `{"email": "string", "password": "string"}`
- **Response (201)**: `{"message": "User created successfully"}`

#### 2. POST /auth/login
- **Headers**: `Content-Type: application/json`
- **Body**: `{"email": "string", "password": "string"}`
- **Response (200)**: `{"token": "<jwt-token>"}`

#### 3. POST /swipe
- **Headers**: `Content-Type: application/json`, `Authorization: <token>`
- **Body**: `{"targetId": number, "direction": "L"|"R"}`
- **Response (200)**: `{"message": "Swipe recorded"}` or `{"message": "It's a match!"}`


Dependencies

express: Web framework
jsonwebtoken: JWT handling
bcrypt: Password hashing
@prisma/client: Prisma ORM for PostgreSQL
typescript: Type safety
dotenv: Environment variable management

Notes

The API uses Neon PostgreSQL with Prisma for database operations.
Passwords are hashed using bcrypt for security.
JWT is used for authentication, validated in the swipe endpoint.
The match logic checks for mutual right swipes and returns a match notification.
The code follows standard TypeScript conventions with JSDoc comments for documentation.
