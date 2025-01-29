"use client";

import { Tabs } from "antd";
import SIPCalculator from "./components/SIPCalculator";
import { FaCalculator, FaChartLine, FaInfoCircle } from "react-icons/fa";

const { TabPane } = Tabs;

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
                key: "calculator",
                label: (
                  <span className="flex items-center gap-2">
                    <FaCalculator />
                    SIP Calculator
                  </span>
                ),
                children: <SIPCalculator />,
              },
              {
                key: "comparison",
                label: (
                  <span className="flex items-center gap-2">
                    <FaChartLine />
                    Investment Comparison
                  </span>
                ),
                children: <div className="p-8 text-center text-gray-600">Investment comparison tools coming soon</div>,
              },
              {
                key: "about",
                label: (
                  <span className="flex items-center gap-2">
                    <FaInfoCircle />
                    About
                  </span>
                ),
                children: (
                  <div className="p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About SIP Calculator</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our SIP (Systematic Investment Plan) calculator helps you estimate the potential returns on your mutual fund investments. Enter
                      your monthly investment amount, expected return rate, and investment duration to get detailed insights into your investment
                      growth.
                    </p>
                  </div>
                ),
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
