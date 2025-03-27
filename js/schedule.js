document.addEventListener('DOMContentLoaded', () => {
    const CalendarEl = document.getElementById('calendar');
    let calendarInstance;

    async function Fetch() {
        console.log("Fetching...")
        const apiKey = 'AIzaSyAag06XeSIVW4fNO3WhXTGgpoOJ7B04FPA';
        const calendarId = '2b1114ee4cab660a0a3f167d7b072941805950a9e6c42ba643a3aea29efa02b3@group.calendar.google.com';
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const busyEvents = (data.items || [])
              .filter(event => {
                  if (event.status === 'cancelled') return false;
                  if (event.transparency && event.transparency === 'transparent') return false;
                  return true;
              })
              .map(event => {
                  const start = event.start.dateTime || event.start.date;
                  const end = event.end.dateTime || event.end.date;
                  return {
                      title: "Not Available",
                      start: start,
                      end: end
                  };
              });
            console.log('Success in fetching calendar events:', busyEvents);
            return busyEvents;
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            return [];
        }
    }

    function Init() {
        const isMobile = window.innerWidth <= 768;

        calendarInstance = new FullCalendar.Calendar(CalendarEl, {
            allDaySlot: false,
            nowIndicator: true,

            headerToolbar: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },

            initialView: 'timeGridWeek',
            
            slotLabelFormat: {
                hour: 'numeric',
                hour12: true
            },

            slotMinTime: '6:00:00',
            slotMaxTime: '25:00:00',

            height: 'auto',

            events: async function(fetchInfo, successCallback, failureCallback) {
                const events = await Fetch();
                successCallback(events);
            }
        });
        calendarInstance.render();
    }

    Init();

    calendarInstance.refetchEvents()

    CallLoop(() => {
        if (calendarInstance) {
            calendarInstance.refetchEvents();
        }
    }, 300000);
});