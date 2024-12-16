import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {Spinner, Alert, Container, Navbar, Nav, Row, Col} from "react-bootstrap";

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [featuredImage, setFeaturedImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const username = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;
    const wordpressApiUrl = process.env.REACT_APP_WORDPRESS_API_URL;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${wordpressApiUrl}/wp-json/wp/v2/posts/${id}`, {
                    auth: { username, password },
                });
                const postData = response.data;

                setPost(postData);

                if (postData.featured_media) {
                    const mediaResponse = await axios.get(
                        `${wordpressApiUrl}/wp-json/wp/v2/media/${postData.featured_media}`,
                        { auth: { username, password } }
                    );
                    setFeaturedImage(mediaResponse.data);
                }
                setIsLoaded(true);
            } catch (err) {
                setError(err.message);
                setIsLoaded(true);
            }
        };

        fetchPost();
    }, [id, post, username, password, wordpressApiUrl]);

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand as={Link} to={'/'}>RAWB</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={"/"}>
                            Home
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="my-5">
                <Row>
                    <Col md={8}>
                        {error && (
                            <Alert variant="danger">
                                <strong>Error:</strong> {error}
                            </Alert>
                        )}
                        {!isLoaded ? (
                            <div className="text-center py-5 d-flex justify-content-center align-items-center" style={{minHeight: '55vh'}}>
                                <Spinner animation="grow" />;
                            </div>
                        ) : (
                            post && (
                                <article>
                                    {featuredImage && (
                                        <img
                                            src={
                                                featuredImage.media_details.sizes.medium.source_url ||
                                                featuredImage.source_url
                                            }
                                            srcSet={Object.values(featuredImage.media_details.sizes)
                                                .map((size) => `${size.source_url} ${size.width}w`)
                                                .join(", ")}
                                            sizes="(max-width: 768px) 100vw, 75vw"
                                            alt={featuredImage.alt_text || `${post.title.rendered}`}
                                            className="img-fluid mb-4"
                                        />
                                    )}
                                    <h1>{post.title.rendered}</h1>
                                    <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
                                </article>
                            )
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default PostPage;
