"use client";

import {
	ArcElement,
	CategoryScale,
	Chart as ChartJS,
	CoreScaleOptions,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Scale,
	Title,
	Tooltip,
	TooltipItem,
} from "chart.js";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface YearlyBreakdownItem {
  year: number;
  totalInvested: number;
  balance: number;
  monthlyInvestment: number;
}

interface InvestmentChartsProps {
  yearlyBreakdown: YearlyBreakdownItem[];
}

export const InvestmentCharts = ({ yearlyBreakdown }: InvestmentChartsProps) => {
  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Growth Chart Data
  const growthChartData = {
    labels: yearlyBreakdown.map((data) => `Year ${data.year}`),
    datasets: [
      {
        label: "Total Investment",
        data: yearlyBreakdown.map((data) => data.totalInvested),
        borderColor: "rgb(59, 130, 246)", // Blue
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
      },
      {
        label: "Total Value",
        data: yearlyBreakdown.map((data) => data.balance),
        borderColor: "rgb(16, 185, 129)", // Green
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
      },
    ],
  };

  // Growth Chart Options
  const growthChartOptions = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Investment Growth Over Time",
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<"line">) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, tickValue: string | number) {
            return formatCurrency(Number(tickValue));
          }
        }
      }
    }
  };

  // Distribution Chart Data (for the last year)
  // const lastYearData = yearlyBreakdown[yearlyBreakdown.length - 1];
  // const returns = lastYearData.balance - lastYearData.totalInvested;
  
  // const distributionChartData = {
  //   labels: ["Total Investment", "Total Returns"],
  //   datasets: [
  //     {
  //       data: [lastYearData.totalInvested, returns],
  //       backgroundColor: [
  //         "rgba(59, 130, 246, 0.8)", // Blue
  //         "rgba(16, 185, 129, 0.8)", // Green
  //       ],
  //       borderColor: [
  //         "rgb(59, 130, 246)",
  //         "rgb(16, 185, 129)",
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // // Distribution Chart Options
  // const distributionChartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top" as const,
  //     },
  //     title: {
  //       display: true,
  //       text: "Investment vs Returns Distribution",
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: function(context: TooltipItem<"pie">) {
  //           const label = context.label || "";
  //           const value = context.raw as number;
  //           return `${label}: ${formatCurrency(value)}`;
  //         }
  //       }
  //     }
  //   },
  // };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <Line data={growthChartData} options={growthChartOptions} />
      </div>

      {/* <div className="bg-white p-6 rounded-xl shadow-lg">
        <Pie data={distributionChartData} options={distributionChartOptions} />
      </div> */}
    </motion.div>
  );
}; 