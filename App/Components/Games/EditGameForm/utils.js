import moment from 'moment';

export const getDate = (startTime) => {
  const startDate = moment.utc(startTime).startOf('day'); // moment object

  return {
    year: startDate.year(),
    month: startDate.month(),
    day: startDate.date(),
    dateString: startDate.format('MM-DD-YYYY'),
  };
};

export const getTime = startTime => (
  new Date(moment.utc(startTime).toISOString())
);

export const getDuration = (startTime, endTime) => {
  const start = moment.utc(startTime);
  const end = moment.utc(endTime);
  return end.diff(start, 'minutes');
};
