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

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  productId: string;
  message: string;
}

export interface ChatResponse {
  message: string;
  productId: string;
}