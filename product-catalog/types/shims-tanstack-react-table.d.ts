declare module '@tanstack/react-table' {
  // Minimal shim to satisfy the TypeScript compiler in environments
  // where the package types are not yet installed.
  export type ColumnDef<TData = unknown, TValue = unknown> = any;
  export function useReactTable(options: any): any;
  export function getCoreRowModel(): any;
  export function getFilteredRowModel(): any;
  export function getPaginationRowModel(): any;
  export function flexRender(...args: any[]): any;
}


