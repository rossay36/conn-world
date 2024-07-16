import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">CONN-WORLD</span></h1>
            </header>
            <main className="public__main">
                <p>Connect with Friends and Families, CONN-WORLD makes your world so easy and fun, Enjoy your world.</p>
                <address className="public__addr">
                    Connect Your world<br />
                    Let's Be Happy<br />
                    Let's Enjoy Together<br />
                    <div className='public_link'>
                    <Link className='Link' to="/login">Login</Link>
                    <Link className='Link' to="/register">Sign up</Link>
                    </div>
                </address>
                <br />
                <p>Owner: Obi Ross</p>
            </main>
            <footer className='public_footer'>
                <Link className='Link' to="/login">Login</Link>
                <Link className='Link' to="/register">Sign up</Link>
            </footer>
        </section>

    )
    return content
}
export default Public