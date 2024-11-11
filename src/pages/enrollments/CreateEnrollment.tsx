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
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Student } from "../../types/student";
import { Course } from "../../types/course";
import { Discount } from "../../types/discount";
import esLocale from "@fullcalendar/core/locales/es";

type CalendarEvent = {
  title: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
};

const CreateEnrollment = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    courses: [] as string[],
    discount_id: "",
    enrollment_date: "",
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const [document1, setDocument1] = useState<File | null>(null);
  const [document2, setDocument2] = useState<File | null>(null);
  const [previewDocument1, setPreviewDocument1] = useState<string | null>(null);
  const [previewDocument2, setPreviewDocument2] = useState<string | null>(null);
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
    fetchData("courses", setCourses);
    fetchData("discounts", setDiscounts);
  }, []);

  const fetchCourseSchedules = async (courseIds: string[]) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/course-schedules?course_ids=${courseIds.join(
          ","
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      const newEvents = data.schedules
        .map((schedule: any) => {
          const dayNumber = convertDayToNumber(schedule.day);
          return {
            title: schedule.course_name,
            daysOfWeek: dayNumber !== null ? [dayNumber] : [],
            startTime: schedule.start_time,
            endTime: schedule.end_time,
          };
        })
        .filter((event: any) => event.daysOfWeek.length > 0);

      setEvents(newEvents);
    } catch (error) {
      console.error("Error fetching course schedules:", error);
    }
  };

  const convertDayToNumber = (day: string) => {
    switch (day.toUpperCase()) {
      case "LUNES":
        return 1;
      case "MARTES":
        return 2;
      case "MIERCOLES":
        return 3;
      case "JUEVES":
        return 4;
      case "VIERNES":
        return 5;
      case "SABADO":
        return 6;
      case "DOMINGO":
        return 0;
      default:
        return null;
    }
  };

  const handleSelectChange = (field: string, selectedOption: any) => {
    if (field === "courses") {
      const selectedCourses = selectedOption
        ? selectedOption.map((opt: any) => opt.value)
        : [];
      setFormData({ ...formData, courses: selectedCourses });
      fetchCourseSchedules(selectedCourses);
    } else {
      setFormData({
        ...formData,
        [field]: selectedOption ? selectedOption.value : "",
      });
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setDocument: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file);
      setPreview(URL.createObjectURL(file));
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

    if (!formData.enrollment_date) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        enrollment_date: ["La fecha de inscripción es obligatoria."],
      }));
      return;
    }

    const enrollmentData = new FormData();
    enrollmentData.append("student_id", formData.student_id);
    enrollmentData.append("discount_id", formData.discount_id);
    enrollmentData.append("enrollment_date", formData.enrollment_date);

    if (formData.courses.length > 0) {
      enrollmentData.append("course_id", formData.courses[0]);
    }

    if (document1) enrollmentData.append("document_1", document1);
    if (document2) enrollmentData.append("document_2", document2);

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
        if (response.status === 409) {
          setAlertMessage(
            "Conflicto de horario detectado. Revise su selección."
          );
          setAlertColor("red");
          setShowAlert(true);
          return;
        }
        const result = await response.json();
        setErrors(result.errors || {});
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/enrollments", {
        state: { message: "Inscripción registrada con éxito", color: "green" },
      });
    } catch (error) {
      setAlertMessage("Error al registrar la inscripción");
      setAlertColor("red");
      setShowAlert(true);
    }
  };

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
                options={students.map((s) => ({
                  value: s.id,
                  label: `${s.name} ${s.last_name} ${s.second_last_name} (C.I. ${s.ci})`,
                }))}
                onChange={(option) => handleSelectChange("student_id", option)}
                placeholder="Seleccionar estudiante"
                className="w-full text-xs tracking-tighter"
              />
              <InputError message={errors.student_id?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="courses">Cursos</InputLabel>
              <Select
                options={courses.map((course) => ({
                  value: course.id,
                  label: `${course.name} (${course.parallel})`,
                }))}
                isMulti
                onChange={(options) => handleSelectChange("courses", options)}
                placeholder="Seleccionar cursos"
                className="w-full text-xs tracking-tighter"
              />
              <InputError message={errors.courses?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="discount_id">Descuento</InputLabel>
              <Select
                options={discounts.map((discount) => ({
                  value: discount.id,
                  label: `${discount.name} (${discount.percentage}%)`,
                }))}
                onChange={(option) => handleSelectChange("discount_id", option)}
                placeholder="Seleccionar descuento"
                isClearable
                className="w-full text-xs tracking-tighter"
              />
              <InputError message={errors.discount_id?.[0]} />
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
                className="w-full p-3 text-xs tracking-tighter mb-5"
                placeholderText="Selecciona una fecha"
              />
              <InputError message={errors.enrollment_date?.[0]} />
            </div>

            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              events={events}
              locale={esLocale}
              height="auto"
              contentHeight="300px"
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              headerToolbar={{
                left: "",
                center: "title",
                right: "",
              }}
              dayHeaderFormat={{ weekday: "short" }}
              eventColor="#3788d8"
              eventTextColor="#fff"
              slotLabelClassNames="text-xs"
              dayHeaderClassNames="bg-gray-100 text-xs"
            />

            <div className="flex flex-col">
              <InputLabel htmlFor="document1">Documento 1</InputLabel>
              <div className="relative w-full h-64 border-2 border-gray-300 border-dashed rounded-lg">
                <input
                  type="file"
                  name="document1"
                  accept="image/*"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) =>
                    handleFileChange(e, setDocument1, setPreviewDocument1)
                  }
                />
                {previewDocument1 && (
                  <>
                    <img
                      src={previewDocument1}
                      alt="Vista previa Documento 1"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-600 transition-all duration-200"
                      onClick={() =>
                        handleRemoveImage(setDocument1, setPreviewDocument1)
                      }
                    >
                      <span className="mdi mdi-close"></span>
                    </button>
                  </>
                )}
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Haz clic para subir</span> o
                    arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG, GIF o PDF (MAX. 800x400px)
                  </p>
                </div>
              </div>
              <InputError message={errors.document_1?.[0]} />
            </div>

            <div className="flex flex-col">
              <InputLabel htmlFor="document2">Documento 2</InputLabel>
              <div className="relative w-full h-64 border-2 border-gray-300 border-dashed rounded-lg">
                <input
                  type="file"
                  name="document2"
                  accept="image/*"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) =>
                    handleFileChange(e, setDocument2, setPreviewDocument2)
                  }
                />
                {previewDocument2 && (
                  <>
                    <img
                      src={previewDocument2}
                      alt="Vista previa Documento 2"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-600 transition-all duration-200"
                      onClick={() =>
                        handleRemoveImage(setDocument2, setPreviewDocument2)
                      }
                    >
                      <span className="mdi mdi-close"></span>
                    </button>
                  </>
                )}
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Haz clic para subir</span> o
                    arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG, GIF o PDF (MAX. 800x400px)
                  </p>
                </div>
              </div>
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
