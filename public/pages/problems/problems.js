'use strict';

let problems = [
    {
        name: "Problem 1",
        description: "Problem 1 Description",
        rating: "1900",
        input: [

        ],
        output: [

        ]
    },
    {
        name: "Problem 2",
        description: "Problem 2 Description",
        rating: "1200",
        input: [

        ],
        output: [

        ]
    },
    {
        name: "Problem 3",
        description: "Problem 3 Description",
        rating: "900",
        input: [
            
        ],
        output: [

        ]
    }
]

function VerticalLine() {
    return (
        <div className="vertical-line"></div>
    );
}

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
            <VerticalLine></VerticalLine>
            <div className="problem-description-div">
                <h1 className="problem-description-header">Problem Description</h1>
                <textarea className="problem-description-ta" value={problemDescription} readOnly ></textarea>
            </div>
            <VerticalLine></VerticalLine>
            <div className="problem-examples-div">
                <h1 className="problem-examples-header">Problem Examples</h1>
                <textarea className="problem-examples-ta" readOnly></textarea>
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