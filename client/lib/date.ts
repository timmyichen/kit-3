const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ONE_DAY = 1000 * 60 * 60 * 24;

export function getDateString(
  date: Date,
  { withYear }: { withYear?: boolean } = {},
) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];

  let suffix;
  switch (day % 10) {
    case 1:
      suffix = day === 11 ? 'th' : 'st';
      break;
    case 2:
      suffix = day === 12 ? 'th' : 'nd';
      break;
    case 3:
      suffix = day === 13 ? 'th' : 'rd';
      break;
    default:
      suffix = 'th';
  }

  if (withYear) {
    return `${month.slice(0, 3)} ${day}${suffix}, ${date.getFullYear()}`;
  }

  return `${month.slice(0, 3)} ${day}${suffix}`;
}

export function getAge(date: Date) {
  const thisYear = date;
  const now = new Date();
  thisYear.setFullYear(now.getFullYear());

  // birthday has passed
  if (thisYear < now) {
    return now.getFullYear() - date.getFullYear();
  }

  return now.getFullYear() - date.getFullYear() - 1;
}

export function getDateDistance(date: Date) {
  const now = new Date();
  const thisYear = date;
  const currentYear = now.getFullYear();
  thisYear.setFullYear(currentYear);
  const beginningOfYear = new Date(currentYear + '-01-01');
  const nowDays = Math.floor(
    (now.getTime() - beginningOfYear.getTime()) / ONE_DAY,
  );
  const dateDays = Math.floor(
    (thisYear.getTime() - beginningOfYear.getTime()) / ONE_DAY,
  );

  // todo: leap years

  let diff = 0;

  diff = dateDays - nowDays;

  if (thisYear < now) {
    diff += 365;
  }

  return diff;
}

export function getCurrentTimezoneDate(date: Date) {
  const offset = date.getTimezoneOffset();
  const timestamp = date.getTime() + offset * 1000 * 60;
  return new Date(timestamp);
}

export function getUpcomingAge(birthYear: number) {
  const currentYear = new Date().getFullYear();

  return currentYear - birthYear;
}
