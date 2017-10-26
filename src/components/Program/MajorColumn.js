/**
 * Created by Andy on 25/9/17.
 */
import React, {Component} from 'react';
import styles from './Program.css';
import firebase from 'firebase';
import ProgramCourseCard from './ProgramCourseCard';
import Grid from 'material-ui/Grid';

class MajorCores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            level: null,
            index: null,
            courses:[]
        }
    }

    componentWillMount() {
        this.setCourses(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props!== nextProps) {
            this.setCourses(nextProps);
        }
    }

    setCourses = (props) => {
        if (props.courses) {
            const courseList = props.courses;
            const courses = [];
            const rootRef = firebase.database().ref();
            courseList.forEach((course) => {
                rootRef.child('courses').child(course[0]).on('value', snapshot => {
                    if (snapshot.val()) {
                        courses.push({[snapshot.key]: snapshot.val()});
                    }
                })
            });

            this.setState({
                level: props.level,
                courses: courses
            });
        } else {
            const options = props.options;
            const courses = [];
            const rootRef = firebase.database().ref();
            options.forEach((option) => {
                rootRef.child('courses').child(option[0]).on('value', snapshot => {
                    if (snapshot.val()) {
                        courses.push({[snapshot.key]: snapshot.val()});
                    }
                })
            });

            this.setState({
                index: props.index,
                courses: courses
            });
        }
    }

    render() {
        var level = "First";
        var option = this.state.index;

        switch (this.state.level + 1) {
            case 2 : level = "Second"; break;
            case 3 : level = "Third"; break;
            case 4 : level = "Fourth"; break;
            case 5 : level = "Fifth"; break;
            default: break;
        }

        return(
            <div className={styles.courseColumn}>
                {(option !== null) ? (<h5>{`Option ${option + 1} - Select One`}</h5>) : (<h5>{`${level} Year`}</h5>)}
                <Grid container spacing={16}>
                    {this.state.courses.map((course) => {
                        return (
                            <Grid key={Object.keys(course)} item xs={6} md={12}>
                                <ProgramCourseCard course={course}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

export default MajorCores;