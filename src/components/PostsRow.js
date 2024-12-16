import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";

const PostsRow = ({ title, withImages, params }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    const username = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;
    const wordpressApiUrl = process.env.REACT_APP_WORDPRESS_API_URL;

    useEffect(() => {
        const fetchPosts = async (params) => {
            const url = `${wordpressApiUrl}/wp-json/wp/v2/posts`;

            try {

                const response = await axios.get(url, {
                    auth: { username, password },
                    params: params,
                });

                const postsData = response.data;

                const mediaPromises = postsData.map(async (post) => {
                    if (post.featured_media) {
                        const mediaResponse = await axios.get(
                            `${wordpressApiUrl}/wp-json/wp/v2/media/${post.featured_media}`,
                            {
                                auth: { username, password },
                            }
                        );
                        return { ...post, featured_image: mediaResponse.data };
                    }
                    return { ...post, featured_image: null };
                });

                const postsWithMedia = await Promise.all(mediaPromises);
                setPosts(postsWithMedia);
                setIsLoaded(true);
            } catch (err) {
                setError(err.message);
                setIsLoaded(true);
            }
        };

        fetchPosts(params);
    }, [params, username, password, wordpressApiUrl]);

    const generateSrcset = (sizes) => {
        if (!sizes) return "";
        return Object.values(sizes)
            .map((size) => `${size.source_url} ${size.width}w`)
            .join(", ");
    };

    return (
        <section className="posts mb-4">
            <h2 className="bg-dark text-white py-2 px-3">{title}</h2>
            {error && (
                <Alert className="py-5 px-2 text-xl-center" variant="danger">
                    <strong>Something went wrong... ⛔️</strong>
                </Alert>
            )}

            {isLoaded ? (
                <Row>
                    {posts.map((post) => (
                        <Col key={post.id} lg={3} md={4}>
                            <Card className="d-flex">
                                {withImages &&
                                    <Card.Img
                                        variant="top"
                                        src={
                                            post.featured_image?.media_details?.sizes?.medium
                                                ?.source_url || "placeholder.png"
                                        }
                                        srcSet={generateSrcset(
                                            post.featured_image?.media_details?.sizes
                                        )}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        alt={post.featured_image?.alt_text || "Featured image"}
                                    />}
                                <Card.Body>
                                    <Card.Title>{post.title.rendered}</Card.Title>
                                    <Card.Text
                                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                    ></Card.Text>
                                    <Button as={Link}
                                            to={{pathname: `/post/${post.id}`}}
                                            state={{post: post}}
                                            variant="dark"
                                            size="md">
                                        Read More
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
        </section>
    );
};

export default PostsRow;
