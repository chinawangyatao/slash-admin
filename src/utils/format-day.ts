import dayjs from 'dayjs';

export const fDay = (value: string) => {
  return dayjs(value).format('YYYY-MM-DD');
};

export const fHour = (value: string) => {
  return dayjs(value).format('YYYY-MM-DD hh:mm:ss');
};
