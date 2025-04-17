'use strict';

function Dashboard() {
    const [showAchievement, setShowAchievement] = React.useState(false)
    const [problems, setProblems] = React.useState("");
    const [output, setOutput] = React.useState("");

    

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

    const test = () => {
        fetch('/backend/leaderboard/test');
    };


    React.useEffect(() => {
        fetchProblems();
        test();
    }, []);

    return <main>
        <textarea value={problems}></textarea>
    </main>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Dashboard />);