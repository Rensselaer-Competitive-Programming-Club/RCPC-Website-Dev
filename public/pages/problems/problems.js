'use strict';

let problems = [
    {
        name: "Problem 1",
        description: "Problem 1 Description",
        rating: "1900"
    },
    {
        name: "Problem 2",
        description: "Problem 2 Description",
        rating: "1200"
    }
]

let selectedProblem = "t";

function onProblemButtonClick(description) {
    selectedProblem = description;
    renderApp();
}

function ProblemBody() {


    return (
        <main className="problem-body">
            <div className="problem-buttons">
                {problems.map((problem, index) => (
                    <button className="problem-button" key={index} onClick={() => onProblemButtonClick(problem.description)}>
                        {problem.name}
                    </button>
                ))}
            </div>
            <textarea className="problem-box" value={selectedProblem} readOnly></textarea>
        </main>
    );
}


// render function
function renderApp() {
    const rootElement = document.querySelector("main");
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<ProblemBody />);
    } else {
        console.error("No <main> element found!");
    }
}

// Initial render
ReactDOM.createRoot(document.querySelector("main"))?.render(<ProblemBody />);