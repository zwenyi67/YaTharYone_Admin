import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ManageColumn from "./ManageColumn";
import { GetOrdersType } from "@/api/order/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const baseIndex = 'fields.order-management.order'

export const columns: ColumnDef<GetOrdersType>[] = [
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
    accessorKey: "order_number",
    header: () => <TableHeaderCell>{`${baseIndex}.order_number`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.order_number}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "table",
    header: () => <TableHeaderCell>{`${baseIndex}.table`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.table.table_no}</div>;
    },
  },
  {
    accessorKey: "waiter",
    header: () => <TableHeaderCell>{`${baseIndex}.waiter`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.waiter.username}</div>;
    },
  },
  {
    accessorKey: "total_price",
    header: () => <TableHeaderCell>{`${baseIndex}.total_price`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>${row.original.total_price}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <TableHeaderCell>{`${baseIndex}.status`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.status}</div>;
    },
  },
  {
    accessorKey: "created_at",
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
