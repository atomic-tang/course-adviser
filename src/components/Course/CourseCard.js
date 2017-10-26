/**
 * Created by Andy on 9/9/17.
 */
import React, {Component} from 'react';
import Card from 'material-ui/Card';
import styles from './CourseCard.css';
import { Link } from 'react-router-dom';
import Rating from '../Main/Rating';
import UOCIcon from 'material-ui-icons/Stars';
import ContactHoursIcon from 'material-ui-icons/Schedule';
import GenEdIcon from 'material-ui-icons/Layers';
import firebase from 'firebase';

class CourseCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: [],
            courseProps: [],
            completed: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            courseID: Object.keys(nextProps.course),
            courseProps: nextProps.course[Object.keys(nextProps.course)]
        }, () => {
            const rootRef = firebase.database().ref().child('users').child(localStorage.getItem('isLoggedIn'));
            rootRef.child('completedCourses').on('value', snapshot => {
                const completedCourses = snapshot.val();
                if (completedCourses.indexOf(this.state.courseID[0]) > -1) {
                    this.setState({
                        completed: true
                    });
                }
            });
        });

    }

    componentWillMount() {
        this.setState({
            courseID: Object.keys(this.props.course),
            courseProps: this.props.course[Object.keys(this.props.course)]
        }, () => {
            const rootRef = firebase.database().ref().child('users').child(localStorage.getItem('isLoggedIn'));
            rootRef.child('completedCourses').on('value', snapshot => {
                const completedCourses = snapshot.val();
                if (completedCourses.indexOf(this.state.courseID[0]) > -1) {
                    this.setState({
                        completed: true
                    });
                }
            });
        });
    }

    render() {
        return (
            <Link className={styles.CardLink} to={
                {   pathname:`/courses/${this.state.courseID}`,
                    state: this.state.courseProps
                }}>
                <Card className={(this.state.completed) ? styles.CompletedCard : styles.ItemCard}>
                    <div className={styles.CardHeader}>
                        <span className={styles.Lecturer}>
                            {(this.state.courseProps.lecturer)
                                ? this.state.courseProps.lecturer
                                : 'Lecturer'}
                        </span>
                        <div className={styles.RatingContainer}>
                            <Rating course={this.state.courseProps} />
                        </div>
                    </div>
                    <h3><b>{this.state.courseID}</b> {this.state.courseProps.name}</h3>
                    <div className={styles.CardFooter}>
                        <ul>
                            <li className={styles.CourseItem}>
                                <UOCIcon className={styles.UOC}/>
                                {`${this.state.courseProps.uoc} UOC`}
                            </li>
                            <li className={styles.CourseItem}>
                                <ContactHoursIcon className={styles.ContactHours}/>
                                {(this.state.courseProps.contactHours) ? `${this.state.courseProps.contactHours} HRS` : '3 HRS'}
                            </li>
                            { (this.state.courseProps.genEd)
                                ? (<GenEdIcon className={styles.GenEd}/>)
                                : (null)
                            }
                        </ul>
                    </div>
                </Card>
            </Link>
        )
    }
}

export default CourseCard;