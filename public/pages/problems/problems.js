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
    },
    {
        name: "Problem 3",
        description: "Problem 3 Description",
        rating: "900"
    }
]

function ProblemBody() {
    const [ problemDescription, setProblemDescription ] = React.useState("");
    return (
        <main className="problem-body">
            <div className="problem-buttons">
                {problems.map((problem, index) => (
                    <button className="problem-button" key={index} onClick={() => setProblemDescription(problem.description)}>
                        {problem.name} <br/><br/> Rating - {problem.rating}
                    </button>
                ))}
            </div>
            <div className="problem-description-div">
                <h1 className="problem-description-header">Problem Description</h1>
                <textarea className="problem-description-ta" value={problemDescription} readOnly></textarea>
            </div>
            <div className="problem-inputs-div">
                <h1 className="problem-inputs-header">Problem Inputs</h1>
                <textarea className="problem-inputs-ta"></textarea>
                <div className="problem-inputs-buttons">
                    <button>Input 1</button>
                    <button>Input 2</button>
                </div>
            </div>
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