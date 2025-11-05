import { Product } from './types';

// Mock API
const mockProducts: Product[] = [
  { id: 'P001', desc: 'Wireless Mouse', price: 29.99, brand: 'Logitech' },
  { id: 'P002', desc: 'Mechanical Keyboard', price: 89.99, brand: 'Corsair' },
  { id: 'P003', desc: 'USB-C Hub', price: 45.50, brand: 'Anker' },
  { id: 'P004', desc: 'Laptop Stand', price: 35.00, brand: 'Rain Design' },
  { id: 'P005', desc: 'Webcam HD', price: 69.99, brand: 'Logitech' },
  { id: 'P006', desc: 'Monitor 27 inch', price: 299.99, brand: 'Dell' },
  { id: 'P007', desc: 'USB Mouse Pad', price: 15.99, brand: 'Corsair' },
  { id: 'P008', desc: 'Headphones', price: 149.99, brand: 'Sony' },
];

export const api = {
  getProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockProducts];
  },
  addProduct: async (product: Product): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockProducts.push(product);
    return product;
  },
  updateProduct: async (id: string, product: Product): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) mockProducts[index] = product;
    return product;
  },
  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) mockProducts.splice(index, 1);
    return { success: true };
  }
};