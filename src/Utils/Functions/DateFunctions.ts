import { CalendarDate, Time } from "@internationalized/date";

export const convertDateToCalendarDate = (date: Date): CalendarDate => {
  // Extrae año, mes y día del objeto Date
  const year = date.getUTCFullYear(); // Usa getUTCFullYear para evitar problemas de zona horaria
  const month = date.getUTCMonth() + 1; // Los meses en Date están basados en 0 (0-11)
  const day = date.getUTCDate();

  // Crea una instancia de CalendarDate
  return new CalendarDate(year, month, day);
};

export const convertCalendarDateToDate = (date: CalendarDate): Date => {
  const calendarToDate = date.toDate("America/Montevideo");
  calendarToDate.setHours(12, 0, 0);

  return calendarToDate;
};
export const converDateToTime = (date: Date): Time => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return new Time(hours, minutes, seconds);
};

export const convertDateToISOFormat = (date: Date): string => {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num: number) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
};

export const getDateInYYYY = (diferencial: number = 0) => {
  // Crear una fecha y sumar el diferencial
  const ahora = new Date(Date.now() + diferencial);

  // Formatear la fecha en la zona horaria de Montevideo
  const formatoFecha = new Intl.DateTimeFormat("es-UY", {
    timeZone: "America/Montevideo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(ahora);

  // Extraer cada parte de la fecha
  const año = formatoFecha.find((part) => part.type === "year")?.value || "";
  const mes = formatoFecha.find((part) => part.type === "month")?.value || "";
  const dia = formatoFecha.find((part) => part.type === "day")?.value || "";
  const horas = formatoFecha.find((part) => part.type === "hour")?.value || "";
  const minutos =
    formatoFecha.find((part) => part.type === "minute")?.value || "";
  const segundos =
    formatoFecha.find((part) => part.type === "second")?.value || "";

  return `${año}${mes}${dia}${horas}${minutos}${segundos}`;
};
