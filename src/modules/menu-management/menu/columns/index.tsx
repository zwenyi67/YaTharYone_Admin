import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ManageColumn from "./ManageColumn";
import { GetMenusType } from "@/api/menu/types";
import AddonsColumn from "./AddonsColumn";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const baseIndex = 'fields.menu-management.menu'

export const columns: ColumnDef<GetMenusType>[] = [
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
          {row.original.profile === null ? (
            <div className="flex">
              <div className="flex justify-center items-center rounded-full bg-secondary w-[55px] h-[55px] border">
                <div className="font-bold text-xl text-white">
                  {row.original.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>) :
            (
              <div className="d-flex ">
              <img
                src={profileUrl}
                alt="profile"
                className="w-[55px] h-[55px] border-2 border-blue-200 bg-accent rounded-full"
              />
              </div>
            )
          }
        </div>
      );
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "name",
    header: () => <TableHeaderCell>{`${baseIndex}.name`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "category_id",
    header: () => <TableHeaderCell className="text-center">{`${baseIndex}.category`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.category.name}</div>;
    },
  },
  {
    accessorKey: "price",
    header: () => <TableHeaderCell>{`${baseIndex}.price`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>${row.original.price}</div>;
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
    accessorKey: "addons",
    header: () => (
      <TableHeaderCell className="text-center">{`${baseIndex}.addons`}</TableHeaderCell>
    ),
    cell: (data) => {
      return <AddonsColumn data={data.row.original} />;
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
