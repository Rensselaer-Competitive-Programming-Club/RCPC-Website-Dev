'use strict';

let problems = [
    {
        name: "Problem 1",
        rating: "1900",
        description: "<b>Problem 1</b> Description",
        inputDescription: "",
        outputDescription: "",
        examples: [
            {
                input: "input data",
                output: "output data"
            },
            {
                input: "input data 2",
                output: "output data 2"
            },
            {
                input: "input data 2",
                output: "output data 2"
            },
            {
                input: "input data 2",
                output: "output data 2"
            },
            {
                input: "input data 2",
                output: "output data 2"
            },
            {
                input: "input data 2",
                output: "output data 2"
            }
        ]
    },
]

function VerticalLine() {
    return (
        <div className="vertical-line"></div>
    );
}

function ProblemBody() {
    const [ selectedProblem, setSelectedProblem ] = React.useState(0);
    return (
        <main className="problem-body">
            <div className="problem-buttons">
                {problems.map((problem, index) => (
                    <button className="problem-button" key={index} onClick={() => { setSelectedProblem(index); }}>
                        {problem.name} <br/><br/> Rating - {problem.rating}
                    </button>
                ))}
            </div>
            <VerticalLine></VerticalLine>
            <div className="problem-description-div">
                <h1 className="problem-description-header">Problem Description</h1>
                <div className="problem-description-text" readOnly dangerouslySetInnerHTML={{__html: problems[selectedProblem].description }} />
            </div>
            <VerticalLine></VerticalLine>
            <div className="problem-examples-div">
                <h1 className="problem-examples-header">Problem Examples</h1>
                <div className="problem-examples-text" readOnly>
                    {problems[selectedProblem].examples.map((example, index) => (
                        <div readOnly>
                            <b>Input {index + 1}</b> <br />
                            {example.input}<br />
                            <b>Output {index + 1}</b> <br />
                            {example.output}<br />
                            <br />
                        </div>
                    ))}
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