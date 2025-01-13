import React, { useState } from 'react';

interface Task {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
}

interface GanttChartProps {
  tasks: Task[];
  totalDays: number;
}

type ZoomLevel = 'day' | 'week' | 'month';

const COLUMN_WIDTH = {
  day: 50,    // 50px per day
  week: 200,  // 200px per week
  month: 300  // 300px per month
};

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month');

  // Find the earliest and latest dates
  const dates = tasks.flatMap(task => [new Date(task.startDate), new Date(task.endDate)]);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Calculate total days for the chart
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Function to generate time units based on zoom level
  const generateTimeUnits = () => {
    const units: Date[] = [];
    let currentDate = new Date(minDate);
    currentDate.setHours(0, 0, 0, 0);

    if (zoomLevel === 'month') {
      currentDate.setDate(1);
      while (currentDate <= maxDate) {
        units.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    } else if (zoomLevel === 'week') {
      currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday
      while (currentDate <= maxDate) {
        units.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 7);
      }
    } else {
      while (currentDate <= maxDate) {
        units.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return units;
  };

  const timeUnits = generateTimeUnits();

  // Group tasks by ID
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.id]) {
      acc[task.id] = [];
    }
    acc[task.id].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

  // Function to calculate position in pixels
  const getPositionPixels = (date: string) => {
    const taskDate = new Date(date);
    let position = 0;
    let currentDate = new Date(minDate);

    if (zoomLevel === 'month') {
      while (currentDate < taskDate) {
        if (currentDate.getMonth() === taskDate.getMonth() && currentDate.getFullYear() === taskDate.getFullYear()) {
          position += (taskDate.getDate() / new Date(taskDate.getFullYear(), taskDate.getMonth() + 1, 0).getDate()) * COLUMN_WIDTH.month;
          break;
        }
        position += COLUMN_WIDTH.month;
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    } else if (zoomLevel === 'week') {
      const daysDiff = Math.floor((taskDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      position = Math.floor(daysDiff / 7) * COLUMN_WIDTH.week;
      position += (daysDiff % 7) * (COLUMN_WIDTH.week / 7);
    } else {
      const daysDiff = Math.floor((taskDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      position = daysDiff * COLUMN_WIDTH.day;
    }

    return position;
  };

  // Function to format time unit label
  const formatTimeUnitLabel = (date: Date) => {
    switch (zoomLevel) {
      case 'month':
        return date.toLocaleString('default', { month: 'short', year: '2-digit' });
      case 'week':
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case 'day':
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
      default:
        return '';
    }
  };

  // Calculate total width of the chart
  const getTotalWidth = () => {
    switch (zoomLevel) {
      case 'month':
        return timeUnits.length * COLUMN_WIDTH.month;
      case 'week':
        return timeUnits.length * COLUMN_WIDTH.week;
      case 'day':
        return timeUnits.length * COLUMN_WIDTH.day;
      default:
        return 0;
    }
  };

  const totalWidth = getTotalWidth();

  return (
    <div>
      {/* Zoom controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setZoomLevel('day')}
          className={`px-4 py-2 rounded ${
            zoomLevel === 'day'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setZoomLevel('week')}
          className={`px-4 py-2 rounded ${
            zoomLevel === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setZoomLevel('month')}
          className={`px-4 py-2 rounded ${
            zoomLevel === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Month
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <div style={{ width: `${totalWidth + 128}px` }}>
          {/* Header with time units */}
          <div className="flex border-b border-gray-200 mb-2">
            <div className="w-32 flex-shrink-0 px-4 py-2 font-semibold">Stage</div>
            <div className="flex-1">
              <div className="flex">
                {timeUnits.map((unit) => (
                  <div
                    key={unit.toISOString()}
                    className="border-l border-gray-200 py-2 text-sm font-medium text-gray-600"
                    style={{ width: COLUMN_WIDTH[zoomLevel] }}
                  >
                    {formatTimeUnitLabel(unit)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks */}
          {Object.entries(groupedTasks).map(([id, tasksInGroup]) => (
            <div key={id} className="flex items-center mb-2">
              <div className="w-32 flex-shrink-0 px-4 py-2 text-sm">
                Stage {id}
              </div>
              <div className="flex-1 relative h-8">
                {/* Grid lines */}
                <div className="absolute inset-0 flex">
                  {timeUnits.map((unit) => (
                    <div
                      key={unit.toISOString()}
                      className="h-full border-l border-gray-200"
                      style={{ width: COLUMN_WIDTH[zoomLevel] }}
                    />
                  ))}
                </div>
                
                {/* Task bars */}
                {tasksInGroup.map((task, index) => {
                  const startPosition = getPositionPixels(task.startDate);
                  const endPosition = getPositionPixels(task.endDate);
                  const width = endPosition - startPosition;
                  
                  return (
                    <div
                      key={`${task.id}-${task.startDate}-${task.endDate}`}
                      className="absolute h-6 top-1 rounded group"
                      style={{
                        left: startPosition,
                        width: width,
                        backgroundColor: task.color,
                        top: `${index * 8}px`,
                      }}
                    >
                      <div className="relative">
                        <span className="text-xs text-white px-2 truncate block leading-6">
                          {task.name}
                        </span>
                        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 left-0 -bottom-8 whitespace-nowrap z-10">
                          {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
