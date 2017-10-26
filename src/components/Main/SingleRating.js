/**
 * Created by Andy on 13/10/17.
 */
import React, {Component} from 'react';
import styles from './SingleRating.css';
import StarIcon from 'material-ui-icons/Star';
import StarHalfIcon from 'material-ui-icons/StarHalf';
import StarBorderIcon from 'material-ui-icons/StarBorder';

class SingleRating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: [],
        }
    }

    componentWillMount() {
        this.renderRating(this.props.rating)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.rating !== nextProps.rating) {
            this.renderRating(nextProps.rating)
        }
    }

    renderRating = rating => {
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

        this.setState({
            rating: starRating
        });
    }

    render() {
        return (
            <div className={styles.singleRating}>
                {this.state.rating.map((star,index) => {
                    return (
                        <div key={index + 1} className={styles.star}>{star}</div>
                    )
                })}
            </div>
        )
    }
}

export default SingleRating;