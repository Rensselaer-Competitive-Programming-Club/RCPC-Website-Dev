'use strict';

function Home() {
    return (
        <main>
            {/* Section 1; Hero */}
            <div className="hero">
                <h1>Rensselaer Competitive Programming Club</h1>
                <p>Example Mission: Discover amazing content and connect with our community.</p>
            </div>
            {/* Section 2; Upcoming Events */}
            <div className="upcoming-events">
                <div className="upcoming-events-left">
                    <h2>Upcoming Events</h2>
                    <p>Join us for our next event! We have a variety of activities planned, including workshops, competitions, and social gatherings.</p>
                </div>
                <div className="upcoming-events-right">
                    <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&src=cmNwYy5ycGlAZ21haWwuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%230B8043"></iframe>
                </div>
            </div>
            {/* Section 3; Achievements */}
            <div className="achievements">
                <h2>Achievements</h2>
                <ul>
                    <li>Achievement 1</li>
                    <li>Achievement 2</li>
                    <li>Achievement 3</li>
                </ul>
            </div>
        </main>
    );
}

ReactDOM.createRoot(document.querySelector("main"))?.render(React.createElement(Home));
