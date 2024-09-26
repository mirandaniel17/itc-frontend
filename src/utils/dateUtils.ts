//spanish
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.toLocaleString("es-ES", { month: "long" });
  const year = date.getUTCFullYear();
  return `${day} de ${month} de ${year}`;
};
