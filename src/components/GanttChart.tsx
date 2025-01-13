import React, { useState } from 'react';

interface Task {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  children?: Task[];
}

interface GanttChartProps {
  tasks: Task[];
  totalDays: number;
}

type ZoomLevel = 'day' | 'week' | 'month' | 'quarter' | 'year';

const COLUMN_WIDTH = {
  day: 50,      // 50px per day
  week: 200,    // 200px per week
  month: 300,   // 300px per month
  quarter: 400, // 400px per quarter
  year: 600     // 600px per year
};

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month');
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set(tasks.map(t => t.id)));

  // Function to toggle task expansion
  const toggleTask = (taskId: number) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  // Flatten tasks for display while maintaining hierarchy information
  const flattenTasks = (tasks: Task[], level = 0, parentId?: number): { task: Task; level: number; parentId?: number }[] => {
    return tasks.flatMap(task => {
      const result = [{ task, level, parentId }];
      if (task.children && task.children.length > 0 && expandedTasks.has(task.id)) {
        result.push(...flattenTasks(task.children, level + 1, task.id));
      }
      return result;
    });
  };

  const flattenedTasks = flattenTasks(tasks);

  // Find the earliest and latest dates
  const dates = flattenedTasks.flatMap(({ task }) => [new Date(task.startDate), new Date(task.endDate)]);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Calculate total days for the chart
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Function to get quarter from date
  const getQuarter = (date: Date) => {
    return Math.floor(date.getMonth() / 3) + 1;
  };

  // Function to generate time units based on zoom level
  const generateTimeUnits = () => {
    const units: Date[] = [];
    let currentDate = new Date(minDate);
    currentDate.setHours(0, 0, 0, 0);

    switch (zoomLevel) {
      case 'year':
        currentDate.setMonth(0, 1);
        while (currentDate <= maxDate) {
          units.push(new Date(currentDate));
          currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
        break;
      case 'quarter':
        currentDate.setMonth(Math.floor(currentDate.getMonth() / 3) * 3, 1);
        while (currentDate <= maxDate) {
          units.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 3);
        }
        break;
      case 'month':
        currentDate.setDate(1);
        while (currentDate <= maxDate) {
          units.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        break;
      case 'week':
        currentDate.setDate(currentDate.getDate() - currentDate.getDay());
        while (currentDate <= maxDate) {
          units.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 7);
        }
        break;
      case 'day':
        while (currentDate <= maxDate) {
          units.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        break;
    }

    return units;
  };

  const timeUnits = generateTimeUnits();

  // Function to calculate position in pixels
  const getPositionPixels = (date: string) => {
    const taskDate = new Date(date);
    let position = 0;
    let currentDate = new Date(minDate);

    switch (zoomLevel) {
      case 'year':
        const yearDiff = taskDate.getFullYear() - currentDate.getFullYear();
        const yearProgress = (taskDate.getTime() - new Date(taskDate.getFullYear(), 0, 1).getTime()) / 
                           (new Date(taskDate.getFullYear() + 1, 0, 1).getTime() - new Date(taskDate.getFullYear(), 0, 1).getTime());
        position = yearDiff * COLUMN_WIDTH.year + yearProgress * COLUMN_WIDTH.year;
        break;
      case 'quarter':
        while (currentDate < taskDate) {
          if (getQuarter(currentDate) === getQuarter(taskDate) && currentDate.getFullYear() === taskDate.getFullYear()) {
            const quarterStart = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
            const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
            const progressInQuarter = (taskDate.getTime() - quarterStart.getTime()) / (quarterEnd.getTime() - quarterStart.getTime());
            position += progressInQuarter * COLUMN_WIDTH.quarter;
            break;
          }
          position += COLUMN_WIDTH.quarter;
          currentDate.setMonth(currentDate.getMonth() + 3);
        }
        break;
      case 'month':
        while (currentDate < taskDate) {
          if (currentDate.getMonth() === taskDate.getMonth() && currentDate.getFullYear() === taskDate.getFullYear()) {
            position += (taskDate.getDate() / new Date(taskDate.getFullYear(), taskDate.getMonth() + 1, 0).getDate()) * COLUMN_WIDTH.month;
            break;
          }
          position += COLUMN_WIDTH.month;
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        break;
      case 'week':
        const daysDiff = Math.floor((taskDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
        position = Math.floor(daysDiff / 7) * COLUMN_WIDTH.week;
        position += (daysDiff % 7) * (COLUMN_WIDTH.week / 7);
        break;
      case 'day':
        const days = Math.floor((taskDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
        position = days * COLUMN_WIDTH.day;
        break;
    }

    return position;
  };

  // Function to format time unit label
  const formatTimeUnitLabel = (date: Date) => {
    switch (zoomLevel) {
      case 'year':
        return date.getFullYear().toString();
      case 'quarter':
        return `Q${getQuarter(date)} ${date.getFullYear()}`;
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
    return timeUnits.length * COLUMN_WIDTH[zoomLevel];
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
        <button
          onClick={() => setZoomLevel('quarter')}
          className={`px-4 py-2 rounded ${
            zoomLevel === 'quarter'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Quarter
        </button>
        <button
          onClick={() => setZoomLevel('year')}
          className={`px-4 py-2 rounded ${
            zoomLevel === 'year'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Year
        </button>
      </div>

      <div className="relative">
        {/* Fixed Stage column */}
        <div className="absolute left-0 top-0 w-48 bg-white z-10">
          <div className="border-b border-gray-200 mb-2">
            <div className="px-4 py-2 font-semibold">Task</div>
          </div>
          {flattenedTasks.map(({ task, level }) => (
            <div
              key={task.id}
              className="px-4 py-2 text-sm h-8 flex items-center hover:bg-gray-50 cursor-pointer"
              style={{ paddingLeft: `${level * 20 + 16}px` }}
              onClick={() => task.children?.length && toggleTask(task.id)}
            >
              {task.children && task.children.length > 0 && (
                <span className="mr-2">{expandedTasks.has(task.id) ? '▼' : '▶'}</span>
              )}
              {task.name}
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="w-full overflow-x-auto">
          <div style={{ width: `${totalWidth + 128}px`, marginLeft: '12rem' }}>
            {/* Header with time units */}
            <div className="flex border-b border-gray-200 mb-2">
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
            {flattenedTasks.map(({ task }, index) => (
              <div key={task.id} className="flex items-center mb-2">
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
                  
                  {/* Task bar */}
                  <div
                    className="absolute h-6 top-1 rounded group"
                    style={{
                      left: getPositionPixels(task.startDate),
                      width: Math.max(getPositionPixels(task.endDate) - getPositionPixels(task.startDate), 4),
                      backgroundColor: task.color,
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
