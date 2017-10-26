/**
 * Created by Andy on 1/10/17.
 */
import React, {Component} from 'react';
import styles from './Progression.css';
import firebase from 'firebase';
import Switch from 'material-ui/Switch';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import ProgressionTerm from './ProgressionTerm';

const switchStyles = {
    bar: {},
    checked: {
        color: '#2bde73',
        '& + $bar': {
            backgroundColor: '#2bde73'
        }
    }
}

class ProgressionPlanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendations:[[]],
            trimesters: false,
            numOfTerms: 2
        }
    }

    componentWillMount() {
        this.setRecommendations(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.setRecommendations(nextProps);
        }
    }

    setRecommendations = props => {
        const rootRef = firebase.database().ref().child("courses");
        const structure = props.structure;
        let completedCourses = props.completed.slice();
        let completedTerm = [];
        const recommendations = [[]];
        const trimesters = this.state.trimesters;
        let numOfTerms = this.state.numOfTerms;

        if (!trimesters) {
            for (let i = 0; i < numOfTerms; i++) {
                structure.forEach(criteria => {
                    criteria[Object.keys(criteria)].courses.forEach(course => {
                        let available = true;
                        if (Array.isArray(course)) {
                            if (course.length > 1) {
                                course.forEach(option => {
                                    rootRef.child(option).on('value', snapshot => {
                                        available = this.checkAvailability(snapshot.val(), option, completedCourses, `S${i + 1}`);
                                    });
                                })
                            } else {
                                rootRef.child(course[0]).on('value', snapshot => {
                                    available = this.checkAvailability(snapshot.val(), course[0], completedCourses, `S${i + 1}`);
                                });
                            }
                        } else {
                            rootRef.child(course).on('value', snapshot => {
                                available = this.checkAvailability(snapshot.val(), course, completedCourses, `S${i + 1}`);
                            });
                        }

                        if (available && recommendations[i].length < 4) {
                            if (Array.isArray(course)) {
                                if (course.length > 1) {
                                    recommendations[i].push(course[Math.floor(Math.random() * course.length)]);
                                    completedTerm.push(course[Math.floor(Math.random() * course.length)]);
                                } else {
                                    recommendations[i].push(course[0]);
                                    completedTerm.push(course[0]);
                                }
                            } else {
                                recommendations[i].push(course);
                                completedTerm.push(course);
                            }
                        }
                    });
                });

                completedTerm.forEach(completed => {
                    completedCourses.push(completed);
                });

                completedTerm = [];

                this.setState({
                    recommendations: recommendations
                });

                if (i + 1 < numOfTerms) {
                    recommendations.push([]);
                }
            }
        } else {
            const uocPlan = this.shuffle([3,3,2]);
            var teachingPeriod = "S1";

            for (let i = 0; i < numOfTerms; i++) {
                if (i == 2) {
                    teachingPeriod = "S2";
                }
                structure.forEach(criteria => {
                    criteria[Object.keys(criteria)].courses.forEach(course => {
                        let available = true;
                        if (Array.isArray(course)) {
                            if (course.length > 1) {
                                course.forEach(option => {
                                    rootRef.child(option).on('value', snapshot => {
                                        available = this.checkAvailability(snapshot.val(), option, completedCourses, teachingPeriod);
                                    });
                                })
                            } else {
                                rootRef.child(course[0]).on('value', snapshot => {
                                    available = this.checkAvailability(snapshot.val(), course[0], completedCourses, teachingPeriod);
                                });
                            }
                        } else {
                            rootRef.child(course).on('value', snapshot => {
                                available = this.checkAvailability(snapshot.val(), course, completedCourses, teachingPeriod);
                            });
                        }

                        if (available && recommendations[i].length < uocPlan[i]) {
                            if (Array.isArray(course)) {
                                if (course.length > 1) {
                                    recommendations[i].push(course[Math.floor(Math.random() * course.length)]);
                                    completedTerm.push(course[Math.floor(Math.random() * course.length)]);
                                } else {
                                    recommendations[i].push(course[0]);
                                    completedTerm.push(course[0]);
                                }
                            } else {
                                recommendations[i].push(course);
                                completedTerm.push(course);
                            }
                        }
                    });
                });

                completedTerm.forEach(completed => {
                    completedCourses.push(completed);
                });

                completedTerm = [];

                this.setState({
                    recommendations: recommendations
                });

                if (i + 1 < numOfTerms) {
                    recommendations.push([]);
                }
            }
        }

    }

    shuffle = (array) => {
        let currentIndex = array.length;
        let temp, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temp;
        }

        return array;
    }

    checkAvailability = (snapshot, course, completedCourses, currentTeachingPeriod) => {
        let available = true;
        let completedPrerequisites = 0;

        if(snapshot) {
            if (snapshot.teachingPeriod) {
                if (snapshot.teachingPeriod.indexOf(currentTeachingPeriod) <= -1) {
                    available = false;
                } else {
                    for (let i = 0; i < completedCourses.length; i++) {
                        if (completedCourses[i] == course) {
                            available = false;
                            break;
                        } else {
                            if (snapshot.prerequisite) {
                                const totalPrerequisites = snapshot.prerequisite.length;
                                snapshot.prerequisite.forEach(prerequisite => {
                                    if (prerequisite == completedCourses[i]) {
                                        completedPrerequisites++;
                                    }

                                    if (completedPrerequisites !== totalPrerequisites) {
                                        available = false;
                                    } else {
                                        available = true;
                                    }
                                });
                            }
                        }
                    }
                }
            }
        } else {
            available = false;
        }
        return available;
    }

    handleChange = term => (event, checked) => {
        if (checked) {
            this.setState({
                [term]: checked,
                numOfTerms: 3
            }, () => {
                this.setRecommendations(this.props);
            });
        } else {
            this.setState({
                [term]: checked,
                numOfTerms: 2
            }, () => {
                this.setRecommendations(this.props);
            });
        }
    };

    render() {
        const { classes } = this.props;
        const col = 12 / this.state.numOfTerms;
        const recommendations = this.state.recommendations;

        return (
            <div>
                <div className={styles.plannerHeader}>
                    <h2>Recommended Year Plan</h2>
                    <div className={styles.switch}>
                        <div className={styles.switchLabel}>UNSW 3+</div>
                        <Switch
                            checked={this.state.trimesters}
                            onChange={this.handleChange('trimesters')}
                            aria-label="Trimesters"
                            classes={{
                                checked: classes.checked,
                                bar: classes.bar,
                            }}
                        />
                    </div>
                </div>
                <Grid container spacing={16}>
                    {recommendations.map((recommendation,index) => {
                        return (
                            <Grid item key={index} xs={12} md={col}>
                                {(this.state.trimesters) ? (<h3 className={styles.termHeading}>Trimester {index + 1}</h3>) : (<h3 className={styles.termHeading}>Semester {index + 1}</h3>)}
                                <ProgressionTerm courses={recommendation} col={col}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

export default withStyles(switchStyles)(ProgressionPlanner);