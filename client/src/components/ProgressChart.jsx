import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale,
  zoomPlugin
);

const getSeverityColor = (score) => {
  if (score >= 7) return '#ef4444'; // red-500
  if (score >= 4) return '#f59e0b'; // yellow-500
  return '#10b981'; // green-500
};

export default function ProgressChart({ data, timeRange = 'month' }) {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // Filter data based on time range
  const filterDataByTimeRange = (data, range) => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (range) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default: // 'all' or invalid
        return [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    
    return data
      .filter(entry => new Date(entry.timestamp) >= cutoffDate)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const filteredData = filterDataByTimeRange(data, timeRange);
    
    // Calculate average score for the selected time range
    const averageScore = filteredData.reduce((sum, item) => sum + (item.score || 0), 0) / filteredData.length;
    
    // Calculate trend (simple linear regression)
    let trend = 0;
    if (filteredData.length >= 2) {
      const xValues = filteredData.map((_, i) => i);
      const yValues = filteredData.map(item => item.score);
      
      const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
      const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;
      
      let numerator = 0;
      let denominator = 0;
      
      for (let i = 0; i < xValues.length; i++) {
        numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
        denominator += Math.pow(xValues[i] - xMean, 2);
      }
      
      trend = denominator !== 0 ? numerator / denominator : 0;
    }

    const ctx = canvasRef.current.getContext('2d');
    
    // Destroy previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create gradient for the chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.02)');

    // Destroy previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: filteredData.map((entry) => 
          new Date(entry.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        ),
        datasets: [
          {
            label: 'Fear Level',
            data: filteredData.map((entry) => ({
              x: new Date(entry.timestamp),
              y: entry.score,
              severity: entry.severity,
            })),
            borderColor: '#4f46e5',
            backgroundColor: gradient,
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: filteredData.map(entry => getSeverityColor(entry.score)),
            pointBorderColor: '#fff',
            pointHoverRadius: 6,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            fill: true,
          },
          {
            label: 'Average',
            data: filteredData.map(() => averageScore),
            borderColor: '#9ca3af',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            borderDashOffset: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleFont: { size: 14, weight: '500' },
            bodyFont: { size: 14 },
            padding: 12,
            cornerRadius: 8,
            usePointStyle: true,
            callbacks: {
              title: (context) => {
                const date = new Date(context[0].raw.x);
                return date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              },
              label: (context) => {
                const value = context.parsed.y;
                const severity = context.raw.severity || 'No severity data';
                return [
                  `Score: ${value.toFixed(1)}`,
                  `Severity: ${severity.charAt(0).toUpperCase() + severity.slice(1)}`,
                ];
              },
              labelColor: (context) => ({
                borderColor: getSeverityColor(context.raw.y),
                backgroundColor: getSeverityColor(context.raw.y),
                borderWidth: 2,
                borderRadius: 2,
              }),
            },
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
              onZoomComplete: ({ chart }) => {
                // This prevents the chart from getting stuck in a zoomed state
                chart.update('none');
              },
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: timeRange === 'week' ? 'day' : timeRange === 'year' ? 'month' : 'week',
              tooltipFormat: 'MMM d, yyyy',
              displayFormats: {
                day: 'MMM d',
                week: 'MMM d',
                month: 'MMM yyyy',
              },
            },
            adapters: {
              date: {
                locale: 'en-US',
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              color: '#6b7280',
            },
            border: {
              display: false,
            },
          },
          y: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
              color: '#6b7280',
              callback: (value) => (value % 2 === 0 ? value : ''), // Only show even numbers
            },
            grid: {
              color: 'rgba(229, 231, 235, 0.5)',
              drawBorder: false,
            },
          },
        },
        elements: {
          line: {
            borderJoinStyle: 'round',
          },
          point: {
            hoverRadius: 8,
            hitRadius: 10,
          },
        },
      },
    });

    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, timeRange]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} />
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No data available for the selected time range
        </div>
      )}
    </div>
  );
}