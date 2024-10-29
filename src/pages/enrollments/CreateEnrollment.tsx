import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import InputError from "../../components/InputError";
import Alert from "../../components/Alert";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../components/Layout";
import RadioButton from "../../components/RadioButton";
import { Student } from "../../types/student";
import { Shift } from "../../types/shift";
import { Course } from "../../types/course";
import { Discount } from "../../types/discount";

const CreateEnrollment = () => {
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    shift_id: "",
    course_id: "",
    discount_id: "",
    enrollment_date: "",
  });
  const [document1, setDocument1] = useState<File | null>(null);
  const [document2, setDocument2] = useState<File | null>(null);
  const [previewDocument1, setPreviewDocument1] = useState<string | null>(null);
  const [previewDocument2, setPreviewDocument2] = useState<string | null>(null);
  const [uploadProgress1, setUploadProgress1] = useState(0);
  const [uploadProgress2, setUploadProgress2] = useState(0);
  const [isUploading1, setIsUploading1] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const [showDiscountOptions, setShowDiscountOptions] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (
      endpoint: string,
      setState: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setState(data.data);
    };

    fetchData("students", setStudents);
    fetchData("shifts", setShifts);
    fetchData("courses", setCourses);
  }, []);

  const fetchDiscounts = async () => {
    try {
      setIsLoadingDiscounts(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/discounts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTimeout(() => {
        setDiscounts(data.data);
        setIsLoadingDiscounts(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setIsLoadingDiscounts(false);
    }
  };

  const handleSelectChange = (field: string, selectedOption: any) => {
    setFormData({
      ...formData,
      [field]: selectedOption ? selectedOption.value : "",
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setDocument: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file);
      setPreview(URL.createObjectURL(file));
      setUploadProgress(0);
      setIsUploading(true);
    }
  };

  const handleRemoveImage = (
    setDocument: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setDocument(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const enrollmentData = new FormData();
    enrollmentData.append("student_id", formData.student_id);
    enrollmentData.append("shift_id", formData.shift_id);
    enrollmentData.append("course_id", formData.course_id);
    enrollmentData.append("discount_id", formData.discount_id);
    enrollmentData.append("enrollment_date", formData.enrollment_date);

    if (document1) {
      enrollmentData.append("document_1", document1);
    }

    if (document2) {
      enrollmentData.append("document_2", document2);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/enrollments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: enrollmentData,
      });

      if (!response.ok) {
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/enrollments", {
        state: { message: "Inscripción registrada con éxito", color: "green" },
      });
    } catch (error) {
      console.error("Error creating enrollment:", error);
      setAlertMessage("Error al registrar la inscripción");
      setAlertColor("red");
      setShowAlert(true);
    }
  };

  const toggleDiscountOptions = async () => {
    if (showDiscountOptions) {
      setSelectedDiscount(null);
      setFormData({ ...formData, discount_id: "" });
    } else {
      await fetchDiscounts();
    }
    setShowDiscountOptions(!showDiscountOptions);
  };

  const studentOptions = students.map((student: Student) => ({
    value: student.id,
    label: `${student.name} ${student.last_name} ${student.second_last_name} C.I. ${student.ci}`,
  }));

  const shiftOptions = shifts.map((shift: Shift) => ({
    value: shift.id,
    label: `${shift.name} - ${shift.room?.name} ${shift.start_time} - ${shift.end_time}`,
  }));

  const courseOptions = courses.map((course: Course) => ({
    value: course.id,
    label: course.name,
  }));

  return (
    <div>
      <Layout>
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-6xl mx-auto mb-5">
          <h2 className="text-2xl font-bold mb-4 text-center tracking-tighter uppercase">
            Registrar Inscripción
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {showAlert && <Alert message={alertMessage} color={alertColor} />}

            <div className="flex flex-col">
              <InputLabel htmlFor="student_id">Estudiante</InputLabel>
              <Select
                options={studentOptions}
                onChange={(selectedOption) =>
                  handleSelectChange("student_id", selectedOption)
                }
                placeholder="Seleccionar estudiante"
                className="w-full text-xs tracking-tighter"
              />
              <InputError message={errors.student_id?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="shift_id">Turno</InputLabel>
              <Select
                options={shiftOptions}
                onChange={(selectedOption) =>
                  handleSelectChange("shift_id", selectedOption)
                }
                placeholder="Seleccionar turno"
                className="w-full text-xs tracking-tighter"
              />
              <InputError message={errors.shift_id?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="course_id">Curso</InputLabel>
              <Select
                options={courseOptions}
                onChange={(selectedOption) =>
                  handleSelectChange("course_id", selectedOption)
                }
                placeholder="Seleccionar curso"
                className="w-full text-xs tracking-tighter"
              />
              <InputError message={errors.course_id?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="enrollment_date">
                Fecha de Inscripción
              </InputLabel>
              <DatePicker
                selected={
                  formData.enrollment_date
                    ? new Date(formData.enrollment_date)
                    : null
                }
                onChange={(date: Date | null) =>
                  setFormData({
                    ...formData,
                    enrollment_date: date
                      ? date.toISOString().split("T")[0]
                      : "",
                  })
                }
                dateFormat="yyyy-MM-dd"
                locale="es"
                className="w-full p-3 text-xs tracking-tighter"
                placeholderText="Selecciona una fecha"
              />

              <InputError message={errors.enrollment_date?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="document1">Documento 1</InputLabel>
              <input
                type="file"
                name="document1"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    setDocument1,
                    setPreviewDocument1,
                    setUploadProgress1,
                    setIsUploading1
                  )
                }
                className="w-full"
              />
              {previewDocument1 && (
                <div className="relative mt-3">
                  <img
                    src={previewDocument1}
                    alt="Vista previa del Documento 1"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                    style={{ maxHeight: "300px" }}
                  />
                  {isUploading1 && (
                    <div
                      className="absolute bottom-0 left-0 h-2 bg-green-500"
                      style={{
                        width: `${uploadProgress1}%`,
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-600 transition-all duration-200"
                    onClick={() =>
                      handleRemoveImage(setDocument1, setPreviewDocument1)
                    }
                  >
                    <i className="mdi mdi-close"></i>
                  </button>
                </div>
              )}
              <InputError message={errors.document_1?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="document2">Documento 2</InputLabel>
              <input
                type="file"
                name="document2"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    setDocument2,
                    setPreviewDocument2,
                    setUploadProgress2,
                    setIsUploading2
                  )
                }
                className="w-full"
              />
              {previewDocument2 && (
                <div className="relative mt-3">
                  <img
                    src={previewDocument2}
                    alt="Vista previa del Documento 2"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                    style={{ maxHeight: "300px" }}
                  />
                  {isUploading2 && (
                    <div
                      className="absolute bottom-0 left-0 h-2 bg-green-500"
                      style={{
                        width: `${uploadProgress2}%`,
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-600 transition-all duration-200"
                    onClick={() =>
                      handleRemoveImage(setDocument2, setPreviewDocument2)
                    }
                  >
                    <i className="mdi mdi-close"></i>
                  </button>
                </div>
              )}
              <InputError message={errors.document_2?.[0]} />
            </div>

            <div>
              <InputLabel htmlFor="discount_id">
                Descuento (opcional)
              </InputLabel>
              <button
                type="button"
                onClick={toggleDiscountOptions}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
              >
                {isLoadingDiscounts && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {isLoadingDiscounts
                  ? "Cargando..."
                  : showDiscountOptions
                  ? "Deshacer Descuento"
                  : "Aplicar Descuento"}
              </button>

              {showDiscountOptions && (
                <div className="mt-4">
                  {discounts.map((discount) => (
                    <RadioButton
                      key={discount.id}
                      id={`discount-${discount.id}`}
                      value={discount.id.toString()}
                      label={`${discount.name} - ${discount.percentage}%`}
                      checked={selectedDiscount === discount.id.toString()}
                      onChange={() => {
                        setSelectedDiscount(discount.id.toString());
                        setFormData({
                          ...formData,
                          discount_id: discount.id.toString(),
                        });
                      }}
                    />
                  ))}
                </div>
              )}
              <InputError message={errors.discount_id?.[0]} />
            </div>

            <div className="flex justify-end mt-4">
              <SubmitButton type="submit">Guardar</SubmitButton>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default CreateEnrollment;
