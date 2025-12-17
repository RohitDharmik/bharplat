import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ArrowUpRight } from 'lucide-react';

// Data
const revenueData = [12000, 15000, 11000, 18000, 22000, 35000, 28000];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const pieData = [
  { name: 'Dine-in', y: 400 },
  { name: 'Takeaway', y: 300 },
  { name: 'Delivery', y: 300 },
  { name: 'Events', y: 200 },
];

const COLORS = ['#D4AF37', '#AA8C2C', '#F4E08F', '#665D1E'];

// Shared Highcharts theme options for the dashboard
const commonOptions: Highcharts.Options = {
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'Inter, sans-serif'
    }
  },
  title: {
    text: undefined,
    style: {
      color: '#ffffff'
    }
  },
  credits: {
    enabled: false
  },
  tooltip: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    style: {
      color: '#ffffff'
    },
    borderRadius: 8
  },
  legend: {
    itemStyle: {
      color: '#A3A3A3'
    },
    itemHoverStyle: {
      color: '#D4AF37'
    }
  }
};

export const StatCard: React.FC<{ title: string; value: string; trend: string; icon: any }> = ({ title, value, trend, icon: Icon }) => (
  <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-gold-500/30 transition-all duration-300">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={48} className="text-gold-500" />
    </div>
    <div className="relative z-10">
      <p className="text-sm text-neutral-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <div className="flex items-center text-xs text-green-400 font-medium">
        <ArrowUpRight size={14} className="mr-1" />
        {trend} vs last month
      </div>
    </div>
  </div>
);

export const RevenueChart = () => {
  const options: Highcharts.Options = {
    ...commonOptions,
    chart: {
      ...commonOptions.chart,
      type: 'column',
      height: 320
    },
    xAxis: {
      categories: days,
      lineColor: '#333',
      tickColor: '#333',
      labels: {
        style: {
          color: '#888'
        }
      }
    },
    yAxis: {
      title: { text: null },
      gridLineColor: '#333',
      gridLineDashStyle: 'Dash',
      labels: {
        style: {
          color: '#888'
        },
        formatter: function() {
          return '₹' + this.value;
        }
      }
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        borderWidth: 0
      }
    },
    series: [{
      name: 'Revenue',
      type: 'column',
      data: revenueData,
      color: '#D4AF37',
      showInLegend: false,
      tooltip: {
        valuePrefix: '₹'
      }
    }]
  };

  return (
    <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6 h-[400px]">
      <h3 className="text-lg font-semibold text-white mb-6">Weekly Revenue</h3>
      <div className="h-full">
         <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export const OccupancyChart = () => {
  const options: Highcharts.Options = {
    ...commonOptions,
    chart: {
      ...commonOptions.chart,
      type: 'pie',
      height: 320
    },
    plotOptions: {
      pie: {
        innerSize: '60%', // Donut chart
        borderWidth: 0,
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    colors: COLORS,
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        color: '#A3A3A3',
        fontWeight: 'normal'
      }
    },
    series: [{
      name: 'Orders',
      type: 'pie',
      data: pieData
    }]
  };

  return (
    <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6 h-[400px]">
      <h3 className="text-lg font-semibold text-white mb-6">Sales Distribution</h3>
       <div className="h-full">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};