# Tarabezah - Restaurant Management System

A comprehensive restaurant management system built with Next.js, featuring floor plan design, reservation management, table combinations, and real-time updates.

## 🍽️ Overview

Tarabezah is a modern restaurant management platform that helps restaurant owners and staff manage their operations efficiently. The system provides tools for designing floor plans, managing reservations, handling walk-in customers, and optimizing table combinations.

## ✨ Features

### 🏗️ Floor Plan Designer
- **Interactive Canvas**: Drag-and-drop interface for creating restaurant layouts
- **Multiple Floor Support**: Design and manage multiple floors for your restaurant
- **Element Library**: Pre-built furniture elements (tables, chairs, decorative items)
- **Real-time Collaboration**: Multiple users can work on floor plans simultaneously
- **Zoom & Pan**: Navigate large floor plans with ease
- **Element Properties**: Configure table capacities, types, and positions

### 📅 Reservation Management
- **Smart Booking System**: Intuitive reservation creation with step-by-step wizard
- **Client Search**: Find existing customers or add new ones
- **Date & Time Selection**: Flexible scheduling with calendar integration
- **Party Size Management**: Handle groups of various sizes
- **Table Assignment**: Automatic or manual table assignment based on capacity
- **Walk-in Support**: Quick registration for walk-in customers

### 🎯 Table Combinations
- **Dynamic Combinations**: Create flexible table arrangements
- **Capacity Optimization**: Maximize seating efficiency
- **Visual Management**: Drag-and-drop interface for table combinations
- **Filtering & Search**: Find specific combinations quickly

### 📊 Waitlist Management
- **Queue Management**: Track waiting customers
- **Priority System**: Manage customer priorities
- **Real-time Updates**: Live updates when tables become available
- **Customer Communication**: Notify customers when their table is ready

### 🎨 Element Upload System
- **Multi-format Support**: Upload SVG, PNG, JPG, and JPEG files
- **Drag & Drop**: Easy file upload with visual feedback
- **Element Categorization**: Mark elements as reservable or decorative
- **Table Type Assignment**: Configure table types (Square, Round, Rectangle)

### 🔐 Authentication & Security
- **Secure Login**: JWT-based authentication
- **Multi-restaurant Support**: Manage multiple restaurant locations
- **Role-based Access**: Different permissions for different user types
- **Session Management**: Secure cookie-based sessions

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.2.1** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### State Management
- **Redux Toolkit** - Predictable state management
- **React Query (TanStack Query)** - Server state management
- **React Context** - Local state management

### Drag & Drop
- **React DnD** - Drag and drop functionality
- **@dnd-kit** - Modern drag and drop library
- **Multi-backend Support** - Touch and mouse interactions

### UI/UX
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **React Hot Toast** - Toast notifications
- **Sonner** - Modern toast notifications
- **React Calendar** - Date picker components

### Real-time Features
- **SignalR** - Real-time communication
- **WebSocket Support** - Live updates

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server (see backend documentation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tarabezah-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
 NEXT_PUBLIC_BACKEND_URL=https://tarabezah-backend-dev.0degrees.build/api
BACKEND_TOKEN="S0m3-CompL3x-T0ken-Valu3"
   NODE_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
tarabezah-next/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── login/               # Authentication endpoints
│   │   ├── restaurants/         # Restaurant management
│   │   ├── upload/              # File upload handling
│   │   └── reservation/         # Reservation endpoints
│   ├── components/              # React components
│   │   ├── floorplan/           # Floor plan components
│   │   ├── AddReservation/      # Reservation wizard
│   │   ├── canvas/              # Canvas and drawing tools
│   │   ├── ui/                  # Reusable UI components
│   │   └── tabs/                # Tab-based interfaces
│   ├── context/                 # React Context providers
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript type definitions
│   ├── services/                # API service functions
│   └── utils/                   # Utility functions
├── store/                       # Redux store configuration
│   └── features/                # Redux slices
├── public/                      # Static assets
│   └── images/                  # Image assets
├── lib/                         # Library configurations
└── middleware.ts                # Next.js middleware
```

## 🎯 Key Features Explained

### Floor Plan Designer
The floor plan designer allows you to create and manage restaurant layouts:
- **Drag & Drop**: Place tables and furniture elements on the canvas
- **Multi-floor Support**: Design different floors for your restaurant
- **Element Properties**: Configure table capacities, types, and visual properties
- **Real-time Updates**: Changes are saved automatically

### Reservation System
The reservation system provides a comprehensive booking solution:
- **Step-by-step Wizard**: Guided reservation creation process
- **Client Management**: Search and manage customer information
- **Smart Table Assignment**: Automatic table selection based on party size
- **Walk-in Support**: Quick registration for immediate seating

### Table Combinations
Optimize your restaurant's seating capacity:
- **Flexible Arrangements**: Create custom table combinations
- **Capacity Management**: Track seating capacity for different arrangements
- **Visual Interface**: Drag-and-drop combination management

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_BACKEND_URL`: Your backend API URL
- `BACKEND_TOKEN`: Authentication token for backend communication
- `NODE_ENV`: Environment (development/production)

### API Endpoints
The application communicates with a backend API for:
- User authentication
- Restaurant data management
- Floor plan storage
- Reservation processing
- File uploads

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Setup for Production
Ensure all environment variables are properly configured for your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v0.1.0** - Initial release with core features
  - Floor plan designer
  - Reservation management
  - Table combinations
  - User authentication

---

**Tarabezah** - Streamlining restaurant operations with modern technology.
