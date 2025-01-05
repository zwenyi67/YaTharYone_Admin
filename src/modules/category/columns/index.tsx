import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ManageColumn from "./ManageColumn";
import { GetEmployeesType } from "@/api/employee/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const baseIndex = 'fields.employee-management'

export const columns: ColumnDef<GetEmployeesType>[] = [
  {
    accessorKey: "number",
    header: () => <TableHeaderCell>{`${baseIndex}.number`}</TableHeaderCell>,
    cell: ({ table, row }) => {
      const sortedIndex =
        table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1;

      return <div>{sortedIndex}</div>;
    },
  },
  {
    accessorKey: "profile",
    header: () => <TableHeaderCell>{`${baseIndex}.profile`}</TableHeaderCell>,
    cell: ({ row }) => {
      const profileUrl = `http://127.0.0.1:8000${row.original.profile}`;
      return (
        <div>
          <img
            src={profileUrl} 
            alt="profile"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
      );
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "fullname",
    header: () => <TableHeaderCell>{`${baseIndex}.fullname`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.fullname}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "email",
    header: () => <TableHeaderCell className="text-center">{`${baseIndex}.email`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.email}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: () => <TableHeaderCell>{`${baseIndex}.phone`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.phone}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <TableHeaderCell>{`${baseIndex}.created_at`}</TableHeaderCell>,
    cell: ({ row }) => {
      return (
        <div>
          {formatDate(row.original.created_at.toString(), "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.actions`}</TableHeaderCell>
    ),
    cell: (data) => {
      return <ManageColumn data={data.row.original} />;
    },
  },
];
