/**
 * Created by Andy on 13/10/17.
 */
import React, {Component} from 'react';
import styles from './Course.css';
import Card from 'material-ui/Card';
import SingleRating from '../Main/SingleRating';
import moment from 'moment';
import MoreButton from 'material-ui/IconButton';
import MoreIcon from 'material-ui-icons/MoreVert';
import Menu, { MenuItem } from 'material-ui/Menu';
import CourseReviewForm from './CourseReviewForm';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import firebase from 'firebase';


class CourseReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "",
            rating: 0,
            comment: "",
            timestamp: 0,
            title: "",
            anchorEl: null,
            edit: false,
            open: false,
            delete: false
        }
    }

    componentWillMount() {
        this.renderReview(this.props.review);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.review !== this.props.review ) {
            this.renderReview(nextProps.review);
        }
    }

    renderReview = (propsReview) => {
        const userID = Object.keys(propsReview);
        const review = propsReview[userID];

        this.setState ({
            userID: userID,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            timestamp: review.timestamp
        });
    }

    handleClick = event => {
        this.setState({ open: true, anchorEl: event.currentTarget });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    handleOption = (event,index) => {
        if (index == 0) {
            this.setState({
                edit: true
            });
        } else if (index == 1) {
            this.setState({
                delete: true
            });
        }

        this.setState({
            open:false
        });
    }

    handleCancel = () => {
        this.setState({
            edit: false,
            delete: false
        });
    }

    handleReviewDelete = () => {
        const rootRef = firebase.database().ref().child('courses').child(this.props.courseID).child('reviews');
        rootRef.child(localStorage.getItem('isLoggedIn')).remove();
        this.handleCancel();
    }

    render() {
        const reviewDate = moment(this.state.timestamp).format('D MMM YY');
        const options = ["edit","delete"];
        const review = {
            rating: this.state.rating,
            title: this.state.title,
            comment: this.state.comment,
        };
        return (
            <div>
                {(this.state.edit) ? (
                    <CourseReviewForm courseID={this.props.courseID} review={review} cancel={this.handleCancel.bind(this)} />
                ) : (
                    <Card className={styles.review}>
                        {(this.state.userID == localStorage.getItem('isLoggedIn')) ? (
                            <div className={styles.moreMenu}>
                                <MoreButton className={styles.moreBtn}
                                    aria-label="More"
                                    aria-owns={this.state.open ? 'more-menu' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}>
                                    <MoreIcon/>
                                </MoreButton>
                                <Menu
                                    id="more-menu"
                                    anchorEl={this.state.anchorEl}
                                    open={this.state.open}
                                    onRequestClose={this.handleRequestClose}
                                >
                                    {options.map((option,index) => {
                                        return (
                                            <MenuItem key={option} onClick={event => {this.handleOption(event,index)}}>
                                                {option}
                                            </MenuItem>
                                        )
                                    })}
                                </Menu>
                            </div>
                        ) : (null)}
                        <div className={styles.reviewContent}>
                        <h3>{this.state.title}</h3>
                        <span className={styles.subtitle}>By {this.state.userID} <i>·</i> {reviewDate}</span>
                        <p>{this.state.comment}</p>
                        </div>
                        <SingleRating rating={this.state.rating}/>
                        <Dialog open={this.state.delete} onRequestClose={this.handleCancel}>
                            <DialogTitle>{"Delete Review"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete this review?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button className={styles.flatBtn} onClick={this.handleCancel}>
                                    Cancel
                                </Button>
                                <Button className={styles.btn} onClick={this.handleReviewDelete}>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Card>
                )}
            </div>
        )
    }
}

export default CourseReview;