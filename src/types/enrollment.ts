export interface Enrollment {
  id: number;
  student: {
    id: number;
    name: string;
    last_name: string;
    second_last_name: string;
  };
  course: {
    id: number;
    name: string;
  };
  enrollment_date: string;
  document_1: string;
  document_2: string;
  payment_status?: string;
}
