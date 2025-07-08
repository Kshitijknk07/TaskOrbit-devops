export class Task {
  [key: string]: unknown;
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string; // ISO date string
  assignedTo: string; // user id
}
