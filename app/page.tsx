"use client";

import Header from "@/components/header";
import { useSetDocument, VeltComments, VeltCommentTool } from "@veltdev/react";
// import { VeltCommentBubble } from "@veltdev/react/comment-bubble";
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
    { ProductID: "P001", ProductName: "Apple", Category: "Electronics", StockLevel: 50, RestockDate: "2024-07-10", Price: 999, Supplier: "TechWorld" },
    { ProductID: "P002", ProductName: "Samsung ", Category: "Electronics", StockLevel: 30, RestockDate: "2024-07-12", Price: 899, Supplier: "MobileCorp" },
    { ProductID: "P003", ProductName: "Nike ", Category: "Footwear", StockLevel: 120, RestockDate: "2024-07-15", Price: 150, Supplier: "SportsGear" },
    { ProductID: "P004", ProductName: "Levi", Category: "Clothing", StockLevel: 75, RestockDate: "2024-07-20", Price: 60, Supplier: "DenimWorks" },
    { ProductID: "P005", ProductName: "Kitchen", Category: "Appliances", StockLevel: 20, RestockDate: "2024-07-22", Price: 350, Supplier: "Homes" },
    { ProductID: "P006", ProductName: "Dell", Category: "Electronics", StockLevel: 45, RestockDate: "2024-07-25", Price: 1200, Supplier: "Computer" },
    { ProductID: "P007", ProductName: "Adidas", Category: "Footwear", StockLevel: 90, RestockDate: "2024-07-28", Price: 180, Supplier: "SportsGear" },
    { ProductID: "P008", ProductName: "Polo", Category: "Clothing", StockLevel: 150, RestockDate: "2024-07-30", Price: 35, Supplier: "FashionHub" },
    { ProductID: "P009", ProductName: "Sony", Category: "Electronics", StockLevel: 60, RestockDate: "2024-08-01", Price: 350, Supplier: "TechWorld" },
    { ProductID: "P010", ProductName: "UCB", Category: "Appliances", StockLevel: 100, RestockDate: "2024-08-05", Price: 90, Supplier: "Homes" },
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
  const DEFAULT_ROWS_COUNT = 80;

  const [rowData] = useState(() => makeData(DEFAULT_ROWS_COUNT, COLUMNS_COUNT));

  const columnDefs = useMemo(() => {
    return range(COLUMNS_COUNT).map((i) => ({
      field: getColumnLabel(i),
      headerName: getColumnLabel(i),  // Default header for columns beyond the data fields
      editable: true,
      width: 120,
      cellRenderer: EditableCellRenderer,
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
      animateRows: false,
      enableCellTextSelection: true,
    }),
    []
  );

  useSetDocument("sheet-1", { documentName: "salary sheet" });

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-xs">
      <VeltComments popoverMode={true} customAutocompleteSearch={true}  />
      <Header />

      <div className="ag-theme-alpine flex-1 w-full">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          headerHeight={36}
          rowHeight={40}
          suppressCellFocus={true}
          suppressMovableColumns={true}
          suppressFieldDotNotation={true}
          debounceVerticalScrollbar={true}
          suppressContextMenu={true}
        />
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
  
  const hasData = value && value.toString().trim() !== '';

  const onBlur = useCallback(() => {
    params.node.setDataValue(params.colDef.field, value);
  }, [value, params]);

  return (
    <div
      className="relative w-full h-full group"
      id={cellId}
      data-velt-target-comment-element-id={cellId}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className={`w-full h-full focus:outline-none bg-transparent text-sm px-2 ${hasData ? 'pr-10' : ''}`}
        style={{
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
        }}
      />
      
      {hasData && (
        <>
          <div className="absolute top-0 right-0 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="p-1 rounded-full transition-colors cursor-pointer mr-1">
              <VeltCommentTool 
                targetElementId={cellId}
                style={{ width: '20px', height: '20px' }}
              />
            </div>
          </div>
          
          {/* <div className="absolute top-0 right-0">
            <VeltCommentBubble
              targetElementId={cellId}
              commentCountType="total"
            />
          </div> */}
        </>
      )}
    </div>
  );
});