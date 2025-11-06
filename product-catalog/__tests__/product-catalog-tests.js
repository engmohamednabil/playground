// __tests__/ProductCatalog.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCatalog from '../components/ProductCatalog';

// Mock the API
jest.mock('../lib/api', () => ({
  api: {
    getProducts: jest.fn(),
    addProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  }
}));

const mockProducts = [
  { id: 'P001', desc: 'Wireless Mouse', price: 29.99, brand: 'Logitech' },
  { id: 'P002', desc: 'Mechanical Keyboard', price: 89.99, brand: 'Corsair' },
  { id: 'P003', desc: 'USB-C Hub', price: 45.50, brand: 'Anker' },
];

describe('ProductCatalog Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Initial render and data fetching
  test('should render product list on initial load', async () => {
    const { api } = require('../lib/api');
    api.getProducts.mockResolvedValue(mockProducts);

    render(<ProductCatalog />);

    await waitFor(() => {
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
    });

    expect(api.getProducts).toHaveBeenCalledTimes(1);
  });

});

test('should filter products by brand using global search', async () => {
    const { api } = require('../lib/api');
    api.getProducts.mockResolvedValue(mockProducts);

    render(<ProductCatalog />);

     await waitFor(() => {
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText('Search Products');
    fireEvent.change(filterInput, { target: { value: 'Anker' } });

    await waitFor(() => {
      expect(screen.queryByText('USB-C Hub')).toBeInTheDocument();
    });
  });

  test('should show delete confirmation dialog', async () => {
      const { api } = require('../lib/api');
      api.getProducts.mockResolvedValue(mockProducts);
  
      render(<ProductCatalog />);
  
      await waitFor(() => {
        expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
      });
  
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-trash-2')
      );
      fireEvent.click(deleteButton);
  
      await waitFor(() => {
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      });
    });

test('should delete product after confirmation and show toast', async () => {
    const { api } = require('../lib/api');
    api.getProducts.mockResolvedValueOnce(mockProducts)
                   .mockResolvedValueOnce(mockProducts.slice(1));
    api.deleteProduct.mockResolvedValue({ success: true });

    render(<ProductCatalog />);

    await waitFor(() => {
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-trash-2')
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /^Delete$/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.deleteProduct).toHaveBeenCalledWith('P001');
    });
  });

// Package.json dependencies for the project:
/*
{
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@tanstack/react-table": "^8.10.7",
    "lucide-react": "^0.263.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
*/