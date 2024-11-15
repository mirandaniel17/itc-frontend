export interface Course {
  id: number;
  name: string;
  parallel: string;
  description: string;
  start_date: string;
  end_date: string | null;
  teacher_id: number;
  modality_id: number;
  created_at: string;
  updated_at: string;
  cost: number;
  teacher: {
    id: number;
    last_name: string;
    second_last_name: string;
    name: string;
    ci: string;
  };
  modality: {
    id: number;
    name: string;
    duration_in_months: number;
  };
}
