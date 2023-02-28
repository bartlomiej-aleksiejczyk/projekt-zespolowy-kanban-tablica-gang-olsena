const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show' },
    'task-3': { id: 'task-3', content: 'Charge my phone' },
    'task-4': { id: 'task-4', content: 'Cook dinner' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      limit:"nieskończoność" ,
      title: 'Backlog',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      limit:6 ,
      title: 'Next',
      taskIds: ['task-2'],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2'],
  indeksy: 2,
};

export default initialData;
