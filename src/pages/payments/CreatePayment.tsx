import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Layout from "../../components/Layout";
import SubmitButton from "../../components/SubmitButton";
import BackButton from "../../components/BackButton";
import TextInput from "../../components/TextInput";
import InputLabel from "../../components/InputLabel";
import InputError from "../../components/InputError";
import Alert from "../../components/Alert";

const CreatePayment = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    enrollment_id: "",
    amount: "",
    payment_date: new Date().toISOString(),
  });
  const [studentDetails, setStudentDetails] = useState<
    Array<{
      enrollment_id: number;
      student: {
        id: number;
        name: string;
        ci: string;
        last_name: string;
        second_last_name: string;
      };
      course: {
        id: number;
        name: string;
        cost: number;
      };
      total_payments: number;
    }>
  >([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [alert, setAlert] = useState<{
    message: string;
    color?: string;
  } | null>(null);
  const navigate = useNavigate();

  const fetchStudents = async (inputValue: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching students");
      }

      const students = await response.json();

      const filteredStudents = students.filter((student: any) =>
        `${student.name} ${student.last_name} ${student.second_last_name} (C.I. ${student.ci})`
          .toLowerCase()
          .includes(inputValue.toLowerCase())
      );

      return filteredStudents.map((student: any) => ({
        value: student.id,
        label: `${student.name} ${student.last_name} ${student.second_last_name} (C.I. ${student.ci})`,
      }));
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  };

  const fetchStudentDetails = async (studentId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/payments/student-details/${studentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching student details");
      }

      const enrollments = await response.json();
      setStudentDetails(enrollments);
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setStudentDetails([]);
    }
  };

  const handleStudentSelect = (selectedOption: any) => {
    const studentId = selectedOption ? selectedOption.value : "";
    setFormData({
      ...formData,
      student_id: studentId,
      course_id: "",
      enrollment_id: "",
    });

    if (studentId) {
      fetchStudentDetails(studentId);
    } else {
      setStudentDetails([]);
      setSelectedCourse(null);
    }
  };

  const handleCourseSelect = (courseId: number, enrollmentId: number) => {
    setFormData({
      ...formData,
      course_id: courseId.toString(),
      enrollment_id: enrollmentId.toString(),
    });
    setSelectedCourse(courseId);
  };

  const handleAmountChange = (amount: string) => {
    const selectedCourseDetail = studentDetails.find(
      (detail) => detail.course?.id === selectedCourse
    );

    if (selectedCourseDetail) {
      const balance = Math.max(
        selectedCourseDetail.course?.cost - selectedCourseDetail.total_payments,
        0
      );

      if (Number(amount) > balance) {
        setAlert({
          message: `El monto no puede exceder el saldo pendiente de ${balance} Bs.`,
          color: "red",
        });
        setFormData({ ...formData, amount: "" });
        return;
      }

      if (balance === 0) {
        setAlert({
          message:
            "El saldo pendiente ya está cubierto. No es posible realizar más pagos.",
          color: "yellow",
        });
        setFormData({ ...formData, amount: "" });
        return;
      }
    }

    setAlert(null);
    setFormData({ ...formData, amount });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.enrollment_id || !formData.amount) {
      setErrors({ form: ["Todos los campos son obligatorios."] });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          enrollment_id: formData.enrollment_id,
          amount: formData.amount,
          payment_date: formData.payment_date,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        return;
      }

      navigate("/payments", {
        state: { message: "Pago registrado con éxito.", color: "green" },
      });
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      setErrors({ form: ["Error al registrar el pago."] });
    }
  };

  const goBackToPayments = () => {
    navigate("/payments");
  };

  return (
    <Layout>
      {alert && <Alert message={alert.message} color={alert.color} />}
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <InputLabel htmlFor="student_id">Seleccionar Estudiante</InputLabel>
            <AsyncSelect
              cacheOptions
              loadOptions={fetchStudents}
              defaultOptions
              onChange={handleStudentSelect}
              placeholder="Buscar estudiante..."
              isClearable
              className="w-full text-sm tracking-normal"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
            <InputError message={errors.student_id?.[0]} />
          </div>

          {studentDetails.length > 0 && (
            <div className="p-4 bg-gray-100 rounded shadow">
              <h2 className="font-bold text-lg">Detalles del Estudiante</h2>
              <p>
                Estudiante:{" "}
                {`${studentDetails[0]?.student?.name} ${studentDetails[0]?.student?.last_name} ${studentDetails[0]?.student?.second_last_name}`}
              </p>

              <h3 className="font-bold text-md my-3">Cursos Inscritos:</h3>
              <ul>
                {studentDetails.map((detail) => {
                  const balance = Math.max(
                    detail.course?.cost - detail.total_payments,
                    0
                  );
                  return (
                    <li
                      key={detail.course?.id || Math.random()}
                      className="mb-2"
                    >
                      <button
                        type="button"
                        className={`p-4 rounded border-black ${
                          selectedCourse === detail.course?.id
                            ? "border-2 border-blue-100 bg-blue-100 text-blue-500"
                            : balance > 0
                            ? "text-gray-700 bg-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() =>
                          handleCourseSelect(
                            detail.course?.id!,
                            detail.enrollment_id
                          )
                        }
                      >
                        {detail.course?.name} - Costo: {detail.course?.cost} Bs
                        - Monto Acumulado: {detail.total_payments} Bs - Saldo
                        Pendiente: {balance} Bs
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {selectedCourse &&
            studentDetails.find(
              (detail) => detail.course?.id === selectedCourse
            )?.course?.cost! > 0 && (
              <div>
                <InputLabel htmlFor="amount">Monto a Pagar</InputLabel>
                <TextInput
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Ingrese el monto"
                  className="w-full p-3 border rounded"
                />
                <InputError message={errors.amount?.[0]} />
              </div>
            )}

          <div className="mt-4 flex justify-end gap-2">
            <BackButton onClick={goBackToPayments}>Volver</BackButton>
            <SubmitButton type="submit">Guardar</SubmitButton>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePayment;
