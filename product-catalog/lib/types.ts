export interface Product {
  id: string;
  desc: string;
  price: number;
  brand: string;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}