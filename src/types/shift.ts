export interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
  room: {
    id: number;
    name: string;
  };
}
