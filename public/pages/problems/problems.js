'use strict';

let problems = [
    {
        name: "Drunken Maze",
        rating: "1700",
        description: "You are given a two-dimensional maze with a start and end position. Your task is to find the fastest way to get from the start to the end position. The fastest way is to make the minimum number of steps where one step is going left, right, up, or down. Of course, you cannot walk through walls. There is, however, a catch: If you make more than three steps in the same direction, you lose balance and fall down. Therefore, it is forbidden to make more than three consecutive steps in the same direction. It is okay to walk three times to the right, then one step to the left, and then again three steps to the right. This has the same effect as taking five steps to the right, but is slower.",
        inputDescription: "",
        outputDescription: "",
        examples: [
            {
                input: "7 12\n############\n#S........T#\n#.########.#\n#..........#\n#..........#\n#..#..#....#\n############",
                output: "15"
            },
            {
                input: "5 8\n########\n#......#\n#.####.#\n#...T#S#\n########",
                output: "14"
            },
            {
                input: "5 8\n########\n#.#S...#\n#.####.#\n#...T#.#\n########\n",
                output: "-1"
            },
        ]
    }, {
        name: "Watermelon",
        rating: "800",
        description: "",
        inputDescription: "",
        outputDescription: "",
        examples: [

        ]
    }
]

function VerticalLine() {
    return (
        <div className="vertical-line"></div>
    );
}

function ProblemBody() {
    const [ selectedProblem, setSelectedProblem ] = React.useState(0);
    return (
        <main>
            <div className="problem-body-container">
                <div className="problem-body">
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
                                <div readOnly className="input-output">
                                    <b className="input-output-bold">Input {index + 1}</b> <br />
                                    {example.input}<br />
                                    <b className="input-output-bold">Output {index + 1}</b> <br />
                                    {example.output}<br />
                                    <br />
                                </div>
                            ))}
                        </div>
                    </div>
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