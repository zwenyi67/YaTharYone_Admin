import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ManageColumn from "./ManageColumn";
import { GetPaymentsType } from "@/api/order/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const baseIndex = 'fields.order-management.payment'

export const columns: ColumnDef<GetPaymentsType>[] = [
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
    accessorKey: "payment_number",
    header: () => <TableHeaderCell>{`${baseIndex}.payment_number`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.payment_number}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "payment_method",
    header: () => <TableHeaderCell>{`${baseIndex}.payment_method`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.payment_method}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "payment_status",
    header: () => <TableHeaderCell>{`${baseIndex}.payment_status`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.payment_status}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "order_number",
    header: () => <TableHeaderCell>{`${baseIndex}.order_number`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.order.order_number}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "waiter",
    header: () => <TableHeaderCell>{`${baseIndex}.waiter`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.waiter.username}</div>;
    },
  },
  {
    accessorKey: "cashier",
    header: () => <TableHeaderCell>{`${baseIndex}.cashier`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.cashier.username}</div>;
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
