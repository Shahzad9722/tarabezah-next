import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mergeDateAndTime(dateInstance: Date, timeInstance: Date): string {
  const year = dateInstance.getFullYear();
  const month = String(dateInstance.getMonth() + 1).padStart(2, '0');
  const day = String(dateInstance.getDate()).padStart(2, '0');

  const hours = String(timeInstance.getHours()).padStart(2, '0');
  const minutes = String(timeInstance.getMinutes()).padStart(2, '0');
  const seconds = String(timeInstance.getSeconds()).padStart(2, '0');
  const milliseconds = String(timeInstance.getMilliseconds()).padStart(3, '0');

  // Construct ISO string
  const mergedDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`);

  return mergedDate.toISOString();
}

export function isNumeric(str: string) {
  return /^\d+$/.test(str);
}

export function groupBy(array, keyGetter) {
  return array.reduce((result, item) => {
    const key = keyGetter(item);
    (result[key] ||= []).push(item);
    return result;
  }, {});
}
