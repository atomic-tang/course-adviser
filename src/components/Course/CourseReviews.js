/**
 * Created by Andy on 12/10/17.
 */
import React, {Component} from 'react';
import styles from './Course.css';
import firebase from 'firebase';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';
import CourseReview from './CourseReview';
import CourseReviewForm from './CourseReviewForm';
import SingleRating from '../Main/SingleRating';
import StarIcon from 'material-ui-icons/Star';

class CourseReviews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: [],
            ratings: [0,0,0,0,0],
            averageRating: 0,
            totalRatings : 0,
            reviewed: false,
            completed: false,
            open: false
        }
    }

    componentWillMount() {
        const courseID = this.props.courseID;
        const userRef = firebase.database().ref().child('users').child(localStorage.getItem('isLoggedIn')).child('completedCourses');
        const rootRef = firebase.database().ref().child('courses').child(courseID).child('reviews');
        const reviews = this.state.reviews;
        const ratings = this.state.ratings;
        let totalRating = 0;
        let numOfRatings = this.state.totalRatings;
        let reviewed = this.state.reviewed;

        userRef.on('value', snapshot => {
            if (snapshot.val()) {
                if (snapshot.val().indexOf(courseID) > -1) {
                    this.setState({
                        completedCourses: snapshot.val(),
                        completed: true
                    });
                } else {
                    this.setState({
                        completedCourses: snapshot.val()
                    });
                }
            }
        });

        rootRef.orderByChild('timestamp').on('child_added', snapshot => {
            if (snapshot.val()) {
                reviews.unshift({
                    [snapshot.key]: snapshot.val()
                });

                ratings[snapshot.val().rating - 1]++;
                totalRating += snapshot.val().rating;
                numOfRatings++;

                if (!reviewed) {
                    if (snapshot.key == localStorage.getItem('isLoggedIn')) {
                        reviewed = true;
                    }
                }

                this.setState({
                    reviews: reviews,
                    ratings : ratings,
                    averageRating: totalRating / numOfRatings,
                    totalRatings: numOfRatings,
                    reviewed: reviewed
                });
            }
        });

        rootRef.orderByChild('timestamp').on('child_changed', snapshot => {
            reviews.forEach((review,index) => {
                if (Object.keys(review) == snapshot.key) {
                    ratings[review[Object.keys(review)].rating - 1]--;
                    ratings[snapshot.val().rating - 1]++;
                    totalRating -= review[Object.keys(review)].rating;
                    totalRating += snapshot.val().rating;
                    reviews.splice(index,1);
                    reviews.unshift({
                        [snapshot.key]: snapshot.val()
                    });
                }
            });

            this.setState({
                reviews: reviews,
                ratings : ratings,
                averageRating: totalRating / numOfRatings
            });
        });

        rootRef.orderByChild('timestamp').on('child_removed', snapshot => {
            let averageRating;
            reviews.forEach((review,index) => {
                if (Object.keys(review) == snapshot.key) {
                    ratings[review[Object.keys(review)].rating - 1]--;
                    totalRating -= review[Object.keys(review)].rating;
                    numOfRatings--;
                    reviews.splice(index,1);
                    reviewed = false;
                }
            });

            if (numOfRatings == 0) {
                averageRating = 0;
            } else {
                averageRating = totalRating / numOfRatings;
            }

            this.setState({
                reviews: reviews,
                ratings : ratings,
                averageRating: averageRating,
                totalRatings: numOfRatings,
                reviewed: reviewed
            });
        });
    }

    handleClick = event => {
        this.setState({ open: true, anchorEl: event.currentTarget });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    render() {
        const ratings = this.state.ratings;
        const total = this.state.totalRatings;
        let averageRating;
        if (this.state.averageRating % 1 == 0) {
            averageRating = this.state.averageRating;
        } else {
            averageRating = this.state.averageRating.toFixed(1);
        }
        const reviews = this.state.reviews;

        return (
            <Grid container spacing={40}>
                <Grid item xs={12} md={6} lg={7}>
                    <div className={styles.reviewsContainer}>
                        {(reviews.length > 0) ? (
                            <Grid container spacing={16}>
                                {(!this.state.reviewed && this.state.completed) ? (
                                    <Grid item xs={12}>
                                        <CourseReviewForm courseID={this.props.courseID}/>
                                    </Grid>
                                ) : (null)}
                                {reviews.map(review => {
                                    return (
                                        <Grid key={Object.keys(review)} item xs={12}>
                                            <CourseReview review={review} courseID={this.props.courseID}/>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        ) : (
                            <div>
                                {(!this.state.reviewed && this.state.completed) ? (
                                    <Grid item xs={12}>
                                        <CourseReviewForm courseID={this.props.courseID}/>
                                    </Grid>
                                ) : (null)}
                                <span className={styles.noReviews}>There are no reviews for this course</span>
                            </div>
                        )}
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                    <div className={styles.ratingsContainer}>
                        <div className={styles.overallRating}>
                            <span>Overall Rating</span>
                            <h1>{averageRating}</h1>
                            <SingleRating rating={averageRating}/>
                        </div>
                        <div className={styles.ratings}>
                            {ratings.map((rating,index) => {
                                return (
                                    <div key={index + 1} className={styles.rating}>
                                        <div className={styles.stars}>
                                            <StarIcon/><span>{index + 1}</span>
                                        </div>
                                        <div className={styles.ratingBar}>
                                            <LinearProgress mode="determinate" value={(total > 0) ? (100 * rating / total) : (rating)}/>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Grid>
            </Grid>
        )
    }
}

export default CourseReviews;