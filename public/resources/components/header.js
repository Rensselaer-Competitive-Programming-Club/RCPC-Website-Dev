'use strict';

function Header() {
    return (
        <header>
            <a href="/"><img src="/resources/rcpc_black.png" alt="&gt;_RCPC"></img></a>

            <nav>
                <a href="/pages/events/events.html">Events</a>
                <a href="/pages/problems/problems.html">Problems</a>
                <a href="/pages/about/about.html">About</a>
            </nav>
        </header>
    );
}

ReactDOM.createRoot(document.querySelector("header"))?.render(React.createElement(Header));
