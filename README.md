# Vendor Management System

A comprehensive vendor management system with catalog management capabilities, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Admin Authentication**: Secure login/signup system
- **Vendor Registration**: Add new vendors with detailed information
- **Catalog Management**: Manage product catalogs for each vendor
- **Image Upload**: Support for vendor and product images
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Database**: Powered by Supabase for real-time data synchronization

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vendor-management-system.git
cd vendor-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

The project includes SQL migration files in the `supabase/migrations/` directory. Run these migrations in your Supabase project:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the migration files in order:
   - `20250718160102_curly_garden.sql`
   - `20250718160107_teal_bonus.sql` 
   - `20250718160112_lingering_bar.sql`

### 5. Storage Setup

In your Supabase project:

1. Go to Storage
2. Create a new bucket called `images`
3. Set the bucket to public
4. Configure RLS policies for the bucket

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.tsx            # Authentication form
│   ├── VendorRegistration.tsx  # Main dashboard
│   ├── VendorList.tsx          # Vendor listing
│   ├── CatalogManagement.tsx   # Product catalog management
│   ├── ImageUpload.tsx         # Image upload component
│   └── EmailVerification.tsx   # Email verification
├── hooks/               # Custom React hooks
│   └── useAuth.ts              # Authentication hook
├── lib/                 # Library configurations
│   └── supabase.ts             # Supabase client
├── utils/               # Utility functions
│   └── imageUpload.ts          # Image upload utilities
├── App.tsx              # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Database Schema

### Vendors Table
- `id` (UUID, Primary Key)
- `shop_name` (Text)
- `location` (Text)
- `owner_name` (Text)
- `phone` (Text)
- `category` (Text)
- `image_url` (Text, Optional)
- `created_at` (Timestamp)

### Catalog Items Table
- `id` (UUID, Primary Key)
- `vendor_id` (UUID, Foreign Key)
- `vendor_name` (Text)
- `name` (Text)
- `description` (Text)
- `price` (Numeric)
- `unit` (Text)
- `image_url` (Text, Optional)
- `created_at` (Timestamp)

## Features Overview

### Admin Dashboard
- Secure authentication system
- Vendor registration form
- Navigation to catalog management

### Vendor Management
- Add new vendors with categories
- Upload vendor images
- View all registered vendors
- Search and filter vendors

### Catalog Management
- Add/edit/delete products for each vendor
- Upload product images
- Set prices and units
- Product descriptions

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Build the project
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set the following build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

**Important**: Make sure to set your environment variables in Vercel's dashboard under Settings → Environment Variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.