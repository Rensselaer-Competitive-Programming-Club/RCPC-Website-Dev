'use strict';

function Paragraph() {
    return <div className="paragraph">hi</div>
}

function LargeText() {
    return <div className="large-text">hello</div>
}

function AboutText() {
    return <div className="about-textbox">
        <Paragraph />
        <LargeText />
    </div>
}

function TeamHeader() {
    return <div className="card-container-title">
        <h1>Meet the Team</h1>
    </div>
}

function Card({src, name, title}) {
    return <div className="card">
        <img src={src} alt={name}/>
        <h2>{name}</h2>
        <h4>{title}</h4>
    </div >
}

function MeetTheTeam() {
    
    var imagePath = "/resources/images/people/";

    const members = [
        { src: imagePath + "marinc8.png", name: "CJ Marino", title: "Club President" },
        { src: imagePath + "partrm2.png", name: "Matthew Partridge", title: "Internal VP" },
        { src: imagePath + "baimej.png", name: "Jackson Baimel", title: "External VP" },
        { src: imagePath + "wenga.png", name: "Alan Weng", title: "Director of Finance" },
        { src: imagePath + "liewh.png", name: "Hin Yan Liew", title: "Director of Logistics" },
        { src: imagePath + "tianj4.png", name: "Jaden Tien", title: "Director of Resources" },
        { src: imagePath + "kollah.png", name: "Heman Kolla", title: "Director of Sponsorship" },
        { src: imagePath + "lleonj.png", name: "Jacob Lleonart", title: "Director of Marketing" },
        { src: imagePath + "hebbej.png", name: "Jacob Hebbel", title: "Director of Technology" }
    ];
    
    var presidents = [members[1], members[0], members[2]];
    var directors1 = [members[3], members[4], members[5]];
    var directors2 = [members[6], members[7], members[8]];

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
        <AboutText />
        <TeamHeader />
        <MeetTheTeam />
    </section>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Main />);