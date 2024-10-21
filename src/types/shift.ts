export interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  room: {
    id: number;
    name: string;
  };
}
