'use strict';

function ProblemBody() {
    return (
        <main className="problem-body">
            <textarea className="problem-box" value="Problem Box"></textarea>
        </main>
    );
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<ProblemBody />);


