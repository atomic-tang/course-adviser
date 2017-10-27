/**
 * Created by Andy on 23/9/17.
 */
import React, {Component} from 'react';
import styles from './CourseOverview.css';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import firebase from 'firebase';
import CourseProgression from './CourseProgression';


class CourseOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: {},
            progression: {dependencies: [], prerequisites: [], course: {}}
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.renderPrerequisites(nextProps);
        }
    }

    componentWillMount() {
        this.renderPrerequisites(this.props);
    }

    renderPrerequisites = props => {
        const rootRef = firebase.database().ref().child('courses');
        const courseID = props.courseID;
        const course = props.course;
        const prerequisites = [];
        const dependencies = [];

        rootRef.on('value', snapshot => {
            const courses = snapshot.val();

            Object.keys(courses).forEach(courseKey => {
                if (course.prerequisite) {
                    course.prerequisite.forEach(prerequisite => {
                        if (prerequisite == courseKey) {
                            prerequisites.push({
                                [courseKey] : courses[courseKey]
                            });
                        }
                    });
                }

                if (courses[courseKey].prerequisite) {
                    if (courses[courseKey].prerequisite.indexOf(courseID) > -1) {
                        dependencies.push({
                            [courseKey] : courses[courseKey]
                        });
                    }
                }
            });

            this.setState({
                course: course,
                progression: {
                    prerequisites : prerequisites,
                    course: {[courseID]: course },
                    dependencies : dependencies
                }
            });
        });
    }


    render() {
        const course = this.state.course;
        const progression = this.state.progression;

        return (
            <div className={styles.courseOverview}>
                <Grid container spacing={40}>
                    <Grid item xs={12} md={6} lg={7}>
                        <h2>Description</h2>
                        <p>{course.description}</p>
                    </Grid>
                    <Grid item xs={12} md={6} lg={5}>
                        <div className={styles.courseSummary}>
                            <Grid container spacing={24}>
                                <Grid item xs={6}>
                                    <div className={styles.courseItem}>Lecturer</div>
                                    <span>{course.lecturer}</span>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={styles.courseItem}>Campus</div>
                                    <span>{course.campus}</span>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={styles.courseItem}>Units of Credit</div>
                                    <span>{course.uoc}</span>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={styles.courseItem}>Contact Hours</div>
                                    {(course.contactHours) ? (<span>{course.contactHours}</span>) : (<span>3</span>)}
                                </Grid>
                                <Grid item xs={12}>
                                    {(course.courseOutlineUrl) ? (
                                        <a className={styles.btn} target="_blank" href={course.courseOutlineUrl}><Button>Course outline</Button></a>

                                    ) : (
                                        <a className={styles.btnDisabled} target="_blank"><Button disabled>no course outline</Button></a>
                                    )}
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    {(progression["prerequisites"].length < 1 && progression["dependencies"].length < 1) ? (null)
                        : (<Grid item xs={12}>
                            <h2>Progression</h2>
                            <CourseProgression progression={progression}/>
                            </Grid>
                        )}
                </Grid>
            </div>
        )
    }
}

export default CourseOverview;