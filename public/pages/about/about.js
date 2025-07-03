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

/*fetches team data from mongo and inserts Member components*/
function MeetTheTeam() {
    
    console.log("Meet the team called");

    /* 
       state depends on result of db call
       loading is initially true bc duh
       leave members empty and error null
       we will update states after db call returns
    */
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const imagePath = "/resources/images/people/"; // improvement: make these images remotely hosted

    // useEffect handles the async nature of the db call
    // tracks if the call succeeds/fails, and properly
    // updates members/loading/error with whatever happens
    
    useEffect(() => { // the (() => {}) syntax means this function will run immediately
        async function fetchTeamMembers() {
            try {
                const response = await fetch('/database/directors?isActive=true'); // db call done here
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status ${response.status}`); // result of bad response; implies error state is true
                }
                
                // reaching here in execution means no errors
                // pull team data from the response object
                const board = await response.json();
                const persons = board.data.map(member => ({
                    src: imagePath + member["rcs"] + ".png",
                    name: member["name"],
                    title: member["role"]
                }));
                // set the members state and remove loading state
                setMembers(persons);
                setLoading(false);
            } catch(error) {
                // catch is triggered by an error (from !response.ok or otherwise)
                // set error state with the error message and remove loading state
                setError(error.message);
                setLoading(false);
            }
        }
        
        // call the function we just defined
        fetchTeamMembers();
    }, []); // empty array means function runs more than once (in the event of loading outcome)


    console.log("async db call finished");
    if (loading) {
        // text for loading state
        return <div>Loading team members ...</div>
    }

    if (error) {
        // text for error state
        return <div>Error with loading team members: {error.message}</div>
    }
    
    /*
       logic for building team cards. parse prez / vp data with keyword; all other roles are 'directors'
    */
    const presidents = members.filter(member => member.title.includes("President")); // Example filtering
    const directors = members.filter(member => member.title.includes("Director") && !member.title.includes("President"));

    /*
       the tier of directors is significant.
       first row of directors are the internally-facing positions: Logisitics, Finance, Resources (maybe changed to Education?)
       second row of directors are the externally-facing positions: Sponsorship, Marketing, Technology (tech is external bc rcos?)
    */
    var directors1 = directors.filter(member => !member.name.includes("Heman") && !member.name.includes("Jacob"));
    var directors2 = directors.filter(member => member.name.includes("Heman") || member.name.includes("Jacob"));


    /* builds the div with the parsed mongo data */
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

/* root function that calls the others. to add another section to this page, put a new div under <section> and add a function with the same name */
function Main() {
    return <section className="meet-the-team">
        <TeamHeader />
        <MeetTheTeam />
    </section>
}

/* I don't know if function names have to be capitalized I was going off of online examples :sobs: */
ReactDOM.createRoot(document.querySelector("main"))?.render(<Main />);