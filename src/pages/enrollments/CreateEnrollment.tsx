import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import Alert from "../../components/Alert";
import Select from "react-select";
import Layout from "../../components/Layout";
import { Student } from "../../types/student";
import { Shift } from "../../types/shift";
import { Course } from "../../types/course";
import { Discount } from "../../types/discount";

const CreateEnrollment = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (
      endpoint: string,
      setState: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      try {
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
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };

    fetchData("students", setStudents);
    fetchData("shifts", setShifts);
    fetchData("courses", setCourses);
    fetchData("discounts", setDiscounts);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const discountOptions = discounts.map((discount: Discount) => ({
    value: discount.id,
    label: `${discount.name} - ${discount.percentage}%`,
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
              <InputLabel htmlFor="discount_id">
                Descuento (opcional)
              </InputLabel>
              <Select
                options={discountOptions}
                onChange={(selectedOption) =>
                  handleSelectChange("discount_id", selectedOption)
                }
                placeholder="Seleccionar descuento"
                className="w-full text-xs tracking-tighter"
              />
              <InputError message={errors.discount_id?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="enrollment_date">
                Fecha de Inscripción
              </InputLabel>
              <TextInput
                type="date"
                name="enrollment_date"
                value={formData.enrollment_date}
                onChange={handleChange}
              />
              <InputError message={errors.enrollment_date?.[0]} />
            </div>

            {/* Document 1 with Preview */}
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

            {/* Document 2 with Preview */}
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
