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
    payment_type: "CONTADO",
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [courseCost, setCourseCost] = useState(0);
  const [finalCost, setFinalCost] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("blue");
  const [document1, setDocument1] = useState<File | null>(null);
  const [document2, setDocument2] = useState<File | null>(null);
  const [previewDocument1, setPreviewDocument1] = useState<string | null>(null);
  const [previewDocument2, setPreviewDocument2] = useState<string | null>(null);
  const [initialAmount, setInitialAmount] = useState<number | null>(null);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async (
      endpoint: string,
      setState: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      const token = localStorage.getItem("token");
      let allData: any[] = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await fetch(
            `http://127.0.0.1:8000/api/${endpoint}?page=${currentPage}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Error al obtener datos de ${endpoint}`);
          }

          const data = await response.json();
          allData = [...allData, ...data.data];
          totalPages = data.last_page;
          currentPage++;
        }

        setState(allData);
      } catch (error) {
        console.error(`Error al cargar ${endpoint}:`, error);
      }
    };

    fetchAllData("students", setStudents);
    fetchAllData("courses", setCourses);
    fetchAllData("discounts", setDiscounts);
  }, []);

  useEffect(() => {
    if (formData.payment_type === "MENSUAL") {
      const discount = discounts.find(
        (discount) => discount.id === Number(formData.discount_id)
      );
      const discountAmount = discount
        ? (courseCost * discount.percentage) / 100
        : 0;

      const totalWithDiscount = courseCost - discountAmount;
      const remaining = totalWithDiscount - (initialAmount || 0);

      setFinalCost(totalWithDiscount);
      setRemainingBalance(Math.max(remaining, 0));
    }
  }, [
    initialAmount,
    formData.payment_type,
    courseCost,
    discounts,
    formData.discount_id,
  ]);

  const fetchCourseSchedules = async (courseIds: string[]) => {
    if (courseIds.length === 0) {
      setEvents([]);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/schedules?course_ids=${courseIds.join(",")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!data.schedules || !Array.isArray(data.schedules)) {
        console.error("La respuesta de la API no contiene horarios válidos.");
        return;
      }

      const newEvents = data.schedules.map((schedule: any) => ({
        title: `${schedule.course_name} (${schedule.parallel})`,
        daysOfWeek: [convertDayToNumber(schedule.day)],
        startTime: schedule.start_time,
        endTime: schedule.end_time,
      }));

      setEvents(newEvents);

      if (detectScheduleConflicts(newEvents)) {
        setAlertMessage(
          "Conflicto de horarios detectado entre los cursos seleccionados."
        );
        setAlertColor("red");
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    } catch (error) {
      console.error("Error al obtener los horarios:", error);
      setAlertMessage("Error al obtener los horarios de los cursos.");
      setAlertColor("red");
      setShowAlert(true);
    }
  };

  const detectScheduleConflicts = (events: CalendarEvent[]) => {
    const eventsGroupedByDay: { [key: number]: CalendarEvent[] } = {};

    events.forEach((event) => {
      event.daysOfWeek.forEach((day) => {
        if (!eventsGroupedByDay[day]) {
          eventsGroupedByDay[day] = [];
        }
        eventsGroupedByDay[day].push(event);
      });
    });

    for (const day in eventsGroupedByDay) {
      const dayEvents = eventsGroupedByDay[day];
      for (let i = 0; i < dayEvents.length; i++) {
        for (let j = i + 1; j < dayEvents.length; j++) {
          const event1 = dayEvents[i];
          const event2 = dayEvents[j];

          if (
            event1.startTime < event2.endTime &&
            event1.endTime > event2.startTime
          ) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const convertDayToNumber = (day: string): number => {
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
        console.warn(`Día inválido recibido: ${day}`);
        return -1;
    }
  };

  const handleSelectChange = (field: string, selectedOption: any) => {
    if (field === "courses") {
      const selectedCourseIds =
        selectedOption?.map((option: any) => option.value) || [];

      setFormData({ ...formData, courses: selectedCourseIds });
      const totalCost = selectedCourseIds.reduce(
        (sum: number, courseId: string) => {
          const course = courses.find((c) => c.id === Number(courseId));
          return sum + (course ? course.cost : 0);
        },
        0
      );
      setCourseCost(totalCost);
      const discount = discounts.find(
        (discount) => discount.id === Number(formData.discount_id)
      );
      const discountAmount = discount
        ? (totalCost * discount.percentage) / 100
        : 0;

      setFinalCost(totalCost - discountAmount);

      if (selectedCourseIds.length === 0) {
        setEvents([]);
        return;
      }

      fetchCourseSchedules(selectedCourseIds);
    } else if (field === "discount_id") {
      const discountId = selectedOption?.value || "";
      const discount = discounts.find((discount) => discount.id === discountId);

      const discountAmount = discount
        ? (courseCost * discount.percentage) / 100
        : 0;

      setFinalCost(courseCost - discountAmount);
      setFormData({ ...formData, discount_id: discountId });
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
    if (showAlert) {
      setAlertMessage(
        "No puedes registrar una inscripción con conflicto de horarios."
      );
      setAlertColor("red");
      setShowAlert(true);
      return;
    }
    const enrollmentData = new FormData();
    enrollmentData.append("student_id", formData.student_id);
    enrollmentData.append("discount_id", formData.discount_id);
    enrollmentData.append("enrollment_date", formData.enrollment_date);
    enrollmentData.append("payment_type", formData.payment_type);

    if (formData.payment_type === "MENSUAL") {
      enrollmentData.append("amount", initialAmount?.toString() || "0");
    } else {
      enrollmentData.append("amount", finalCost.toString());
    }

    formData.courses.forEach((courseId) =>
      enrollmentData.append("course_ids[]", courseId)
    );

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

            <div className="flex gap-4 pt-14">
              <div className="flex-1 flex flex-col">
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
                  className="w-full p-3 rounded-sm text-xs tracking-tighter border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  placeholderText="Selecciona una fecha"
                  popperPlacement="top-start"
                  portalId="root-portal"
                />
                <InputError message={errors.enrollment_date?.[0]} />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col">
                <InputLabel htmlFor="student_id">Estudiante</InputLabel>
                <Select
                  options={students.map((s) => ({
                    value: s.id,
                    label: `${s.name} ${s.last_name} ${s.second_last_name} (C.I. ${s.ci})`,
                  }))}
                  onChange={(option) =>
                    handleSelectChange("student_id", option)
                  }
                  placeholder="Seleccionar estudiante"
                  className="w-full text-xs tracking-tighter"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />

                <InputError message={errors.student_id?.[0]} />
              </div>

              <div className="flex-1 flex flex-col">
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
                  menuPortalTarget={document.body}
                  required
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
                <InputError message={errors.courses?.[0]} />
              </div>
            </div>

            <div className="flex flex-col">
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                events={events}
                locale={esLocale}
                height="auto"
                slotMinTime="06:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                headerToolbar={{
                  left: "",
                  center: "",
                  right: "",
                }}
                dayHeaderFormat={{ weekday: "short" }}
                eventColor="#3788d8"
                eventTextColor="#ffffff"
                dayHeaderClassNames="bg-gray-100 text-xs"
              />
            </div>

            <div className="flex flex-col">
              <InputLabel>Tipo de Pago</InputLabel>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="payment-type-contado"
                    type="radio"
                    value="CONTADO"
                    checked={formData.payment_type === "CONTADO"}
                    onChange={() => {
                      setFormData({ ...formData, payment_type: "CONTADO" });
                      setInitialAmount(null);
                      setRemainingBalance(0);
                    }}
                    className="hidden checked:bg-no-repeat checked:bg-center checked:border-sky-500 checked:bg-sky-100"
                  />
                  <label
                    htmlFor="payment-type-contado"
                    className="flex items-center cursor-pointer text-gray-600 text-sm font-normal whitespace-nowrap"
                  >
                    <span className="border border-gray-300 rounded-full mr-2 w-4 h-4 flex items-center justify-center">
                      {formData.payment_type === "CONTADO" && (
                        <span className="bg-sky-500 w-2 h-2 rounded-full"></span>
                      )}
                    </span>
                    Pago al Contado
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="payment-type-mensual"
                    type="radio"
                    value="MENSUAL"
                    checked={formData.payment_type === "MENSUAL"}
                    onChange={() =>
                      setFormData({ ...formData, payment_type: "MENSUAL" })
                    }
                    className="hidden checked:bg-no-repeat checked:bg-center checked:border-sky-500 checked:bg-sky-100"
                  />
                  <label
                    htmlFor="payment-type-mensual"
                    className="flex items-center cursor-pointer text-gray-600 text-sm font-normal whitespace-nowrap"
                  >
                    <span className="border border-gray-300 rounded-full mr-2 w-4 h-4 flex items-center justify-center">
                      {formData.payment_type === "MENSUAL" && (
                        <span className="bg-sky-500 w-2 h-2 rounded-full"></span>
                      )}
                    </span>
                    Pago Mensual
                  </label>
                </div>
              </div>

              {formData.payment_type === "MENSUAL" && (
                <div className="mt-4">
                  <InputLabel>Monto Inicial</InputLabel>
                  <input
                    type="text"
                    value={initialAmount ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!/^\d*$/.test(value)) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          amount: [
                            "El monto inicial debe ser un número válido",
                          ],
                        }));
                        return;
                      }
                      const numericValue = Number(value);
                      if (numericValue > finalCost) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          amount: [
                            "El monto inicial no puede ser mayor que el costo total",
                          ],
                        }));
                      } else if (numericValue < 20) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          amount: ["El monto inicial debe ser mayor a 20 Bs"],
                        }));
                      } else {
                        setErrors((prevErrors) => {
                          const { amount, ...rest } = prevErrors;
                          return rest;
                        });
                      }
                      setInitialAmount(numericValue);
                    }}
                    placeholder="Ingrese el monto inicial"
                    className="w-full py-2 text-xs tracking-tighter border border-gray-300 rounded"
                  />
                  <InputError message={errors.amount?.[0]} />
                </div>
              )}
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
              <InputLabel>Costo del Curso</InputLabel>
              <input
                type="text"
                value={courseCost.toFixed(2)}
                readOnly
                className="w-full p-3 text-xs tracking-tighter bg-gray-100"
              />
            </div>

            <div className="flex flex-col">
              <InputLabel>Monto Total</InputLabel>
              <input
                type="text"
                value={finalCost.toFixed(2)}
                readOnly
                className="w-full p-3 text-xs tracking-tighter mb-5 bg-gray-100"
              />
            </div>

            {formData.payment_type === "MENSUAL" && (
              <div className="flex flex-col">
                <InputLabel>Monto Inicial Pagado</InputLabel>
                <input
                  type="text"
                  value={initialAmount?.toFixed(2) || "0.00"}
                  readOnly
                  className="w-full p-3 text-xs tracking-tighter mb-5 bg-gray-100"
                />
              </div>
            )}

            {formData.courses.length > 0 && (
              <div className="flex flex-col">
                <InputLabel>Detalle de Pago</InputLabel>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  {formData.courses.map((courseId) => {
                    const course = courses.find(
                      (c) => c.id === Number(courseId)
                    );
                    return (
                      <div
                        key={courseId}
                        className="flex justify-between text-xs mb-2"
                      >
                        <span>
                          {course?.name} ({course?.parallel})
                        </span>
                        <span>{course?.cost?.toFixed(2)} Bs</span>
                      </div>
                    );
                  })}
                  <hr className="my-2" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total Sin Descuento:</span>
                    <span>{courseCost.toFixed(2)} Bs</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-green-600">
                    <span>Descuento Aplicado:</span>
                    <span>
                      {discounts.find(
                        (d) => d.id === Number(formData.discount_id)
                      )?.percentage || 0}
                      %
                    </span>
                  </div>

                  {formData.payment_type === "MENSUAL" ? (
                    <>
                      <div className="flex justify-between text-sm font-bold text-blue-600">
                        <span>Monto Inicial Pagado:</span>
                        <span>{initialAmount?.toFixed(2) || 0} Bs</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-red-600">
                        <span>Saldo Restante con Descuento:</span>
                        <span>{remainingBalance.toFixed(2)} Bs</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total a Pagar:</span>
                      <span>{finalCost.toFixed(2)} Bs</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col">
              <InputLabel htmlFor="document1">
                Certificado de Nacimiento
              </InputLabel>
              <div className="relative w-full h-64 border-2 border-gray-300 border-dashed rounded-lg">
                <input
                  type="file"
                  name="document1"
                  accept="image/*"
                  required
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
              <InputLabel htmlFor="document2">Título de Bachiller</InputLabel>
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
