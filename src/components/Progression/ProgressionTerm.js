/**
 * Created by Andy on 11/10/17.
 */
import React, {Component} from 'react';
import styles from './Progression.css';
import Grid from 'material-ui/Grid';
import firebase from 'firebase';
import ProgramCourseCard from '../Program/ProgramCourseCard';

class ProgressionTerm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.renderTerm(nextProps.courses);
        }
    }

    componentWillMount() {
        this.renderTerm(this.props.courses);
    }

    renderTerm = (propsCourses) => {
        const courseIDs = propsCourses;
        const courses = [];
        const rootRef = firebase.database().ref().child('courses');

        courseIDs.forEach(courseID => {
            rootRef.child(courseID).on('value', snapshot=> {
                if (snapshot.val()) {
                    courses.push({
                        [snapshot.key] : snapshot.val()
                    });
                    this.setState({
                        courses: courses
                    });
                }
            })
        });
    }

    render() {
        const courses = this.state.courses;

        return(
            <div className={styles.progressionTerm}>
                <Grid container spacing={16}>
                    {courses.map(course => {
                        return (
                            <Grid item key={Object.keys(course)} xs={6} md={12}>
                                <ProgramCourseCard course={course}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

export default ProgressionTerm;