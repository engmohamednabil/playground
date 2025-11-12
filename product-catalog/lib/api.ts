import { Product, ChatRequest } from './types';

const API_BASE_URL = process.env.BACKEND_API_BASE_URL || 'http://localhost:5153';

export const api = {
  getProducts: async (): Promise<Product[]> => {
    try {

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  addProduct: async (product: Product): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, product: Product): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle API return 204 No Content for DELETE
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      return data.success !== undefined ? data : { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

// AI Chat endpoints
  clearChatHistory: async (productId: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/clear/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  },

  sendChatMessage: async (
    chatRequest: ChatRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    try {
      
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

};