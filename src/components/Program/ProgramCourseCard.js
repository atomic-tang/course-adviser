/**
 * Created by Andy on 26/9/17.
 */
import React, {Component} from 'react';
import styles from './ProgramCourseCard.css';
import { Link } from 'react-router-dom';
import Card from 'material-ui/Card';
import Rating from '../Main/Rating';
import UOCIcon from 'material-ui-icons/Stars';
import GenEdIcon from 'material-ui-icons/Layers';
import firebase from 'firebase';

class ProgramCourseCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: [],
            courseProps: [],
            completed: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.course !== nextProps.course) {
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
            <Link className={styles.cardLink} to={
                {   pathname:`/courses/${this.state.courseID}`,
                    state: this.state.courseProps
                }}>
                <Card className={(this.state.completed) ? styles.courseCard : styles.itemCard}>
                    <h3><b>{this.state.courseID}</b> {this.state.courseProps.name}</h3>
                    <div className={styles.cardFooter}>
                        <ul>
                            <li className={styles.courseItem}>
                                <UOCIcon className={styles.uoc}/>
                                {`${this.state.courseProps.uoc} UOC`}
                            </li>
                            { (this.state.courseProps.genEd)
                                ? (
                                    <li className={styles.courseItem}>
                                        <GenEdIcon className={styles.GenEd}/>
                                    </li>
                                )
                                : (null)
                            }
                        </ul>
                        <div className={styles.ratingContainer}>
                            <Rating course={this.state.courseProps} />
                        </div>
                    </div>
                </Card>
            </Link>
        )
    }
}

export default ProgramCourseCard;