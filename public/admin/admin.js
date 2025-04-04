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


function Form() {
    return <form action="/server-endpoint-here" method="post">
        <label for="password">Enter the password here:</label><br />
        <input type="password" id="password" name="password"></input>
    </form>
}

function Main() {
    return <section>
        <Text />
        <Form />
    </section>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Main />);