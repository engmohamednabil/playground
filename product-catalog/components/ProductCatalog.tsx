'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { api } from '../lib/api';
import { Product } from '../lib/types';
import toast from "react-hot-toast";
import Link from 'next/link';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

// Product Form Component
interface ProductFormProps {
  product?: Product;
  onSubmit: (formData: Product) => void;
  onCancel: () => void;
  existingIds: string[];
}

function ProductForm({ product, onSubmit, onCancel, existingIds }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>(
    product || { id: '', desc: '', price: 0, brand: '', stock: 0 }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Product, string>> = {};
    if (!formData.id.trim()) newErrors.id = 'ID is required';
    if (!formData.desc.trim()) newErrors.desc = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    
    if (!product && existingIds.includes(formData.id)) {
      newErrors.id = 'ID already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isFormValid = formData.id && formData.desc && formData.price > 0 && formData.brand && formData.stock > -1;

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="id">Product ID</Label>
        <Input
          id="id"
          value={formData.id}
          onChange={(e) => handleChange('id', e.target.value)}
          disabled={!!product}
          className={errors.id ? 'border-red-500' : ''}
        />
        {errors.id && <p className="text-sm text-red-500">{errors.id}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="desc">Product Name</Label>
        <Input
          id="desc"
          value={formData.desc}
          onChange={(e) => handleChange('desc', e.target.value)}
          className={errors.desc ? 'border-red-500' : ''}
        />
        {errors.desc && <p className="text-sm text-red-500">{errors.desc}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price || ''}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          className={errors.price ? 'border-red-500' : ''}
        />
        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={formData.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          className={errors.brand ? 'border-red-500' : ''}
        />
        {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={!isFormValid}>
          {product ? 'Update' : 'Add'} Product
        </Button>
      </DialogFooter>
    </div>
  );
}

// Data Table Component
interface DataTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

function DataTable({ data, onEdit, onDelete }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'id',
      header: 'Product ID',
      cell: ({ row }: any) => (
        <span className="font-medium">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'desc',
      header: 'Product Name',
      cell: ({ row }: any) => row.original.desc,
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
      cell: ({ row }: any) => row.original.brand,
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }: any) => (
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {row.original.price.toFixed(0)} EUR
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        const product = row.original;
        return (
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/chat?id=${product.id}&description=${encodeURIComponent(product.desc)}&brand=${encodeURIComponent(product.brand)}`}>
                🤖 Ask AI
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              aria-label={`Edit ${product.desc}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product.id)}
              aria-label={`Delete ${product.desc}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row: any, _columnId: any, filterValue: any) => {
      if (!filterValue) return true;
      const v = String(filterValue).toLowerCase();
      const p = row.original as Product;
      return (
        p.id.toLowerCase().includes(v) ||
        p.desc.toLowerCase().includes(v) ||
        String(p.price).includes(v) ||
        p.brand.toLowerCase().includes(v)
      );
    },
  });

  // When pageSize changes via select, update pagination and reset to first page
  const handleChangePageSize = (value: number) => {
    setPageSize(value);
    setPagination((prev) => ({ ...prev, pageSize: value, pageIndex: 0 }));
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 py-4">
        <Input
          placeholder="Search Products"
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Rows</label>
          <select
            className="h-9 rounded-md border bg-background px-2 text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => handleChangePageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow key={row.id} className="odd:bg-muted/20 hover:bg-muted/40">
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-28 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData: Product) => {
    try {
      // API call to update database
      await api.addProduct(formData);
      // Refresh data from API after successful add
      await fetchProducts();
      setIsAddDialogOpen(false);
      toast.success("Product added successfully");
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleEdit = async (formData: Product) => {
    try {
      // API call to update database
      await api.updateProduct(formData.id, formData);
      // Refresh data from API after successful update
      await fetchProducts();
      setEditingProduct(null);
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    
    try {
      // API call to update database
      await api.deleteProduct(deleteProductId);
      // Refresh data from API after successful delete
      await fetchProducts();
      setDeleteProductId(null);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const existingIds = products.map(p => p.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-muted-foreground">
        <span className="mr-3 inline-block size-4 animate-spin rounded-full border-2 border-input border-r-transparent" />
        Loading products...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <DataTable 
        data={products} 
        onEdit={setEditingProduct}
        onDelete={setDeleteProductId}
      />

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details for the new product. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
            existingIds={existingIds}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details. Click save when done.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleEdit}
              onCancel={() => setEditingProduct(null)}
              existingIds={existingIds}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete product {deleteProductId}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}