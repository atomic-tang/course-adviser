/**
 * Created by Andy on 13/10/17.
 */
import React, {Component} from 'react';
import styles from './Course.css';
import StarButton from 'material-ui/IconButton';
import StarIcon from 'material-ui-icons/Star';
import Card from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import firebase from 'firebase';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

class CourseReviewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            title: "",
            comment: "",
            open: false,
            message: "",
            edit: false
        }
    }

    componentWillMount() {
        if (this.props.review) {
            const review = this.props.review;

            this.setState({
                edit: true,
                rating: review.rating,
                title: review.title,
                comment: review.comment
            }, () => {
                this.renderRatingBar(this.state.rating);
            });
        } else {
            this.renderRatingBar(this.state.rating);
        }
    }

    setRating = (rating) => {
        this.setState({
            rating: rating
        });
        console.log(rating);
    }

    renderRatingBar = rating => {
        const stars = rating;
        const noStars = 5 - stars;
        const starRating = [];

        for (let i = 0; i < noStars; i++) {
            starRating.push(
                <StarButton className={styles.starBtn} onClick={event => {this.setRating(5 - i)}}>
                    <StarIcon className={styles.inactive}/>
                </StarButton>);
        }

        for (let i = 0; i < stars; i++) {
            starRating.push(
                <StarButton className={styles.starBtn} onClick={event => {this.setRating(stars - i)}}>
                    <StarIcon className={styles.active}/>
                </StarButton>);
        }

        return starRating;
    }

    handleTitleInput = event => {
        this.setState({
            title : event.target.value
        });
    }

    handleCommentInput = event => {
        this.setState({
            comment: event.target.value
        });
    }

    handleReviewSubmit = () => {
        if (this.state.title == "") {
            this.handleNotification("Please enter a title");
        } else if (this.state.comment == "") {
            this.handleNotification("Please enter a comment");
        } else if (this.state.rating == 0 ) {
            this.handleNotification("Please rate this course");
        } else {
            const rootRef = firebase.database().ref().child('courses').child(this.props.courseID);
            rootRef.child('reviews').child(localStorage.getItem('isLoggedIn')).set({
                rating: this.state.rating,
                timestamp: new Date().getTime(),
                title: this.state.title,
                comment: this.state.comment,
                key: localStorage.getItem('isLoggedIn')
            }).then(() => {
                this.handleNotification("Review posted");
            });
        }
    }

    handleReviewUpdate = () => {
        if (this.state.title == "") {
            this.handleNotification("Please enter a title");
        } else if (this.state.comment == "") {
            this.handleNotification("Please enter a comment");
        } else if (this.state.rating == 0 ) {
            this.handleNotification("Please rate this course");
        } else {
            const rootRef = firebase.database().ref().child('courses').child(this.props.courseID);
            rootRef.child('reviews').child(localStorage.getItem('isLoggedIn')).update({
                rating: this.state.rating,
                timestamp: new Date().getTime(),
                title: this.state.title,
                comment: this.state.comment
            }).then(() => {
                this.handleCancel();
                this.handleNotification("Review updated");
            });
        }
    }

    handleNotification = (message) => {
        this.setState({
            open: true,
            message: message
        });
    }

    handleCloseNotification = (event, reason) => {
        if(reason === 'clickaway') {
            return;
        }

        this.setState({
            open: false
        });
    }

    handleCancel = () => {
        this.setState({
            edit:false
        }, () => {
            this.props.cancel();
        });
    }

    render() {
        return (
            <Card className={styles.reviewForm}>
                {(this.state.edit) ? (<h3>Edit your Review</h3>) : (<h3>Write a Review</h3>)}
                <div className={styles.ratingScale}>
                    {this.renderRatingBar(this.state.rating).map(star => {
                        return (star)
                    })}
                </div>
                <div className={styles.reviewBody}>
                    <TextField
                        id = "title"
                        label = "Title"
                        className={styles.textField}
                        value={this.state.title}
                        onChange={this.handleTitleInput}/>
                    <TextField
                        id = "comment"
                        label = "Comment"
                        multiline
                        className={styles.textField}
                        value={this.state.comment}
                        onChange={this.handleCommentInput}/>

                </div>
                {(this.state.edit) ? (
                    <div className={styles.btnContainer}>
                        <Button className={styles.btn} onClick={this.handleReviewUpdate}>Update</Button>
                        <Button className={styles.flatBtn} onClick={this.handleCancel}>Cancel</Button>
                    </div>
                ) : (
                    <div className={styles.btnContainer}>
                        <Button className={styles.btn} onClick={this.handleReviewSubmit}>Post</Button>
                    </div>
                )}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.open}
                    autoHideDuration={6e3}
                    onRequestClose={this.handleCloseNotification}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                    action={
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseNotification}>
                            <CloseIcon />
                        </IconButton>
                    }
                />
            </Card>
        )
    }
}

export default CourseReviewForm;