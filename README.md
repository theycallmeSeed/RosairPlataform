# RosairPlataform

**RosairPlataform** is a full-stack marketplace platform connecting buyers and agents, built with a clean architecture approach using modern technologies.

## 🏗️ Architecture

The project is bifurcated into two main parts:

- **Frontend**: React 18 + Vite 6 + TypeScript + Tailwind CSS
- **Backend**: ASP.NET Core 9 (Clean Architecture modular monolith)

## � prerequisites

### Frontend
- Node.js (v20+ recommended)
- npm or pnpm

### Backend
- .NET 9.0 SDK
- PostgreSQL 13+
- Visual Studio 2022 or VS Code

### Database
- PostgreSQL database with `LinkanoDb` connection string

## 🚀 Getting Started

### Frontend

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend

```bash
# Navigate to backend
cd backend

# Restore dependencies
dotnet restore

# Run the API project
dotnet run --project src/Linkano.Api

# Or open RosairPlataform/backend/Linkano.sln in Visual Studio 2022
# Set Linkano.Api as startup project and press F5
```

## 🗄️ Database Configuration

The backend uses Entity Framework Core with PostgreSQL. Connection string configuration:

1. Create `appsettings.json` in `backend/src/Linkino.Api/` (or update existing)
2. Add the connection string:

```json
{
  "ConnectionStrings": {
    "LinkanoDb": "Host=localhost;Database=linkano;Username=postgres;Password=your_password"
  },
  "JwtOptions": {
    "SecretKey": "your-secret-key-min-32-characters",
    "Issuer": "rosairplataform",
    "Audience": "rosairplataform-users",
    "ExpiryMinutes": 60
  }
}
```

**Note**: In development, JWT options can also be configured via .NET user-secrets (`dotnet user-secrets set`).

## 🌐 Environment Variables

### Frontend (`package.json` scripts are sufficient for default config)

### Backend

Create or update `backend/src/Linkino.Api/appsettings.json` with:

- `ConnectionStrings:LinkanoDb` - PostgreSQL connection
- `JwtOptions:SecretKey` - JWT signing key (32+ chars)
- `JwtOptions:Issuer` - Token issuer
- `JwtOptions:Audience` - Token audience
- `AllowsHosts` - Allowed hosts for production

## 🛠️ Development Workflow

1. **Frontend**: Runs on `http://localhost:5173` (Vite default)
2. **Backend**: Runs on `http://localhost:5000` or `http://localhost:5001` (Kestrel default)
3. **CORS**: Configured in `Linkano.Api` for development origins
4. **Hot Reload**: Frontend auto-reloads on changes; backend requires restart or use `dotnet watch run`

## 📦 Available Scripts

### Frontend (`package.json`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `dotnet run --project src/Linkano.Api` - Run API project
- `dotnet test` - Run unit/integration tests

## 📁 Project Structure

```
RosairPlataform/
├── backend/                    # .NET Backend
│   └── src/Linkano.Api/        # API project
│       └── Program.cs          # Service registration & middleware
├── src/                        # Frontend Source
│   ├── main.tsx               # App entry point
│   ├── App.tsx                # Root component
│   ├── app/router.tsx         # React Router configuration
│   ├── components/            # UI components (Radix, Tailwind)
│   ├── data/products.ts       # Hardcoded product data
│   └── lib/                   # Utility cart, orders, chat, agentProducts
├── docs/                      # Comprehensive documentation
│   ├── architecture.md        # Clean architecture details
│   ├── business.md           # Business context & flows
│   ├── domain-model.md       # DDD aggregates & ER diagram
│   └── ... (additional docs)
├── package.json               # Frontend dependencies & scripts
└── vite.config.ts             # Vite configuration
```

## 🏃‍♂️ Running Both Environments

**Option 1: Separate terminals**

```bash
# Terminal 1 - Frontend
cd RosairPlataform
npm install
npm run dev

# Terminal 2 - Backend
cd RosairPlataform/backend
dotnet restore
dotnet run --project src/Linkano.Api
```

**Option 2: Using Docker (if configured)**

Check `docs/system-design.md` for Docker setup details.

## 🔧 Troubleshooting

- **Frontend fails to compile**: Ensure Node.js version matches package.json engines field
- **Backend can't connect to DB**: Verify PostgreSQL is running and connection string is correct
- **Authentication errors**: Check JWT configuration in `appsettings.json` or user-secrets
- **CORS issues**: Ensure frontend URL is added to `AllowedHosts` and CORS policies in `Program.cs`

## 📸 Screenshots & Demo

See `docs/user-flows.md` for user flow diagrams and `docs/architecture.md` for system design.

---

**RosairPlataform** - Connecting buyers and agents in the rose industry marketplace.