'use strict';

function About() {
    return <main>
        <p>hello world</p>
    </main>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(React.createElement(About));
