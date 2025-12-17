import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { StatCard } from '../ui/DashboardWidgets';
import { DollarSign, Users, Map, ShoppingBag } from 'lucide-react';

const regionData = [
    { name: 'North Zone', y: 450000 },
    { name: 'South Zone', y: 320000 },
    { name: 'East Zone', y: 150000 },
    { name: 'West Zone', y: 580000 },
];

const subscriptionData = [
    { name: 'Basic', y: 45 },
    { name: 'Premium', y: 120 },
    { name: 'Enterprise', y: 15 },
];

export const SuperAdminDashboard: React.FC = () => {
    const regionChartOptions: Highcharts.Options = {
        chart: {
            backgroundColor: 'transparent',
            type: 'bar',
            style: { fontFamily: 'Inter, sans-serif' }
        },
        title: { text: undefined },
        xAxis: {
            categories: regionData.map(d => d.name),
            labels: { style: { color: '#ffffff' } },
            lineColor: '#333'
        },
        yAxis: {
            title: { text: 'Revenue (₹)', style: { color: '#888' } },
            gridLineColor: '#333',
            labels: { style: { color: '#888' } }
        },
        series: [{
            type: 'bar',
            name: 'Revenue',
            data: regionData,
            color: '#D4AF37'
        }],
        legend: { enabled: false },
        credits: { enabled: false }
    };

    const subChartOptions: Highcharts.Options = {
        chart: {
            backgroundColor: 'transparent',
            type: 'pie',
            style: { fontFamily: 'Inter, sans-serif' }
        },
        title: { text: undefined },
        plotOptions: {
            pie: {
                innerSize: '50%',
                dataLabels: { enabled: false },
                showInLegend: true,
                borderWidth: 0
            }
        },
        series: [{
            type: 'pie',
            name: 'Subscriptions',
            data: subscriptionData
        }],
        legend: { itemStyle: { color: '#A3A3A3' } },
        credits: { enabled: false },
        colors: ['#665D1E', '#D4AF37', '#F4E08F']
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-neutral-400 uppercase tracking-wide">Network Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Network Revenue" value="₹1.5M" trend="+18%" icon={DollarSign} />
                <StatCard title="Total Outlets" value="180" trend="+5" icon={Map} />
                <StatCard title="Total Subscribers" value="165" trend="+12" icon={Users} />
                <StatCard title="Active Queries" value="24" trend="-2" icon={ShoppingBag} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Region-wise Sales</h3>
                    <HighchartsReact highcharts={Highcharts} options={regionChartOptions} />
                </div>
                <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Subscription Distribution</h3>
                    <HighchartsReact highcharts={Highcharts} options={subChartOptions} />
                </div>
            </div>

            <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Online Queries</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-neutral-400 text-sm">
                                <th className="p-3">ID</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Outlet</th>
                                <th className="p-3">Issue</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-white/5">
                                <td className="p-3 font-mono">#Q1024</td>
                                <td className="p-3 text-white">Rahul K.</td>
                                <td className="p-3">Indore Central</td>
                                <td className="p-3">Payment Failed</td>
                                <td className="p-3"><span className="text-red-400 bg-red-400/10 px-2 py-1 rounded">Critical</span></td>
                                <td className="p-3 text-right"><button className="text-gold-500 hover:underline">Resolve</button></td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="p-3 font-mono">#Q1025</td>
                                <td className="p-3 text-white">Simran S.</td>
                                <td className="p-3">Mumbai South</td>
                                <td className="p-3">Menu Update</td>
                                <td className="p-3"><span className="text-green-400 bg-green-400/10 px-2 py-1 rounded">Open</span></td>
                                <td className="p-3 text-right"><button className="text-gold-500 hover:underline">Resolve</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};