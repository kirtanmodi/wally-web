"use client";

import { Tabs } from "antd";

import { FaCalculator, FaChartLine } from "react-icons/fa";
import SIPCalculator from "./sip/page";
import SWPCalculator from "./swp/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Financial Planning Tools</h1>
          <p className="text-gray-600 text-base sm:text-lg">Make informed investment decisions</p>
        </div>

        {/* Main Content with Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs
            defaultActiveKey="calculator"
            className="custom-tabs"
            centered
            items={[
              {
                key: "sip",
                label: (
                  <span className="flex items-center">
                    <FaCalculator />
                    SIP Calculator
                  </span>
                ),
                children: <SIPCalculator />,
              },
              {
                key: "lumpsum",
                label: (
                  <span className="flex items-center">
                    <FaChartLine />
                    Lump Sum Calculator
                  </span>
                ),
                children: <div className="p-8 text-center text-gray-600">Lump Sum Calculator coming soon</div>,
              },
              {
                key: "swp",
                label: (
                  <span className="flex items-center">
                    <FaChartLine />
                    SWP Calculator
                  </span>
                ),
                children: <SWPCalculator />,
              },
            ]}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">© {new Date().getFullYear()} Financial Planning Tools. All rights reserved.</p>
        </div>
      </footer>

      <style jsx global>{`
        .custom-tabs .ant-tabs-nav {
          margin-bottom: 2rem;
        }

        .custom-tabs .ant-tabs-tab {
          padding: 12px 24px;
          font-size: 1rem;
          color: #4b5563;
        }

        .custom-tabs .ant-tabs-tab-active {
          color: #2563eb;
        }

        .custom-tabs .ant-tabs-ink-bar {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
}
