import React, {useState, useEffect} from "react";
import axios from "axios";
import {Alert, Button, Carousel, Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";


const PostsSlider = ({title, withImages, params}) => {
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
                    auth: {username, password},
                    params: params,
                });

                const postsData = response.data;

                const mediaPromises = postsData.map(async (post) => {
                    if (post.featured_media) {
                        const mediaResponse = await axios.get(
                            `${wordpressApiUrl}/wp-json/wp/v2/media/${post.featured_media}`,
                            {
                                auth: {username, password},
                            }
                        );
                        return {...post, featured_image: mediaResponse.data};
                    }
                    return {...post, featured_image: null};
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
                <Carousel>

                    {posts.map((post) => (
                        <Carousel.Item key={post.id}>
                            <img src={
                                post.featured_image?.media_details?.sizes?.large
                                    ?.source_url || "placeholder.png"
                            }
                                 srcSet={generateSrcset(
                                     post.featured_image?.media_details?.sizes
                                 )}
                                 sizes="(max-width: 768px) 100vw, 50vw"
                                 style={{width: '100%', height: '100%', maxHeight: '540px', objectFit: 'cover'}}
                                 alt={post.featured_image?.alt_text || "Featured image"}/>
                            <Carousel.Caption className="mb-4 py-5 my-5">
                                <h3>
                                    {post.title.rendered}
                                </h3>
                                <i>
                                    <p className="" dangerouslySetInnerHTML={{__html: post.excerpt.rendered}}></p>
                                </i>
                                <div className="text-center">
                                    <Button as={Link} to={`/post/${post.id}`} variant="light" size="lg">
                                        Read More
                                    </Button>
                                </div>
                            </Carousel.Caption>

                        </Carousel.Item>
                    ))}

                </Carousel>
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

export default PostsSlider;
