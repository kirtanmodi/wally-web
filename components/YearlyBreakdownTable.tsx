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

export function YearlyBreakdownTable({ yearlyBreakdown, type, title = "Yearly Breakdown" }: YearlyBreakdownTableProps) {
  const getColumns = (): ColumnsType<DataType> => {
    const baseColumns: ColumnsType<DataType> = [
      {
        title: "Year",
        dataIndex: "actualYear",
        key: "actualYear",
        align: "center",
        render: (value: number, record: DataType, index: number) => {
          const date = new Date();
          date.setFullYear(record.actualYear);
          const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          return `${formattedDate} (Year ${index + 1})`;
        },
        fixed: "left",
      },
      {
        title: "Balance",
        dataIndex: "balance",
        key: "balance",
        align: "right",
        render: (value: number) => `₹${value.toLocaleString()}`,
      },
    ];

    const sipColumns: ColumnsType<DataType> = [
      {
        title: "Monthly Investment",
        dataIndex: "monthlyInvestment",
        key: "monthlyInvestment",
        align: "right",
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
      {
        title: "Investment Amount",
        dataIndex: "investment",
        key: "investment",
        align: "right",
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
      {
        title: "Total Invested",
        dataIndex: "totalInvested",
        key: "totalInvested",
        align: "right",
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
      {
        title: "Returns",
        dataIndex: "interest",
        key: "interest",
        align: "right",
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
    ];

    const swpColumns: ColumnsType<DataType> = [
      {
        title: "Monthly Withdrawal",
        dataIndex: "monthlyWithdrawal",
        key: "monthlyWithdrawal",
        align: "right",
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
      {
        title: "Total Withdrawals",
        dataIndex: "totalWithdrawals",
        key: "totalWithdrawals",
        align: "right",
        render: (value: number) => `₹${value?.toLocaleString() ?? 0}`,
      },
    ];

    // Insert type-specific columns before the Balance column
    baseColumns.splice(1, 0, ...(type === "sip" ? sipColumns : swpColumns));
    return baseColumns;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <Table
        columns={getColumns()}
        dataSource={yearlyBreakdown.map((item) => ({
          ...item,
          key: item.year.toString(),
        }))}
        pagination={false}
        scroll={{ y: 400 }}
        className="bg-white rounded-lg [&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-gray-200 [&_.ant-table-tbody>tr:hover>td]:bg-gray-50"
      />
    </div>
  );
}
