/**
 * Created by Andy on 9/9/17.
 */
import React, { Component } from 'react';
import styles from './CoursePage.css';
import CourseIcon from 'material-ui-icons/Book';
import Tabs, {Tab} from 'material-ui/Tabs';
import Rating from '../Main/Rating';
import CourseOverview from './CourseOverview';
import firebase from 'firebase';
import CourseReviews from './CourseReviews';
import CourseTimetable from './CourseTimetable';
import Loader from '../Main/Loader';


class CoursePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: '',
            courseProps: [],
            value : 0,
            loading: true
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            const rootRef = firebase.database().ref();
            rootRef.child('courses').child(nextProps.match.params.code).on('value', snapshot => {
                this.setState({
                    courseID : nextProps.match.params.code,
                    courseProps: snapshot.val()
                });
            }, () => {
                this.handleLoading();
            });
        }
    }

    componentWillMount() {
        if (this.props.location.state) {
            this.setState({
                courseID: this.props.match.params.code,
                courseProps: this.props.location.state
            }, () => {
                this.handleLoading();
            });
        } else {
            const rootRef = firebase.database().ref();

            rootRef.child('courses').child(this.props.match.params.code).on('value', snapshot => {
                this.setState({
                    courseID : this.props.match.params.code,
                    courseProps: snapshot.val()
                }, () => {
                    this.handleLoading();
                });
            });
        }
    }

    handleLoading = () => {
        this.setState({
           loading:false
        });
    }

    handleChange = (event, value) => {
        this.setState({
            value: value
        })
    };

    render() {
        const courseID = this.state.courseID,
              course = this.state.courseProps,
              value = this.state.value,
              timetable = [];
        if (course.timetable) {
            course.timetable.forEach(time => {
               timetable.push(time);
            });
        }
        return (
            <article>
                <header className={styles.courseHeader}>
                    <div className={styles.container}>
                        <div className={styles.courseTitle}>
                            <div className={styles.courseIcon}>
                                <CourseIcon/>
                            </div>
                            <h1><b>{courseID}</b> {course.name}</h1>
                            <Rating course={course}/>
                        </div>
                        <Tabs className={styles.tabs} value={value} onChange={this.handleChange}>
                            <Tab label="overview" />
                            <Tab label="timetable" />
                            <Tab label="reviews" />
                        </Tabs>
                    </div>
                </header>
                <div className={styles.courseBody}>
                    <div className={styles.container}>
                        {value === 0 && <CourseOverview courseID={courseID} course={course}/>}
                        {value === 1 && <CourseTimetable timetable={timetable}/>}
                        {value === 2 && <CourseReviews courseID={courseID}/>}
                    </div>
                </div>
                <Loader loading={this.state.loading}/>
            </article>
        )
    }
}

export default CoursePage;