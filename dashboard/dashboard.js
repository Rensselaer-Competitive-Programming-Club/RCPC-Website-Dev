'use strict';

function Achievement() {
    return (
        <form action="/admin" method="post">
            <label htmlFor="event-name">Event Name:</label>
            <input type="text" id="event-name" name="event-name"/>
            <br/>
            <label htmlFor="photo">Upload Photo:</label>
            <input type="file" id="photo" name="photo"/>
            <br/>
            <label htmlFor="website">Website URL:</label>
            <input type="url" id="website" name="website"/>  
            <br/>
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location"/>
            <br/>
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" name="description"/>
            <br/>
            <label htmlFor="what-we-won">What We Won</label>
            <input type="text" id="what-we-won" name="what-we-won"/>
        </form>
    );
}

function Dashboard() {
    const [showAchievement, setShowAchievement] = React.useState(false)

    return <main>
        <button onClick={() => {
            setShowAchievement(!showAchievement)
        }}>Achievement</button>

        { showAchievement && <Achievement /> }
    </main>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Dashboard />);