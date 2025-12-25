# Section Builder Studio

A powerful, universal code studio for building, testing, and previewing web sections. Originally designed for Shopify Liquid, it now supports React (JSX) and raw CSS, offering a true "code-to-design" experience.

## 🚀 Features

### 1. Universal Live Preview Engine
The core of the studio is the `DynamicPreview` engine, which automatically detects your code type and mocks the environment:

*   **Shopify Liquid Mode**:
    *   Full schema parsing (settings & blocks).
    *   Simulates `{% for block in section.blocks %}` loops with mock data.
    *   Mocks Shopify filters (`asset_url`, `t`, `money`).
    *   Handles `{% render %}`, `{% form %}`, `{% assign %}` tags.
*   **React Mode (JSX)**:
    *   Auto-detects React components (`export default function...`).
    *   Compiles JSX in the browser using **Babel Standalone**.
    *   Renders components instantly securely sandboxed.
*   **CSS Mode**:
    *   Renders raw CSS in an isolated style playground.

### 2. Live Split-Screen Editor
*   **Real-time Synchronization**: The Upload page features a 50/50 split view. Type code on the left, see the result on the right instantly.
*   **Error Handling**: Graceful error boundaries for runtime JS/Liquid errors.

### 3. Section Library
*   **Static Sections**: Pre-built premium sections (Heroes, Testimonials, etc.).
*   **Custom Sections**: Your uploaded sections are saved to **MongoDB**, allowing persistence across sessions and browsers.
*   **Deduplication**: Intelligent store logic prevents duplicate components based on slug.

### 4. Authentication (NextAuth + MongoDB)
*   **Secure Sign-up/Login**: Credential-based authentication with hashed passwords (bcrypt).
*   **User Ownership**: Created sections are linked to the user who uploaded them.


## 🛠 Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Database**: MongoDB (Native driver)
*   **Auth**: NextAuth.js (Auth.js) with MongoDB Adapter
*   **Styling**: Tailwind CSS
*   **UI Components**: ShadCN UI + Lucide React
*   **State Management**: React Hooks + MongoDB API
*   **Sandboxing**: React & Babel Standalone (Client-side compilation)

## 📦 Getting Started

1.  **Clone the Repository**:
    ```bash
    git clone your-repo-url
    cd Task
    ```

2.  **Environment Variables**:
    Create a `.env.local` file based on `.env.example`:
    ```bash
    cp .env.example .env.local
    ```
    Fill in your `MONGODB_URI` and `NEXTAUTH_SECRET`.

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Open Studio**:
    Visit `http://localhost:3000`

## 🚀 Vercel Deployment

1.  Push your code to a GitHub repository.
2.  Import the project into [Vercel](https://vercel.com).
3.  Add the following Environment Variables in Vercel settings:
    *   `MONGODB_URI`
    *   `NEXTAUTH_SECRET`
    *   `NEXTAUTH_URL` (Set this to your production domain, e.g., `https://your-app.vercel.app`)
4.  Deploy!


## 📝 Usage

### creating a Custom Section
1.  Navigate to **/upload**.
2.  Choose a name (this becomes the `slug`).
3.  Paste your code.
4.  Watch the preview update live.
5.  Click **Create & Save Section** to store it in the database.

## 🤝 Project Structure

*   `app/api/sections/route.ts`: API for database operations.
*   `app/api/auth/[...nextauth]/route.ts`: Authentication configuration.
*   `lib/mongodb.ts`: MongoDB client connection utility.
*   `lib/section-store.ts`: Custom hook for fetching and saving sections.

---
Designed with ❤️ by **Akhilesh Yadav**.

