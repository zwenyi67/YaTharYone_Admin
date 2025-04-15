import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { GetStockAdjustmentsType } from "@/api/inventory/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const baseIndex = 'fields.inventory-management.stock-adjust'

export const columns: ColumnDef<GetStockAdjustmentsType>[] = [
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
    accessorKey: "name",
    header: () => <TableHeaderCell>{`${baseIndex}.name`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.item.name}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "quantity",
    header: () => <TableHeaderCell>{`${baseIndex}.quantity`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.quantity} {row.original.item.unit_of_measure}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "adjustment_type",
    header: () => <TableHeaderCell>{`${baseIndex}.adjustment_type`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.adjustment_type}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "adjustment_date",
    header: () => <TableHeaderCell>{`${baseIndex}.adjustment_date`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.adjustment_date.toString()}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "reason",
    header: () => <TableHeaderCell>{`${baseIndex}.reason`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.reason ? row.original.reason : "There's no reason"}</div>;
    },
    filterFn: "includesString",
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
  // {
  //   accessorKey: "action",
  //   header: () => (
  //     <TableHeaderCell className="text-center">{`fields.actions`}</TableHeaderCell>
  //   ),
  //   cell: (data) => {
  //     return <ManageColumn data={data.row.original} />;
  //   },
  // },
];
