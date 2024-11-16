export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  course_id: number;
  created_at: string;
  updated_at: string;
}
