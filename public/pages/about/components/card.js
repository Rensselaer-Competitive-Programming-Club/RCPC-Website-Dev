'use strict';

function Card({src, name, title}) {
    return <card>
        <img src={src} alt={name}/>
        <h2>{name}</h2>
        <h4>{title}</h4>
    </card>
}

ReactDOM.createRoot(document.querySelector("card"))?.render(React.createElement(Card));
