/**
 * Created by Andy on 18/9/17.
 */
import React, {Component} from 'react';
import styles from './Rating.css';
import StarIcon from 'material-ui-icons/Star';
import StarHalfIcon from 'material-ui-icons/StarHalf';
import StarBorderIcon from 'material-ui-icons/StarBorder';

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            reviews: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.course !== nextProps.course) {
            this.setRating(nextProps.course);
        }
    }

    componentWillMount() {
        this.setRating(this.props.course);
    }

    setRating = (props) => {
        this.setState({
            reviews: props.reviews
        }, () => {
            let rating = 0;
            if (this.state.reviews) {
                Object.keys(this.state.reviews).forEach(key => {
                    rating += this.state.reviews[key].rating;
                });
                rating /= Object.keys(this.state.reviews).length;
                this.setState({
                    rating: rating
                });
            } else {
                this.setState({
                    rating: 0
                });
            }
        });
    }

    renderRating = (rating) => {
        const stars = Math.floor(rating);
        const halfStars = rating % 1;
        const noStars = 5 - stars - Math.ceil(halfStars);
        const starRating = [];
        for (let i = 0; i < stars; i++) {
            starRating.push(<StarIcon className={styles.active}/>);
        }

        for (let i = 0; i < halfStars; i++) {
            starRating.push(<StarHalfIcon className={styles.active}/>);
        }

        for (let i = 0; i < noStars; i++) {
            starRating.push(<StarBorderIcon className={styles.inactive}/>);
        }

        return starRating;
    }

    render() {
        return(
            <div className={styles.Rating}>
                {this.renderRating(this.state.rating).map((star,index) => {
                    return(
                        <div key={index} className={styles.Star}>{star}</div>
                    );
                })}
            </div>
        )
    }
}

export default Rating;