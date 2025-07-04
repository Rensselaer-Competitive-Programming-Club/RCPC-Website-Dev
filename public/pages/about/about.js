'use strict';

const { useState, useEffect } = React;

/*makes the text that says "Meet the Team"*/
function TeamHeader() {
    return <div className="card-container-title">
        <h1>Meet the Team</h1>
    </div>
}

/*card is composed of an image, name, and title*/
function Card({src, name, title}) {
    return <div className="card">
        <img src={src} alt={name}/>
        <h2>{name}</h2>
        <h4>{title}</h4>
    </div >
}

/*generates a card component for every name in the json*/
/*in the future, data should be fetched from db*/
function MeetTheTeam() {
    
    console.log("Meet the team called");

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const imagePath = "/resources/images/people/";

    // useEffect handles the async nature of the db call
    // tracks if the call succeeds/fails, and properly
    // updates members/loading/error with whatever happens
    useEffect(() => {
        async function fetchTeamMembers() {
            try {
                const response = await fetch('/api/directors');
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status ${response.status}`);
                }
                
                let board = (await response.json()).data;
                board = board.filter(officer => officer.isActive == true);
                board = board.map(member => ({
                    src: imagePath + member["rcs"] + ".png",
                    name: member["name"],
                    title: member["role"]
                }));
                setMembers(board);
                setLoading(false);
            } catch(error) {
                setError(error.message);
                setLoading(false);
            }
        }

        fetchTeamMembers();
    }, []); // empty array means function runs more than once (in the event of loading outcome)


    console.log("async db call finished");
    if (loading) {
        return <div>Loading team members ...</div>
    }

    if (error) {
        return <div>Error with loading team members: {error.message}</div>
    }
    
    const presidents = members.filter(member => member.title.includes("President")); // Example filtering
    const directors = members.filter(member => member.title.includes("Director") && !member.title.includes("President"));

    var directors1 = directors.filter(member => !member.name.includes("Heman") && !member.name.includes("Jacob"));
    var directors2 = directors.filter(member => member.name.includes("Heman") || member.name.includes("Jacob"));

    return <div className="card-container-container"> 
        
        {/*inserts presidents items into page*/}
        <div className="card-container">
            {presidents.map((person, index) => (
                <Card key={index} {...person} />
            ))}
        </div>

        {/*inserts directors1 items into page*/}
        <div className="card-container">
            {directors1.map((person, index) => (
                <Card key={index + 3} {...person} />
            ))}
        </div>

        {/*inserts directors2 items into page*/}
        <div className="card-container">
            {directors2.map((person, index) => (
                <Card key={index + 3} {...person} />
            ))}
        </div>
    </div>
}

function Main() {
    return <section className="meet-the-team">
        <TeamHeader />
        <MeetTheTeam />
    </section>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Main />);