'use strict';

function TitleText() {
    return <h2>Admin Interface</h2>
}

function InstructionText() {
    return <div><p>Used to access the RCPC website database</p><br /><br /></div>
}

function Text() {
    return <div class="Text">
        <TitleText />
        <InstructionText />
    </div> 
}

/*
 * html form for uploading the password
 * action field describes the endpoint password is sent to
 * no way for xss to happen (everything is static)
 * should check on server-side for sanitizing input b4 reading
 * is there a risk for reading??
*/

function Achievement() {
    return (
        <form action="/admin" method="post">
            <label for="event-name">  Event Name: </label>
            <input type="text" id="event-name" name="event-name"/>
            <br/>
            <label for="photo">  Upload Photo: </label>
            <input type="file" id="photo" name="photo" accept="image/*"/>
            <br/>
        </form>
    );
}

function Form() {

    return <form action="/admin" method="post">
        <label htmlFor="password">Enter the password here:</label><br />
        <input type="password" id="password" name="password"></input>
    </form>
}

function Main() {
    const [showAchievement, setShowAchievement] = React.useState(false)

    return <section>
        <Text />
        <Form />
        <br/>

        {/* TO BE MOVED TO ANOTHER FILE */}
        <button onClick={() => {
            setShowAchievement(!showAchievement)
        }}>Achievement</button>

        { showAchievement && <Achievement /> }
    </section>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Main />);