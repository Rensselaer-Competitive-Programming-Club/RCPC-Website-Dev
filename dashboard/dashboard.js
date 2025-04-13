'use strict';

function Achievement() {
    return (
        <form action="/admin" method="post">
            <label for="event-name">Event Name:</label>
            <input type="text" id="event-name" name="event-name"/>
            <br/>
            <label for="photo">Upload Photo:</label>
            <input type="file" id="photo" name="photo"/>
            <br/>
            <label for="website" method="post">Website URL:</label>
            <input type="url" id="website" name="website"/>  
            <br/>
            <label for="location" method="post">Location:</label>
            <input type="text" id="location" name="location"/>
            <br/>
            <label for="description" method="post">Description:</label>
            <input type="text" id="description" name="description"/>
            <br/>
            <label for="what-we-won" method="post">What We Won</label>
            <input type="test" id="what-we-won" name="what-we-won"/>
        </form>
    );
}

function Main() {
    const [showAchievement, setShowAchievement] = React.useState(false)

    return <section>

        {/* TO BE MOVED TO ANOTHER FILE */}
        <button onClick={() => {
            setShowAchievement(!showAchievement)
        }}>Achievement</button>

        { showAchievement && <Achievement /> }
    </section>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Main />);