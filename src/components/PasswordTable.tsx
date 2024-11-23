// src/components/PasswordTable.tsx

import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PasswordEntry } from "../types/password";

interface PasswordTableProps {
  passwords: PasswordEntry[];
  selectedPassword: PasswordEntry | null;
  onRowClick: (entry: PasswordEntry) => void;
}

export const PasswordTable = ({ passwords, selectedPassword, onRowClick }: PasswordTableProps) => {
  const columns: ColumnDef<PasswordEntry>[] = [
    { accessorKey: "title", header: "Titel" },
    { accessorKey: "username", header: "Benutzername" },
    { accessorKey: "password", header: "Passwort" },
    { accessorKey: "category", header: "Kategorie" },
  ];

  const table = useReactTable({
    data: passwords,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="my-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{header.column.columnDef.header}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={`cursor-pointer ${
                selectedPassword?.id === row.original.id ? "bg-blue-100" : ""
              }`}
              onClick={() => onRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{cell.renderValue()}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
