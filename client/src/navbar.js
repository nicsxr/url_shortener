import {Navbar, Nav} from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavbarComponent = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <div class="d-flex justify-content-between w-100">
                <Navbar.Brand as={Link} class="urlText" to="/" exact>
                    URL Shortener
                </Navbar.Brand>
                <div class="d-flex">
                    <Nav.Link as={Link} to="/" exact>Home</Nav.Link>
                    <Nav.Link as={Link} to="/alias">Alias Statistics</Nav.Link>
                    <Nav.Link as={Link} to="/user">User Statistics</Nav.Link>
                </div>
            </div>
        </Navbar>
    )
}

export default NavbarComponent