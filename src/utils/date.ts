export const getMonthsInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  while (startDate <= endDate) {
    dates.push(startDate);
    startDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
  }
  return dates;
};

export const getYearsInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  while (startDate <= endDate) {
    dates.push(startDate);
    startDate = new Date(startDate.getFullYear() + 1, 0, 1);
  }
  return dates;
};

export const stringToDate = (date: string): Date => {
  const dateParts = date.split("-");
  return new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2])
  );
};

export const serializeDate = (date: Date | string): string => {
  if (typeof date == "string") {
    date = stringToDate(date);
  }

  let month: string = date.getMonth().toString();
  let day: string = date.getDate().toString();
  return `${date.getFullYear()}-${month}-${day}`;
};

export const monthsBetweenDates = (date1: Date, date2: Date) => {
  return (
    (date2.getFullYear() - date1.getFullYear()) * 12 -
    date1.getMonth() +
    date2.getMonth()
  );
};
