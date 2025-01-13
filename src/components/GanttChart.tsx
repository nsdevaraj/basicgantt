import React from 'react';

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

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  // Find the earliest and latest dates
  const dates = tasks.flatMap(task => [new Date(task.startDate), new Date(task.endDate)]);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Calculate total days for the chart
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Create array of months between min and max date
  const months: Date[] = [];
  let currentDate = new Date(minDate);
  currentDate.setDate(1); // Start from first of the month
  
  while (currentDate <= maxDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Group tasks by ID
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.id]) {
      acc[task.id] = [];
    }
    acc[task.id].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

  // Function to calculate position percentage
  const getPositionPercentage = (date: string) => {
    const taskDate = new Date(date);
    return ((taskDate.getTime() - minDate.getTime()) / (maxDate.getTime() - minDate.getTime())) * 100;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Header with months */}
        <div className="flex border-b border-gray-200 mb-2">
          <div className="w-32 flex-shrink-0 px-4 py-2 font-semibold">Stage</div>
          <div className="flex-1">
            <div className="flex">
              {months.map((month, index) => {
                const nextMonth = new Date(month);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                const daysInMonth = Math.min(
                  32 - new Date(month.getFullYear(), month.getMonth(), 32).getDate(),
                  Math.ceil((maxDate.getTime() - month.getTime()) / (1000 * 60 * 60 * 24))
                );
                const widthPercentage = (daysInMonth / totalDays) * 100;
                
                return (
                  <div
                    key={month.toISOString()}
                    className="border-l border-gray-200 py-2 text-sm font-medium text-gray-600"
                    style={{ width: `${widthPercentage}%` }}
                  >
                    {month.toLocaleString('default', { month: 'short', year: '2-digit' })}
                  </div>
                );
              })}
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
              {/* Grid lines for months */}
              <div className="absolute inset-0 flex">
                {months.map((month) => (
                  <div
                    key={month.toISOString()}
                    className="h-full border-l border-gray-200"
                    style={{
                      width: `${(new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() / totalDays) * 100}%`
                    }}
                  />
                ))}
              </div>
              
              {/* Task bars */}
              {tasksInGroup.map((task, index) => {
                const startPercentage = getPositionPercentage(task.startDate);
                const endPercentage = getPositionPercentage(task.endDate);
                const width = endPercentage - startPercentage;
                
                return (
                  <div
                    key={`${task.id}-${task.startDate}-${task.endDate}`}
                    className="absolute h-6 top-1 rounded group"
                    style={{
                      left: `${startPercentage}%`,
                      width: `${width}%`,
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
  );
};

export default GanttChart;
