"use client";

import Header from "@/components/header";
import {
  useSetDocument,
  VeltCommentBubble,
  VeltComments,
} from "@veltdev/react";
import {
  ClientSideRowModelModule,
  GridOptions,
  ModuleRegistry,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useMemo, useState } from "react";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const getColumnLabel = (index: number): string => {
  return String.fromCharCode(65 + index);
};

const range = (len: number) => Array.from({ length: len }, (_, i) => i);

const createEmptyCell = () => "";

const makeEmptyData = (rows: number, cols: number) => {
  return range(rows).map(() => {
    const rowData: Record<string, string> = {};
    for (let i = 0; i < cols; i++) {
      rowData[getColumnLabel(i)] = createEmptyCell();
    }
    return rowData;
  });
};

export default function Page() {
  const COLUMNS_COUNT = 26;
  const DEFAULT_ROWS_COUNT = 100;

  const [rowData] = useState(() =>
    makeEmptyData(DEFAULT_ROWS_COUNT, COLUMNS_COUNT)
  );

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
      headerName: getColumnLabel(i),
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

      <div
        className="ag-theme-alpine flex-1"
        style={{ overflowX: "hidden", height: "100%", minHeight: "500px" }}
      >
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
      <style jsx global>{`
        .ag-theme-alpine {
          --ag-border-color: transparent;
          --ag-row-border-width: 0px;
          --ag-cell-horizontal-border: 1px solid #e0e0e0;
          --ag-grid-size: 4px;
          --ag-list-item-height: 24px;
        }
        .ag-theme-alpine .ag-cell {
          border-top: none;
          border-left: none;
          border-right: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          padding: 0 4px;
          height: 24px;
          line-height: 24px;
        }
        .ag-theme-alpine .ag-header-cell {
          border-top: none;
          border-left: none;
          border-right: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          background-color: #f8f9fa;
          color: #5f6368;
          font-weight: 500;
          height: 24px !important;
        }
        .ag-theme-alpine .ag-row {
          border: none;
          height: 24px !important;
        }
        .ag-theme-alpine .ag-cell-focus {
          border: 2px solid #1a73e8 !important;
          outline: none;
        }
        .ag-theme-alpine .ag-cell-wrapper {
          height: 24px;
          line-height: 24px;
        }
        .ag-theme-alpine .ag-cell-value {
          height: 24px;
          line-height: 24px;
        }
      `}</style>
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
        className="w-full h-full focus:outline-none bg-transparent px-1 py-0"
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          height: "24px",
          lineHeight: "24px",
          boxSizing: "border-box",
        }}
      />
      <VeltCommentBubble targetElementId={cellId} />
    </div>
  );
});
