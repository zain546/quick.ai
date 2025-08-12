# 🚀 QuickAI - AI-Powered Content Creation Platform

A modern, full-stack web application that leverages artificial intelligence to help users create various types of content including articles, blog titles, images, and more. Built with React.js, Node.js, and integrated with cutting-edge AI services.

![QuickAI Platform](https://img.shields.io/badge/QuickAI-AI%20Powered%20Platform-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.0.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.0.0-339933?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-336791?style=for-the-badge&logo=postgresql)

## ✨ Features

### 🤖 AI-Powered Content Generation
- **Article Writing**: Generate comprehensive articles on any topic
- **Blog Title Creation**: Create engaging, SEO-friendly blog titles
- **Image Generation**: Generate unique images from text descriptions
- **Background Removal**: Remove backgrounds from images with precision
- **Object Removal**: Remove specific objects from images
- **Resume Review**: AI-powered resume analysis and feedback

### 🔐 Authentication & User Management
- **Secure Authentication**: Powered by Clerk authentication service
- **User Profiles**: Manage user accounts and preferences
- **Premium Plans**: Subscription-based access to advanced features
- **Role-based Access**: Different features for free vs premium users

### 💾 Content Management
- **Creation History**: Track all your AI-generated content
- **Community Sharing**: Share creations with the community
- **Like System**: Interact with community creations
- **Content Organization**: Categorize and manage your creations

### 🎨 Modern User Interface
- **Responsive Design**: Works seamlessly on all devices
- **Smooth Animations**: Professional micro-interactions
- **Dark/Light Themes**: Customizable visual experience
- **Intuitive Navigation**: Easy-to-use interface

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database (hosted on Neon)
- **Cloudinary** - Image and video management
- **Multer** - File upload handling

### AI & External Services
- **OpenAI API** - GPT models for text generation
- **Gemini API** - Google's AI model for content creation
- **ClipDrop API** - Advanced image generation
- **Clerk** - Authentication and user management

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Neon account)
- API keys for OpenAI, Gemini, ClipDrop, and Clerk

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quickai.git
   cd quickai
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` files in both `server/` and `client/` directories:

   **Server Environment Variables** (`server/.env`):
   ```env
   PORT=8000
   DATABASE_URL=your_neon_postgresql_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   CLIPDROP_API_KEY=your_clipdrop_api_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

   **Client Environment Variables** (`client/.env`):
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

5. **Database Setup**
   
   Ensure your PostgreSQL database has the following table structure:
   ```sql
   CREATE TABLE creations (
     id SERIAL PRIMARY KEY,
     user_id VARCHAR(255) NOT NULL,
     type VARCHAR(50) NOT NULL,
     prompt TEXT NOT NULL,
     content TEXT NOT NULL,
     publish BOOLEAN DEFAULT false,
     likes TEXT[] DEFAULT '{}',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

6. **Start the development servers**

   **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

   **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📱 Usage

### For Free Users
- Generate basic blog titles
- Limited access to core features
- Community content viewing

### For Premium Users
- Unlimited access to all AI tools
- Advanced image processing features
- Priority support
- Enhanced content generation capabilities

## 🔧 API Endpoints

### AI Services
- `POST /api/ai/generate-article` - Generate articles
- `POST /api/ai/generate-blog-title` - Create blog titles
- `POST /api/ai/generate-image` - Generate images
- `POST /api/ai/remove-image-background` - Remove image backgrounds
- `POST /api/ai/remove-image-object` - Remove objects from images
- `POST /api/ai/resume-review` - Review resumes

### User Management
- `GET /api/user/get-user-creations` - Get user's creations
- `GET /api/user/get-published-creations` - Get community creations
- `POST /api/user/toggle-like-creation` - Like/unlike creations

## 🏗️ Project Structure

```
quickai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   └── assets/        # Static assets
│   ├── public/            # Public assets
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── routes/            # API route definitions
│   ├── middlewares/       # Custom middleware
│   ├── configs/           # Configuration files
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Vercel Deployment
The project includes `vercel.json` configuration for easy deployment on Vercel.

### Environment Variables
Ensure all environment variables are properly set in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT models
- **Google** for Gemini AI
- **Clerk** for authentication services
- **Cloudinary** for image management
- **Neon** for PostgreSQL hosting

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Made with ❤️ by the QuickAI Team**

*Empowering creativity through artificial intelligence*
