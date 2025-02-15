'use strict';

function Card({src, name, title}) {
    return <div class="card">
        <img src={src} alt={name}/>
        <h2>{name}</h2>
        <h4>{title}</h4>
    </div >
}

function Team() {

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

    return (
        <div className="card-container">
            {members.map((member, index) => (
                <Card key={index} {...member} />

            ))}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("card-container"))?.render(React.createElement(Team));
