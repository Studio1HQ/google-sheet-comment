"use client";

import Header from "@/components/header";
import { useSetDocument, VeltCommentBubble, VeltComments } from "@veltdev/react";
import {
  AllCommunityModule,
  GridOptions,
  ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useMemo, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

const getColumnLabel = (index: number): string => {
  return String.fromCharCode(65 + index);
};

const range = (len: number) => Array.from({ length: len }, (_, i) => i);
  // Function to generate sample product data.

const createProductData = () => {
  return [
    { ProductID: "P001", ProductName: "Apple iPhone 14", Category: "Electronics", StockLevel: 50, RestockDate: "2024-07-10", Price: 999, Supplier: "TechWorld Inc." },
    { ProductID: "P002", ProductName: "Samsung Galaxy S23", Category: "Electronics", StockLevel: 30, RestockDate: "2024-07-12", Price: 899, Supplier: "MobileCorp" },
    { ProductID: "P003", ProductName: "Nike Air Max 2024", Category: "Footwear", StockLevel: 120, RestockDate: "2024-07-15", Price: 150, Supplier: "SportsGear Co." },
    { ProductID: "P004", ProductName: "Levi's 501 Jeans", Category: "Clothing", StockLevel: 75, RestockDate: "2024-07-20", Price: 60, Supplier: "DenimWorks" },
    { ProductID: "P005", ProductName: "KitchenAid Mixer", Category: "Appliances", StockLevel: 20, RestockDate: "2024-07-22", Price: 350, Supplier: "HomeSupplies" },
    { ProductID: "P006", ProductName: "Dell XPS 13 Laptop", Category: "Electronics", StockLevel: 45, RestockDate: "2024-07-25", Price: 1200, Supplier: "ComputerWorld" },
    { ProductID: "P007", ProductName: "Adidas Ultraboost", Category: "Footwear", StockLevel: 90, RestockDate: "2024-07-28", Price: 180, Supplier: "SportsGear Co." },
    { ProductID: "P008", ProductName: "Calvin Klein T-Shirt", Category: "Clothing", StockLevel: 150, RestockDate: "2024-07-30", Price: 35, Supplier: "FashionHub" },
    { ProductID: "P009", ProductName: "Sony WH-1000XM5", Category: "Electronics", StockLevel: 60, RestockDate: "2024-08-01", Price: 350, Supplier: "TechWorld Inc." },
    { ProductID: "P010", ProductName: "Instant Pot 6 Qt", Category: "Appliances", StockLevel: 100, RestockDate: "2024-08-05", Price: 90, Supplier: "HomeSupplies" },
  ];
};

const makeData = (rows: number, columns: number) => {
  const productData = createProductData();

  // Create the header row as the first row in the data
  const headers = [
    "Product ID", "Product Name", "Category", "Stock Level", "Restock Date", "Price", "Supplier"
  ];

  const data = range(rows).map((rowIndex) => {
    const rowData: Record<string, string | number> = {};  // Changed to allow string or number

    for (let colIndex = 0; colIndex < columns; colIndex++) {
      const colLabel = getColumnLabel(colIndex);

      // The first row is the header row, so populate it with the headers
      if (rowIndex === 0) {
        rowData[colLabel] = headers[colIndex] || "";  // Fill the first row with headers
      } else {
        // Otherwise, populate the product data
        if (colIndex < 7 && rowIndex - 1 < productData.length) {
          rowData[colLabel] = Object.values(productData[rowIndex - 1])[colIndex];  // Adjust row index to match data
        } else {
          rowData[colLabel] = "";
        }
      }
    }
    return rowData;
  });

  return data;
};


export default function Page() {
  const COLUMNS_COUNT = 26;  // Setting the columns to 26
  const DEFAULT_ROWS_COUNT = 100;

  const [rowData] = useState(() => makeData(DEFAULT_ROWS_COUNT, COLUMNS_COUNT));

  const columnDefs = useMemo(() => {
    const cellStyle = {
      borderRight: "1px solid #e0e0e0",
      borderBottom: "1px solid #e0e0e0",
      padding: "0 4px",
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      lineHeight: "20px",
    };

    return range(COLUMNS_COUNT).map((i) => ({
      field: getColumnLabel(i),
      headerName: getColumnLabel(i),  // Default header for columns beyond the data fields
      editable: true,
      width: 72,
      cellRenderer: EditableCellRenderer,
      cellStyle,
      headerClass: "google-like-header",
    }));
  }, [COLUMNS_COUNT]);

  const gridOptions = useMemo<GridOptions>(
    () => ({
      suppressDragLeaveHidesColumns: true,
      suppressScrollOnNewData: true,
      suppressMenuHide: true,
      rowSelection: "multiple",
      suppressColumnVirtualisation: true,
      suppressRowVirtualisation: false,
      domLayout: "autoHeight",
      animateRows: false,
      enableCellTextSelection: true,
    }),
    []
  );

  useSetDocument("sheet-1", { documentName: "salary sheet" });

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-xs">
      <VeltComments popoverMode={true} />
      <Header />

     <div className="ag-theme-alpine flex-1 overflow-x-auto scrollbar-hide !p-0" style={{ height: "100%", minHeight: "500px" }}>
  <div style={{ minWidth: `${COLUMNS_COUNT * 72}px` }}>
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      gridOptions={gridOptions}
      headerHeight={24}
      rowHeight={24}
      suppressCellFocus={true}
      suppressMovableColumns={true}
      suppressFieldDotNotation={true}
      debounceVerticalScrollbar={true}
      suppressContextMenu={true}
    />
  </div>
</div>

    </div>
  );
}

const EditableCellRenderer = React.memo(function EditableCellRenderer(params: {
  value: string;
  node: {
    rowIndex: string;
    setDataValue: (v1: string, v2: string) => void;
  };
  colDef: {
    field: string;
  };
}) {
  const [value, setValue] = useState(params.value);
  const cellId = `cell-${params.node.rowIndex}-${params.colDef.field}`;

  const onBlur = useCallback(() => {
    params.node.setDataValue(params.colDef.field, value);
  }, [value, params]);

  return (
    <div
      className="relative w-full h-full"
      id={cellId}
      style={{ height: "24px" }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className="px-2 w-full h-full focus:outline-none bg-transparent"
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          height: "24px",
          lineHeight: "24px",
          boxSizing: "border-box",
        }}
      />
      <VeltCommentBubble targetElementId={cellId}/>
    </div>
  );
});
