#!/bin/bash

echo "==================================================="
echo "Matrimonial Website - Setup Script"
echo "==================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}Node.js version:${NC} $(node --version)"

# Backend setup
echo -e "${YELLOW}\nSetting up Backend...${NC}"
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example"
    cp .env.example .env
    echo -e "${YELLOW}Please update backend/.env with your credentials${NC}"
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

cd ..

# Frontend setup
echo -e "${YELLOW}\nSetting up Frontend...${NC}"
cd frontend

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example"
    cp .env.example .env
    echo -e "${YELLOW}Please update frontend/.env with your credentials${NC}"
fi

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

echo -e "${GREEN}\n==================================================="
echo "Setup Complete!"
echo "===================================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update backend/.env with your credentials"
echo "2. Update frontend/.env with your API URL"
echo ""
echo -e "${YELLOW}To run the application:${NC}"
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo -e "${YELLOW}Frontend will open at: http://localhost:3000${NC}"
echo -e "${YELLOW}Backend will run at: http://localhost:5000${NC}"
echo ""
