import {Navbar, Nav} from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavbarComponent = () => {
    return (
        <Navbar className="sticky-top w-100" bg="dark" variant="dark">
            <div class="d-flex justify-content-center w-100">
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