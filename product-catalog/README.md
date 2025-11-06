# Product Catalog Nextjs Application

A product catalog application built with Next.js, TypeScript, and shadcn/ui components. This application provides a complete CRUD (Add, List, Update, Delete) interface for managing products with real-time notifications after each operation.

## Features

- **CRUD Operations**: Add, List, Edit, and Delete products
- **Real-time Search**: Filter products instantly by ID, name, brand, or price
- **Form Validation**: Client-side validation with helpful error messages
- **Accessible UI**: Using shadcn/ui components
- **Toast Notifications**: User notifications with react-hot-toast

## Tech Stack

- **Framework**: Next.js
- **TypeScript**: 5.x
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Testing**: Jest + React Testing Library

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (or **yarn**/**pnpm** as alternatives)
- **Git**: For cloning the repository

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd product-catalog
```

### Step 2: Install Dependencies

```bash
npm install
```

Or if you're using yarn:

```bash
yarn install
```

Or if you're using pnpm:

```bash
pnpm install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the backend .net api Url as environment variables:

```env
BACKEND_API_BASE_URL=http://backendUrl:port/products
```

### Step 4: Set Up the API

The application has the following calls to backend API endpoints:

- `GET /api/products` - Fetch all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Step 5: Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
product-catalog/
├── components/
│   └── ui/              # shadcn/ui components
│       ├── dialog.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── alert-dialog.tsx
├── lib/
│   ├── api.ts           # API client functions (calls toward .net apis)
│   └── types.ts         # Product type definition
├── pages/
│   └── ProductCatalog.tsx  # Main product catalog component
├── public/              # Static assets
├── styles/              # Global styles
└── package.json
```

## Available Scripts

- **`npm run dev`**: Starts the development server
- **`npm run build`**: Creates an optimized production build
- **`npm run start`**: Starts the production server
- **`npm run lint`**: Runs ESLint to check code quality
- **`npm run test`**: Runs the test suite with Jest

## Usage

### Adding a Product

1. Click the "Add Product" button in the top-right corner
2. Fill in the product details:
   - Product ID (must be unique)
   - Product Name
   - Brand
   - Price (must be greater than 0)
3. Click "Add Product" to save

### Editing a Product

1. Click the edit icon next to any product in the table
2. Modify the desired fields (Product ID cannot be changed)
3. Click "Update Product" to save changes

### Deleting a Product

1. Click the delete icon next to any product
2. Confirm the deletion in the alert dialog
3. The product will be permanently removed

### Searching Products

Use the search bar above the table to filter products by:
- Product ID
- Product Name
- Brand
- Price

## Component Overview

### ProductCatalog (Main Component)

The main component that orchestrates the entire application, managing state and coordinating between child components.

### ProductForm

A form component for both adding and editing products with built-in validation.

### DataTable

A table component with search functionality and action buttons for each product row.

## API Integration

The application uses a centralized API client (`lib/api.ts`) that should implement the following methods:

```typescript
interface Product {
  id: string;
  desc: string;
  price: number;
  brand: string;
  stock: number;
}

// API methods
getProducts(): Promise<Product[]>
addProduct(product: Product): Promise<Product>
updateProduct(id: string, product: Product): Promise<Product>
deleteProduct(id: string): Promise<void>
```

### Components

shadcn/ui components can be customized in the `components/ui/` directory.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
npm run dev -- -p 3001
```

### Dependencies Issues

If you encounter dependency issues, try:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

Ensure your `lib/types.ts` and `lib/api.ts` files are properly set up and match the expected interfaces.

## Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test -- --watch
```

## Building for Production

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```