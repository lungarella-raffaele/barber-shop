export enum Day {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

export function getWeekDay(day: Day) {
  switch (day) {
    case Day.MONDAY:
      return "Lunedì";
    case Day.TUESDAY:
      return "Martedì";
    case Day.WEDNESDAY:
      return "Mercoledì";
    case Day.THURSDAY:
      return "Giovedì";
    case Day.FRIDAY:
      return "Venerdì";
    case Day.SATURDAY:
      return "Sabato";
    case Day.SUNDAY:
      return "Domenica";
    default:
      return "None";
  }
}

export const dayLabels: Record<string, string> = {
  "0": "Lun",
  "1": "Mar",
  "2": "Mer",
  "3": "Gio",
  "4": "Ven",
  "5": "Sab",
  "6": "Dom",
};
