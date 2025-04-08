'use strict';

function Home() {
    return (
        <main>
            {/* Section 1; Hero */}
            <div className="hero">
                <h1>Rensselaer Competitive Programming Club</h1>
                <p>Foster a community of competitive programmers</p>
            </div>

            {/* Section 2; Upcoming Events */}
            <div className="upcoming-events-container">
                <div className="upcoming-events">
                    <div className="upcoming-events-left">
                        <h2>Upcoming Events</h2>
                        <p>Join us for our next event! We have a variety of activities planned, including workshops, competitions, and social gatherings.</p>
                    </div>
                    <div className="upcoming-events-right">
                        <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&src=cmNwYy5ycGlAZ21haWwuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%230B8043"></iframe>
                    </div>
                </div>
            </div>

            {/* Section 3; Achievements */}
            <div className="achievements-container">
                <div className="achievements-top">
                    <h2>Achievements</h2>
                </div>
                <div className="achievements-list">
                    <ul>
                        <li>
                            <h4>Achievement 1</h4>
                            <p>Description of Achievement 1</p>
                        </li>
                        <li>
                            <h4>Achievement 2</h4>
                            <p>Description of Achievement 2</p>
                        </li>
                        <li>
                            <h4>Achievement 3</h4>
                            <p>Description of Achievement 3</p>
                        </li>
                        <li>
                            <h4>Achievement 4</h4>
                            <p>Description of Achievement 3</p>
                        </li>
                        <li>
                            <h4>Achievement 5</h4>
                            <p>Description of Achievement 3</p>
                        </li>
                        <li>
                            <h4>Achievement 6</h4>
                            <p>Description of Achievement 3</p>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}

ReactDOM.createRoot(document.querySelector("main"))?.render(React.createElement(Home));
