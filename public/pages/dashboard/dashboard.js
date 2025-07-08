'use strict';

function Dashboard() {
    const [showAchievement, setShowAchievement] = React.useState(false)
    const [problems, setProblems] = React.useState("");
    const [output, setOutput] = React.useState("");

    function Leaderboard() {
        const [OKSubmissions, setOKSubmissions] = React.useState([]);
        const [problemID, setProblemID] = React.useState("");
        const [showRefresh, setShowRefresh] = React.useState(true);

        const handles = [
            "MPartridge",
            "jacob528",
            "CJMarino",
            "togoya6259",
            "sideoftomatoes",
            "gaviche",
            "lukeyam"
        ]

        const getOKSubmissions = () => {
            fetch('/backend/leaderboard/getOKSubmissions?args[]=' + problemID + '&args[]=' + encodeURIComponent(JSON.stringify(handles)))
                .then(res => res.json())
                .then(data => {;
                    setOKSubmissions(data.result ? data.result.split(" ") : []);
                });
        };


        return (
            <div>
                <input type="text" value={problemID} onChange={(e) => {
                    setProblemID(e.target.value);
                    }} placeholder="Enter problem id"></input>
                    <button disabled={!showRefresh} onClick={() => {
                        setShowRefresh(false);
                        getOKSubmissions();
                        setTimeout(() => setShowRefresh(true), handles.length * 2000);
                    }}>refresh</button>
                {OKSubmissions.map((submission, index) => (
                    <h1 key={index}>{submission}</h1>  // Render each handle and submission
                ))}
            </div>
        );
    }

    function Achievement() {
        return (
            <form action="/admin" method="post">
                <label htmlFor="event-name">Event Name:</label>
                <input type="text" id="event-name" name="event-name"/>
                <br/>
                <label htmlFor="photo">Upload Photo:</label>
                <input type="file" id="photo" name="photo"/>
                <br/>
                <label htmlFor="website">Website URL:</label>
                <input type="url" id="website" name="website"/>  
                <br/>
                <label htmlFor="location">Location:</label>
                <input type="text" id="location" name="location"/>
                <br/>
                <label htmlFor="description">Description:</label>
                <input type="text" id="description" name="description"/>
                <br/>
                <label htmlFor="what-we-won">What We Won</label>
                <input type="text" id="what-we-won" name="what-we-won"/>
            </form>
        );
    }

    function Problem( { name, rating, description } ) {
        <div classname="problem-box">

        </div>
    }

    const fetchProblems = () => {
        fetch('/database/problems?isActive=true')
             .then(response => response.json()) 
             .then(data => {
                 if (data.ok) {
                     setProblems(JSON.stringify(data.data, null, 2)); 
                 } else {
                     setProblems(`Error retrieving problems: ${data.error}`);
                 }
             })
             .catch(error => {
                 setProblems(`Error with the fetch request: ${error}`);
             });
    };



    React.useEffect(() => {
    }, []);

    return <main>
        <Leaderboard/>
    </main>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Dashboard />);