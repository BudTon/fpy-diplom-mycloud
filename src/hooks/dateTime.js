export function dateTime(date) {
  try {
    const regex = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})\.\d+\w$/;
    const result = date.match(regex);

    if (!result) {
      throw new Error("Строка не соответствует формату ISO");
    }

    const datePart = result[1];
    const timePart = result[2];
    const formattedDate = `${datePart} ${timePart}`;

    return formattedDate;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
