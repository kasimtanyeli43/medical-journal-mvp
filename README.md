# Medical Journal MVP

A comprehensive medical journal article management system built with Next.js 14, TypeScript, Prisma, and Supabase.

## Features

- 🔐 **Authentication** - NextAuth.js with role-based access (Author, Editor, Reviewer)
- 📄 **Article Submission** - PDF upload with metadata
- 👥 **Review System** - Peer review workflow
- 📊 **Dashboards** - Role-specific interfaces
- 📧 **Email Notifications** - Automated via Resend
- 🎨 **Modern UI** - Responsive Tailwind CSS design

## Demo

Live Demo: [Coming Soon on Vercel]

### Demo Accounts

- **Author**: <author@demo.com> / demo123
- **Editor**: <editor@demo.com> / demo123
- **Reviewer**: <reviewer@demo.com> / demo123

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js
- **File Upload**: UploadThing
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- UploadThing account
- Resend account

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd medical-journal-mvp
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
cp .env.example .env.local
```

1. Configure `.env.local` with your credentials:

- `DATABASE_URL` - Your Supabase connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `UPLOADTHING_SECRET` & `UPLOADTHING_APP_ID` - From UploadThing
- `RESEND_API_KEY` - From Resend

1. Push database schema:

```bash
npx prisma db push
```

1. Seed demo data:

```bash
npm run db:seed
```

1. Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/medical-journal-mvp)

### Environment Variables

Make sure to add these in Vercel dashboard:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

## Project Structure

```
medical-journal-mvp/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboards
│   ├── articles/          # Public articles
│   └── page.tsx           # Homepage
├── components/            # Reusable components
├── lib/                   # Utilities
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # Auth helpers
│   └── email.ts          # Email service
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## License

MIT

## Support

For support, email <support@example.com>
