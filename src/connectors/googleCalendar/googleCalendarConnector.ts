/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */

// import { utc } from 'moment';

// import googleCalendarAuthentication
const gcAuthentication = require('./googleCalendarAuthentication.ts');

function listEvents(auth) {
  const calendar = gcAuthentication.google.calendar({ version: 'v3', auth });
  const calendarID = 'k.sonja1999@gmail.com';

  const startDate = new Date().getDate();
  const startMonth = new Date().getMonth();
  const startYear = new Date().getFullYear();
  const startHour = 0 + 2;
  const startMinute = 0;
  console.log(startDate, startMonth, startYear);

  calendar.freebusy.query({
    auth,
    resource: {
      timeMin: (new Date(startYear, startMonth, startDate, startHour, startMinute)).toISOString(),
      timeMax: (new Date(startYear, startMonth, startDate, startHour + 24, startMinute)).toISOString(),
      items: [{ id: calendarID }],
    },
  })
    .then((answer) => {
      const busyEvents = answer.data.calendars[calendarID].busy;
      console.log(answer.data);
      console.log(busyEvents);
    }); // , BodyResponseCallback
  // calendar.events.list({
  //   calendarId: 'primary',
  //   timeMin: (new Date()).toISOString(),
  //   maxResults: 10,
  //   singleEvents: true,
  //   orderBy: 'startTime',
  // }, (err, res) => {
  //   if (err) return console.log(`The API returned an error: ${err}`);
  //   const events = res.data.items;
  //   if (events.length) {
  //     console.log('Upcoming events:');
  //     events.map((event) => {
  //       const start = event.start.dateTime; // || event.start.date;
  //       const end = event.end.dateTime; // || event.end.date;
  //       console.log(`${start} - ${end} || ${event.summary}`);
  //     });
  //   } else {
  //     console.log('No upcoming events found.');
  //   }
  // });
}

// Load client secrets from a local file.
gcAuthentication.fs.readFile('../../../credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  gcAuthentication.authorize(JSON.parse(content), listEvents);
});
