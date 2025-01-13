import React from 'react';
import GanttChart from './components/GanttChart';

const tasks = [
  {
    id: 1,
    name: 'Dolor sit amet', 
    color: '#EF4444',
    startDate: '2025-05-21',
    endDate: '2025-08-23'
  },
  {
    id: 1,
    name: 'Dolor sit amet2', 
    color: '#EF4444',
    startDate: '2025-07-01',
    endDate: '2025-12-24'
  },
  {
    id: 2,
    name: 'Consectetur',
    color: '#F97316',
    startDate: '2025-02-03',
    endDate: '2025-05-03'
  },
  {
    id: 3,
    name: 'Sed do eiusmod',
    color: '#EAB308',
    startDate: '2025-04-25',
    endDate: '2025-11-06'
  },
  {
    id: 4,
    name: 'Sed tempor incididunt',
    color: '#94A3B8',
    startDate: '2025-12-19',
    endDate: '2025-12-22'
  },
  {
    id: 5,
    name: 'Incididunt',
    color: '#84CC16',
    startDate: '2025-12-18',
    endDate: '2025-12-28'
  },
  {
    id: 6,
    name: 'Ut labore',
    color: '#A855F7',
    startDate: '2025-11-30',
    endDate: '2025-12-12'
  },
  {
    id: 7,
    name: 'Et dolore',
    color: '#0EA5E9',
    startDate: '2025-04-02',
    endDate: '2025-12-19'
  },
  {
    id: 8,
    name: 'Aliqua et quis',
    color: '#CBD5E1',
    startDate: '2025-03-30',
    endDate: '2025-04-03'
  },
  {
    id: 9,
    name: 'Ut enim',
    color: '#65A30D',
    startDate: '2025-10-20',
    endDate: '2025-12-14'
  },
  {
    id: 10,
    name: 'Ad minim',
    color: '#0EA5E9',
    startDate: '2025-04-13',
    endDate: '2025-05-03'
  },
  {
    id: 11,
    name: 'Veniam quis', 
    color: '#EF4444',
    startDate: '2025-04-01',
    endDate: '2025-08-06'
  },
  {
    id: 12,
    name: 'Exercitation', 
    color: '#1E40AF',
    startDate: '2025-04-06',
    endDate: '2025-05-31'
  },
  {
    id: 13,
    name: 'Laboris nisi', 
    color: '#EF4444',
    startDate: '2025-08-26',
    endDate: '2025-10-31'
  },
  {
    id: 14,
    name: 'Ut aliquip',
    color: '#EAB308',
    startDate: '2025-08-16',
    endDate: '2025-10-12'
  },
  {
    id: 15,
    name: 'Duis aute irure',
    color: '#EF4444',
    startDate: '2025-04-30',
    endDate: '2025-12-17'
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Project Timeline 2025</h1>
        <GanttChart tasks={tasks} totalDays={30} />
      </div>
    </div>
  );
}

export default App;
