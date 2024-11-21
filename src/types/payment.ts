export interface Payment {
  id: number;
  enrollment_id: number;
  amount: number;
  payment_date: string;
  enrollment: {
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
      cost: number;
    };
  };
}
