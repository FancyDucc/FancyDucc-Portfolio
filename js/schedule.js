document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
    const now = new Date();
    const myTime = new Date(now.getTime());
    const formattedTime12 = myTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedTime24 = myTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    document.getElementById("MyTime").innerHTML = `
      <span style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #5000e6, #9b00e6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 10px rgba(80, 0, 230, 0.8); display: block;">
        The time for me right now is: ${formattedTime12}
      </span>
      <span style="font-size: 0.9rem; font-weight: 700; background: linear-gradient(135deg, #5000e6, #9b00e6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 5px rgba(80, 0, 230, 0.6); display: block; margin-top: 2px;">
        Or: ${formattedTime24}
      </span>
    `;
    }, 1000);

    const CalendarEl = document.getElementById('calendar');
    let calendarInstance;

    async function Fetch() {
        console.log("Fetching...")
        const apiKey = 'AIzaSyAag06XeSIVW4fNO3WhXTGgpoOJ7B04FPA'; // lol don't even try using this, it only works for this website and google calender.
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
});