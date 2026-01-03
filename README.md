# Shopify Builder Studio

A premium web application for browsing, creating, and managing custom Shopify Liquid sections with live preview capabilities.

## 🚀 Features

- **Section Library**: Browse a curated collection of premium Shopify sections
- **Live Code Editor**: Create custom sections with real-time Liquid preview
- **Resizable Panels**: VS Code-style split-pane editor with drag-to-resize functionality
- **Dark Mode**: Beautiful dark mode support throughout the application
- **Authentication**: Secure user authentication with NextAuth.js
- **MongoDB Integration**: Store and manage custom sections in MongoDB
- **Responsive Design**: Fully responsive across all devices

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Akhileshyadu00/Shopify_builder_studio.git
cd Shopify_builder_studio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string (include database name: `shopify_builder`) | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js sessions | Yes |
| `NEXTAUTH_URL` | Base URL of your application | Yes (Production) |

## 📦 Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production domain)
4. Deploy!

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Code Highlighting**: React Syntax Highlighter

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── sections/          # Section library pages
│   ├── upload/            # Section creation page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── providers/        # Context providers
│   ├── shared/           # Shared components
│   └── ui/               # UI components
├── data/                  # Static data
├── lib/                   # Utility functions and configs
└── public/                # Static assets
```

## 🎨 Key Features

### Resizable Editor
- VS Code-inspired split-pane layout
- Drag-to-resize panels
- Responsive breakpoints for mobile/tablet

### Live Preview
- Real-time Liquid code rendering
- Device preview modes (Desktop, Tablet, Mobile)
- Support for Liquid syntax, schema, and blocks

### Dark Mode
- System preference detection
- Manual toggle
- Persistent theme selection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Akhilesh Yadav**

---

Built with ❤️ for Shopify Merchants
