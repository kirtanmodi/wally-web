import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface YearlyBreakdownItem {
  year: number;
  actualYear: number;
  monthlyInvestment: number;
  investment: number;
  totalInvested: number;
  interest: number;
  balance: number;
}

interface DataType extends YearlyBreakdownItem {
  key: string;
}

interface YearlyBreakdownTableProps {
  yearlyBreakdown: YearlyBreakdownItem[];
}

export function YearlyBreakdownTable({ yearlyBreakdown }: YearlyBreakdownTableProps) {
  const columns: ColumnsType<DataType> = [
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
      title: "Monthly Investment",
      dataIndex: "monthlyInvestment",
      key: "monthlyInvestment",
      align: "right",
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Investment Amount",
      dataIndex: "investment",
      key: "investment",
      align: "right",
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Total Invested",
      dataIndex: "totalInvested",
      key: "totalInvested",
      align: "right",
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Returns",
      dataIndex: "interest",
      key: "interest",
      align: "right",
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      align: "right",
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Yearly Breakdown</h3>
      <Table
        columns={columns}
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
