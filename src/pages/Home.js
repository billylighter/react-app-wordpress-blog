import {Container, Nav, Navbar} from "react-bootstrap";
import PostsRow from "../components/PostsRow";
import {Link} from "react-router-dom";
import PostsSlider from "../components/PostsSlider";

function Home(){
    return(
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand as={Link} to={'/'}>RAWB</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={'/'}>Home</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="my-5">

                <PostsRow title={'Breaking news 🔴'}
                          params={{categories: 9}}/>

                <PostsRow title={'Sport ⚽️'}
                          params={{categories: 6}}/>

                <PostsSlider title={'Entertainment️'}
                          params={{categories: 14}}/>

            </Container>

        </>

    )
}

export default Home;