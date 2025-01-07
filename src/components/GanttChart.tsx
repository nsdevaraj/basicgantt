import React from 'react';

interface Task {
  id: number;
  name: string;
  startDay: number;
  endDay: number;
  color: string;
}

interface GanttChartProps {
  tasks: Task[];
  totalDays: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, totalDays }) => {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Group tasks by ID
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.id]) {
      acc[task.id] = [];
    }
    acc[task.id].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Header with days */}
        <div className="flex border-b border-gray-200 mb-2">
          <div className="w-32 flex-shrink-0 px-4 py-2 font-semibold">Stage</div>
          <div className="flex-1 flex">
            {days.map((day) => (
              <div
                key={day}
                className="flex-1 px-1 text-center text-sm text-gray-600"
              >
                {day}
              </div>
            ))}
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
                {days.map((day) => (
                  <div
                    key={day}
                    className="flex-1 border-l border-gray-200 last:border-r"
                  />
                ))}
              </div>
              
              {/* Task bars */}
              {tasksInGroup.map((task, index) => (
                <div
                  key={`${task.id}-${task.startDay}-${task.endDay}`}
                  className="absolute h-6 top-1 rounded"
                  style={{
                    left: `${((task.startDay - 1) / totalDays) * 100}%`,
                    width: `${((task.endDay - task.startDay + 1) / totalDays) * 100}%`,
                    backgroundColor: task.color,
                    top: `${index * 8}px`, // Update the top position for each task bar
                  }}
                >
                  <span className="text-xs text-white px-2 truncate block leading-6">
                    {task.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;