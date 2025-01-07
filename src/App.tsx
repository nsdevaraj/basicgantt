import React from 'react';
import GanttChart from './components/GanttChart';

const tasks = [
  { id: 1, name: 'Dolor sit amet', startDay: 2, endDay: 6, color: '#EF4444' },
  { id: 1, name: 'Dolor sit amet2', startDay: 8, endDay: 16, color: '#EF4444' },
  { id: 2, name: 'Consectetur', startDay: 4, endDay: 25, color: '#F97316' },
  { id: 3, name: 'Sed do eiusmod', startDay: 2, endDay: 8, color: '#EAB308' },
  { id: 4, name: 'Sed tempor incididunt', startDay: 22, endDay: 30, color: '#94A3B8' },
  { id: 5, name: 'Incididunt', startDay: 5, endDay: 23, color: '#84CC16' },
  { id: 6, name: 'Ut labore', startDay: 12, endDay: 20, color: '#A855F7' },
  { id: 7, name: 'Et dolore', startDay: 8, endDay: 12, color: '#0EA5E9' },
  { id: 8, name: 'Aliqua et quis', startDay: 15, endDay: 28, color: '#CBD5E1' },
  { id: 9, name: 'Ut enim', startDay: 4, endDay: 18, color: '#65A30D' },
  { id: 10, name: 'Ad minim', startDay: 18, endDay: 26, color: '#0EA5E9' },
  { id: 11, name: 'Veniam quis', startDay: 28, endDay: 30, color: '#EF4444' },
  { id: 12, name: 'Exercitation', startDay: 25, endDay: 30, color: '#1E40AF' },
  { id: 13, name: 'Laboris nisi', startDay: 2, endDay: 15, color: '#EF4444' },
  { id: 14, name: 'Ut aliquip', startDay: 18, endDay: 28, color: '#EAB308' },
  { id: 15, name: 'Duis aute irure', startDay: 25, endDay: 30, color: '#EF4444' },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Project Timeline 2017</h1>
        <GanttChart tasks={tasks} totalDays={30} />
      </div>
    </div>
  );
}

export default App;