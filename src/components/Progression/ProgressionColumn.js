/**
 * Created by Andy on 29/9/17.
 */
import React, {Component} from 'react';
import styles from './Progression.css';
import firebase from 'firebase';
import ProgressionCard from './ProgressionCard';
import Grid from 'material-ui/Grid';
import ProgressionOption from './ProgressionOption';

class ProgressionColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses:[],
            options:[],
            uocTotal: 0,
            uocCompleted: 0,
            completed: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.renderProgressionColumn(nextProps);
        }
    }

    componentWillMount() {
        this.renderProgressionColumn(this.props);
    }

    renderProgressionColumn = (props) => {
        const columnName = Object.keys(props.courses);
        const prevCourses = props.courses[columnName].courses;
        const courses = [];
        const options = [[]];
        const rootRef = firebase.database().ref();
        const completedCourses = props.completed;
        let uocCompleted = 0;
        let index = 0;

        this.setState({
            options : []
        });

        if (prevCourses.length > 0) {
            prevCourses.forEach(course => {
                if (Array.isArray(course)) {
                    if (course.length > 1) {
                        course.forEach((option,i) => {
                            rootRef.child('courses').child(option).on('value', snapshot => {
                                if(snapshot.val()) {
                                    if(completedCourses.indexOf(snapshot.key) > -1) {
                                        uocCompleted += snapshot.val().uoc;
                                    }

                                    options[index].push(
                                        {[snapshot.key] : {
                                            "name": snapshot.val().name,
                                            "uoc": snapshot.val().uoc
                                        }}
                                    );

                                    if (i + 1 == course.length) {
                                        options.push([]);
                                        index++;
                                    }

                                    this.setState({
                                        options: options,
                                        uocCompleted: uocCompleted
                                    });

                                }
                            });
                        });
                    } else {
                        rootRef.child('courses').child(course[0]).on('value', snapshot => {
                            if(snapshot.val()) {
                                if(completedCourses.indexOf(snapshot.key) > -1) {
                                    uocCompleted += snapshot.val().uoc;
                                }

                                courses.push(
                                    {[snapshot.key] : {
                                        "name": snapshot.val().name,
                                        "uoc": snapshot.val().uoc
                                    }}
                                );

                                this.setState({
                                    courses: courses,
                                    uocCompleted: uocCompleted
                                });
                            }
                        });
                    }
                } else {
                    rootRef.child('courses').child(course).on('value', snapshot => {
                        if(snapshot.val()) {
                            if(completedCourses.indexOf(snapshot.key) > -1) {
                                uocCompleted += snapshot.val().uoc;
                            }
                            courses.push(
                                {[snapshot.key] : {
                                    "name": snapshot.val().name,
                                    "uoc": snapshot.val().uoc
                                }}
                            );

                            this.setState({
                                courses: courses,
                                uocCompleted: uocCompleted

                            });
                        }
                    });
                }
            });
        } else {
            this.setState({
                courses: courses,
                uocCompleted: uocCompleted
            });
        }

        this.setState({
            uocTotal: props.courses[columnName].uoc,
            completed: this.props.completed
        });
    }

    render() {
        return (
            <div className={styles.progressionColumn}>
                <div className={styles.columnHeader}>

                    <h2 className={styles.columnHeading}>{`${Object.keys(this.props.courses)}`.replace(/([a-z])([A-Z])/g, '$1 $2')}</h2>
                    <div className={styles.uocCount}>{`${this.state.uocCompleted} / ${this.state.uocTotal} UOC`}</div>
                </div>
                <div className={(this.state.uocTotal == this.state.uocCompleted) ? styles.complete : styles.incomplete}>
                    <Grid container spacing={8}>
                        {this.state.courses.map(course => {
                            return (
                                <Grid key={Object.keys(course)} item xs={6} md={12}>
                                    <ProgressionCard completed={(this.state.completed.indexOf(Object.keys(course)[0]) > -1)} course={course}/>
                                </Grid>
                            )
                        })}
                    </Grid>
                    {this.state.options.map((option,index) => {
                        return (
                            <ProgressionOption key={index} index={index} completed={this.state.completed} option={option} />
                        )
                    })}
                </div>

            </div>
        )
    }
}

export default ProgressionColumn;