'use strict';

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
    
    var president = [members[0]];
    var vps = [members[1], members[2]];
    var directors = [members[3], members[4], members[5], members[6], members[7], members[8]];

    return <div className="card-container-container"> 
        <div className="card-container">
            {president.map((person, index) => (
                <Card key={index} {...person} />
            ))}
        </div>
        <div className="card-container">
            {vps.map((person, index) => (
                <Card key={index + 1} {...person} />
            ))}
        </div>
        <div className="card-container">
            {directors.map((person, index) => (
                <Card key={index + 3} {...person} />
            ))}
        </div>
    </div>
}

function Main() {
    return <main>
        <section className="meet-the-team">
            <MeetTheTeam />
        </section>
    </main>
}

ReactDOM.createRoot(document.querySelector("main"))?.render(<Main />);