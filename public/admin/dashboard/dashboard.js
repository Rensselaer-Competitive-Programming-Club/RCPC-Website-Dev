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

    function fetchProblems() {
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
    }

    const fetchSubmissions = async () => {
        const handle = "MPartridge";
        try {
          const response = await fetch(
            `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`
          );
          const data = await response.json();
    
          if (data.status !== 'OK') {
            setOutput('Error: ' + data.comment);
            return;
          }
    
          const okSubmissions = data.result.filter(sub => sub.verdict === 'OK');
          const problems = okSubmissions.slice(0, 5).map(sub => {
            const p = sub.problem;
            return `${p.contestId}${p.index} - ${p.name}`;
          });
    
          setOutput(`${handle} 5 most recent solved problems:\n${problems.join('\n')}`);
        } catch (err) {
          setOutput('Fetch error: ' + err.message);
        }
      };

    React.useEffect(() => {
        fetchProblems();
        fetchSubmissions();
    }, []);

    return <main>
        <textarea value={output}></textarea>
    </main>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Dashboard />);