export interface Product {
  id: string;
  desc: string;
  price: number;
  brand: string;
  stock: number;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}