'use strict';

function EventCard({ title, date, time, location, description }) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div 
            className="event-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)} >
            {isHovered ? (
                <div className="event-description">
                    <p>{description}</p>
                </div>
            ) : (
                <div className="event-details">
                    <h3>{title}</h3>
                    <p>{date} at {time}</p>
                    <p>📍 {location}</p>
                </div>
            )}
        </div>
    );
}

function EventsList() {
    const [events, setEvents] = React.useState([]);

    React.useEffect(() => {
        fetch('/pages/events/events.json')
            .then(response => response.json())
            .then(data => setEvents(data.events))
            .catch(error => console.error('Error loading events:', error));
    }, []);

    return (
        <>
            {events.map((event, index) => (
                <EventCard
                    key={index}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    description={event.description} />
            ))}
        </>
    );
}

function Events() {
    return (
        <main>
            <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&src=cmNwYy5ycGlAZ21haWwuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%230B8043"></iframe>
            <div id="events-container" class="events-grid">
                <EventsList />
            </div>
        </main>
    );
}


ReactDOM.createRoot(document.querySelector("main"))?.render(React.createElement(Events));