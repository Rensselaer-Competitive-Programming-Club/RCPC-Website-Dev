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
                const response = await fetch('/database/directors?isActive=true');
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status ${response.status}`);
                }

                const board = await response.json();
                const persons = board.data.map(member => ({
                    src: imagePath + member["rcs"] + ".png",
                    name: member["name"],
                    title: member["role"]
                }));
                setMembers(persons);
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

    // role collection s
    var directorsInternal = directors.filter(member => member.title.includes("Finance") || member.title.includes("Logistics") || member.title.includes("Resources"));
    var directorsExternal = directors.filter(member => member.title.includes("Marketing") || member.title.includes("Sponsorship") || member.title.includes("Technology"));

    return <div className="card-container-container"> 
        
        {/*inserts presidents items into page*/}
        <div className="card-container">
            {presidents.map((person, index) => (
                <Card key={index} {...person} />
            ))}
        </div>

        {/*inserts directorsInternal data into page as card objects*/}
        <div className="card-container">
            {directorsInternal.map((person, index) => (
                <Card key={index + 3} {...person} />
            ))}
        </div>

        {/*inserts external directors data into page as card objects*/}
        <div className="card-container">
            {directorsExternal.map((person, index) => (
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