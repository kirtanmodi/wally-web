import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface YearlyBreakdownItem {
  year: number;
  actualYear: number;
  monthlyInvestment?: number;
  monthlyWithdrawal?: number;
  investment?: number;
  totalInvested?: number;
  totalWithdrawals?: number;
  interest?: number;
  balance: number;
}

interface DataType extends YearlyBreakdownItem {
  key: string;
}

interface YearlyBreakdownTableProps {
  yearlyBreakdown: YearlyBreakdownItem[];
  type: "sip" | "swp";
  title?: string;
}

export function YearlyBreakdownTable({ 
  yearlyBreakdown, 
  type, 
  title = "Yearly Breakdown"
}: YearlyBreakdownTableProps) {
  const getColumns = (): ColumnsType<DataType> => {
    const baseColumns: ColumnsType<DataType> = [
      {
        title: "Year",
        dataIndex: "actualYear",
        key: "actualYear",
        align: "center",
        width: 100,
        render: (value: number, record: DataType, index: number) => {
          const date = new Date();
          date.setFullYear(record.actualYear);
          const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          return `${formattedDate} (Y${index + 1})`;
        },
        fixed: "left",
      },
      {
        title: "Balance",
        dataIndex: "balance",
        key: "balance",
        align: "right",
        width: 100,
        render: (value: number) => `₹${value.toLocaleString()}`,
      },
    ];

    const sipColumns: ColumnsType<DataType> = [
      {
        title: "Monthly Inv.",
        dataIndex: "monthlyInvestment",
        key: "monthlyInvestment",
        align: "right",
        width: 100,
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
      {
        title: "Inv. Amount",
        dataIndex: "investment",
        key: "investment",
        align: "right",
        width: 100,
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
      {
        title: "Total Inv.",
        dataIndex: "totalInvested",
        key: "totalInvested",
        align: "right",
        width: 100,
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
      {
        title: "Returns",
        dataIndex: "interest",
        key: "interest",
        align: "right",
        width: 100,
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
    ];

    const swpColumns: ColumnsType<DataType> = [
      {
        title: "Monthly Withd.",
        dataIndex: "monthlyWithdrawal",
        key: "monthlyWithdrawal",
        align: "right",
        width: 100,
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
      {
        title: "Total Withd.",
        dataIndex: "totalWithdrawals",
        key: "totalWithdrawals",
        align: "right",
        width: 100,
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
    ];

    // Insert type-specific columns before the Balance column
    baseColumns.splice(1, 0, ...(type === "sip" ? sipColumns : swpColumns));
    return baseColumns;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={getColumns()}
          dataSource={yearlyBreakdown.map((item) => ({
            ...item,
            key: item.year.toString(),
          }))}
          pagination={false}
          scroll={{ x: "max-content", y: 400 }}
          className="bg-white rounded-lg [&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-gray-200 [&_.ant-table-tbody>tr:hover>td]:bg-gray-50"
        />
      </div>
    </div>
  );
}
