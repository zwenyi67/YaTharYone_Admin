import ExcelJS from "exceljs";
import { Download } from "lucide-react";

interface ExportExcelButtonProps<T> {
  data: T[];
  excludeColumns?: string[];
  fileName: string;
}

const ExportExcelButton = <T,>({
  data,
  excludeColumns,
  fileName,
}: ExportExcelButtonProps<T>) => {
  const handleExport = async () => {
    if (!data.length) return;

    const now = new Date();
    const formattedDate = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    const file = `${fileName}(${formattedDate})-export.xlsx`;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Sheet");

    // Extract column names dynamically, excluding specified columns
    const columns = Object.keys(data[0] as object).filter(
      (column) => !excludeColumns?.includes(column)
    );

    // Apply header row dynamically based on existing data
    worksheet.columns = columns.map((column) => ({
      header: column.charAt(0).toUpperCase() + column.slice(1),
      key: column,
      width: 20,
    }));

    // Apply styling only to header cells that exist
    const headerRow = worksheet.getRow(1);
    columns.forEach((_, colIndex) => {
      const cell = headerRow.getCell(colIndex + 1);
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } };
      cell.alignment = { horizontal: "center" };
    });

    // Add data rows with zebra striping and borders
    data.forEach((row, index) => {
      const newRow = worksheet.addRow(row);

      newRow.eachCell((cell, colIndex) => {
        // Add border for better readability
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };

        // Zebra striping (applied only to existing columns)
        if (index % 2 === 1 && colIndex <= columns.length) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F2F2F2" } };
        }
      });
    });

    // Adjust column width dynamically based on content
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length + 5);
      });
      column.width = maxLength;
    });

    // Export as file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file;
    a.click();
  };

  return (
    <button className="flex bg-secondary rounded-sm text-white px-4 py-2" onClick={handleExport}>
      <span className="pe-1">Export</span> <Download className="w-5 h-5 pt-1"/>
    </button>
  );
};

export default ExportExcelButton;
