'use strict';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-column social">
                <h2>&gt;_RCPC</h2>
                <div className="social-icons">
                    <a href="https://www.instagram.com/rcpc_rpi/"><i className="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/company/rensselaer-competitive-programming-club/"><i className="fab fa-linkedin"></i></a>
                    <a href="https://discord.gg/MnUF3zTtrf"><i className="fab fa-discord"></i></a>
                    <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
            </div>

            <div className="footer-column location-time">
                <h3>Location & Time</h3>
                <p>Club Room: &lt;Insert&gt;</p>
                <p>Meeting Time: &lt;Insert&gt;</p>
            </div>

            <div className="footer-column contact">
                <h3>Contact Us</h3>
                <p>For Sponsorship, Partnership,<br />Donations:</p>
                <p>Contact us at rcpc@rpi.edu</p>
            </div>
        </footer>
    );
}

ReactDOM.createRoot(document.querySelector("footer"))?.render(React.createElement(Footer));
