import { useState, useEffect } from "react"
import styles from './NewsSlider.module.css'
const NewsSlider = () => {
    const [articles, setArticles] = useState([])
    useEffect(() => {
        // let url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${import.meta.env.VITE_API_KEY}`
        let url = `https://newsdata.io/api/1/latest?apikey=${import.meta.env.VITE_API_KEY_1}&q=example&language=en`
        fetch(url).then(response => response.json()).then(data => setArticles(data.results));
    }, [])
    console.log(articles);

    return (
        <div id="carouselExampleCaptions" className={` mx-auto my-3 carousel slide ${styles.container}`}>
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
            </div>
            <div className="carousel-inner">
                {articles.map((news, index) => {
                    return (
                        <div className={index === 1 ? "carousel-item active" : "carousel-item"} key={index}>
                            <img src={news.image_url ? news.image_url : "https://media.istockphoto.com/id/1300930548/video/breaking-news-template-for-tv-broadcast-news-show-program-with-3d-breaking-news-text-and.jpg?s=640x640&k=20&c=V9q9-UaoDqmhg7mKbOL4QMGAjWKJy0DBf1Mp61i7JkQ="} className="d-block w-100" style={{ height: '400px' }} alt="..." />
                            <div className="carousel-caption d-none d-md-block">
                                <a href={news.link}>
                                    <p style={{
                                        backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white",
                                        borderRadius: "5px"
                                    }}>
                                        {news.title}
                                    </p>
                                </a>
                            </div>
                        </div>
                    )
                })}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default NewsSlider;