# Almari 👗

Almari is a modern, high-performance e-commerce storefront built with Next.js 16, Prisma, and Zustand. It features a clean UI, fast navigation, and a robust cart management system.

## 🚀 Features

- **Dynamic Product Pages**: High-performance product listings and detail pages using Next.js App Router.
- **Cart Management**: Seamless shopping experience powered by Zustand for state management.
- **Modern UI**: Styled with Tailwind CSS 4 for a responsive and beautiful design.
- **Type Safe**: Fully written in TypeScript for better developer experience and reliability.
- **Database Ready**: Integrated with Prisma for easy database management and type-safe queries.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [Prisma](https://www.prisma.io/) with SQLite
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sauravjha491/Almari.git
   cd almari
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/actions`: Server actions for handling business logic.
- `src/lib`: Shared utilities and database configuration.
- `src/stores`: Zustand state stores (e.g., cart-store).
- `prisma`: Database schema and migration files.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality.
- `npm run db:studio`: Opens Prisma Studio to view your data.

## 📄 License

This project is private and for educational purposes.
