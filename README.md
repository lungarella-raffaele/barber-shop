# Barber Shop Application

A modern, lightweight, and mobile-first booking system for barber shops. This application provides a complete solution for managing appointments, staff schedules, services, and customer interactions.

> [!IMPORTANT]
> The application is ACTUALLY being used by Emiliano Lo Russo at **Emi Hair Club**. If you're near Siena, stop by for a cut :).

## 📋 Project Overview

This is a full-stack web application designed to streamline barber shop operations. It offers an intuitive booking interface for customers and a comprehensive admin dashboard for shop owners and staff. Built with modern web technologies, it ensures fast performance, excellent mobile experience, and easy deployment.

## ✨ Key Features

### Customer Features
- **Easy Booking**: Simple, intuitive interface for booking appointments
- **User Accounts**: Secure registration and login with email verification
- **Reservation Management**: View, modify, and cancel upcoming appointments
- **Service Selection**: Browse available services with prices and descriptions
- **Real-time Availability**: See available time slots based on staff schedules
- **Email Notifications**: Automatic booking confirmations and reminders
- **Mobile-First Design**: Optimized for smartphones and tablets
- **Password Recovery**: Secure password reset functionality

### Admin Features
- **Dashboard**: Comprehensive overview of bookings and business metrics
- **Calendar View**: Visual representation of appointments and schedules
- **Staff Management**: Add and manage multiple staff members
- **Service Management**: Create and update services with pricing and duration
- **Schedule Configuration**: Set working hours for each staff member
- **Reservation Management**: Approve, modify, or cancel bookings
- **Shutdown Periods**: Mark shop closures and holidays
- **Banner Announcements**: Display important messages to customers

### Technical Features
- **Authentication & Authorization**: Secure session-based auth using Oslo
- **Rate Limiting**: Protection against abuse and spam
- **Email Integration**: Transactional emails via Resend
- **Database ORM**: Type-safe database queries with Drizzle ORM
- **Cloud Database**: SQLite on Turso (libSQL) for scalability
- **Responsive Design**: TailwindCSS with mobile-first approach
- **Form Validation**: Client and server-side validation with Zod
- **Testing**: Unit tests with Vitest and E2E tests with Playwright

## 🛠️ Technology Stack

### Frontend
- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack framework with SSR and routing
- **[Svelte 5](https://svelte.dev/)** - Reactive UI framework with runes
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn-svelte](https://www.shadcn-svelte.com/)** - UI component library (bits-ui, formsnap)
- **[Lucide Icons](https://lucide.dev/)** - Icon library
- **TypeScript** - Type-safe development

### Backend
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe SQL ORM
- **[libSQL/Turso](https://turso.tech/)** - Edge-compatible SQLite database
- **[Resend](https://resend.com/)** - Email delivery service
- **[Argon2](https://github.com/ranisalt/node-argon2)** - Password hashing
- **[@oslojs/crypto](https://oslo.js.org/)** - Cryptographic utilities for auth
- **[Pino](https://getpino.io/)** - Fast logging library
- **[Zod](https://zod.dev/)** - Schema validation

### Development Tools
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Playwright](https://playwright.dev/)** - E2E testing
- **[Oxlint](https://oxc.rs/)** - Fast linter
- **[Prettier](https://prettier.io/)** - Code formatter

### Deployment
- **[Vercel](https://vercel.com/)** - Hosting and deployment platform

## 🏗️ Architecture

```
barber-shop/
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable UI components
│   │   ├── composables/     # Svelte composables (state management)
│   │   ├── server/
│   │   │   ├── db/         # Database schema and configuration
│   │   │   ├── services/   # Business logic services
│   │   │   ├── auth.ts     # Authentication logic
│   │   │   ├── mailer.ts   # Email sending
│   │   │   └── logger.ts   # Logging utilities
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils.ts        # Utility functions
│   ├── routes/             # SvelteKit routes (pages and API)
│   │   ├── (protected)/    # Authenticated routes
│   │   ├── login/          # Login page
│   │   ├── signup/         # Registration page
│   │   └── newreservation/ # Booking flow
│   ├── hooks.server.ts     # Server hooks (auth, logging)
│   └── app.html            # HTML template
├── tests/                  # E2E tests
├── static/                 # Static assets
└── drizzle.config.ts       # Database configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (check `.nvmrc` for exact version)
- **pnpm** 10.0.0+ (package manager)
- **Turso** account (for database) or local SQLite
- **Resend** account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lungarella-raffaele/barber-shop.git
   cd barber-shop
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy the example file and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   
   Required variables:
   - `DATABASE_AUTH_TOKEN` - Turso database auth token
   - `DATABASE_CONNECTION_URL` - Turso database connection URL
   - `MAILER` - Resend API key
   - `BASE_URL` - Your application URL (e.g., `http://localhost:5173`)

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Run linter
- `pnpm format` - Format code with Prettier
- `pnpm check` - Type-check the project
- `pnpm db:push` - Push database schema changes
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## 🎯 Usage

### For Shop Owners

1. **Initial Setup**: Create an admin account and set up staff members
2. **Configure Services**: Add services with prices, descriptions, and durations
3. **Set Schedules**: Define working hours for each staff member
4. **Manage Bookings**: Review and approve customer reservations
5. **Monitor Dashboard**: Track business metrics and upcoming appointments

### For Customers

1. **Create Account**: Sign up with email and password
2. **Browse Services**: View available services and pricing
3. **Book Appointment**: Select service, staff, date, and time
4. **Receive Confirmation**: Get email confirmation of booking
5. **Manage Bookings**: View or cancel appointments from profile

## 🔒 Security Features

- Password hashing with Argon2
- Session-based authentication with secure cookies
- CSRF protection
- Rate limiting on sensitive endpoints
- Email verification for new accounts
- Secure password recovery flow
- SQL injection prevention via ORM

## 🧪 Testing

Run unit tests:
```bash
pnpm test
```

Run E2E tests:
```bash
pnpm test:e2e
```

View test report:
```bash
pnpm test:report
```

## 📦 Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

For other platforms, use the SvelteKit adapters for your target environment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT license](./LICENSE).

## 👤 Author

**Raffaele Lungarella** - [GitHub](https://github.com/lungarella-raffaele)

## 🙏 Acknowledgments

- Currently in production use at **Emi Hair Club** in Siena, Italy
- Built with modern open-source technologies
- Inspired by the need for simple, effective barber shop management
