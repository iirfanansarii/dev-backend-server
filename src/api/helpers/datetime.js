const moment = require('moment');

exports.DATETIMETOEPOC = (epocDate) => {
  if (!epocDate) return;
  return moment(epocDate);
};

exports.differentiate = (date1, date2) => date1 - date2;

exports.addExpireDurationToMoment = (duration, momentDate, timeUnit) =>
  this.DATETIMETOEPOC(moment(momentDate).add(duration, timeUnit));
