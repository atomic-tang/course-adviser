/**
 * Created by Andy on 1/10/17.
 */
import React, {Component} from 'react';
import styles from './Progression.css';
import firebase from 'firebase';
import ProgressionRecommendedCourses from './ProgressionRecommendedCourses';

class ProgressionRecommendation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendations:[]
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.completed !== nextProps.completed || this.props.structure !== nextProps.structure) {
            this.setRecommendations(nextProps);
        }
    }

    componentWillMount() {
        this.setRecommendations(this.props)
    }

    setRecommendations = props => {
        const currentTeachingPeriod = "S1";
        const rootRef = firebase.database().ref().child("courses");
        const structure = props.structure;
        const completedCourses = props.completed.slice();
        const recommendations = [];

        structure.forEach(criteria => {
            criteria[Object.keys(criteria)].courses.forEach(course => {
                let available = true;
                if (Array.isArray(course)) {
                    if (course.length > 1) {
                        course.forEach(option => {
                            rootRef.child(option).on('value', snapshot => {
                                available = this.checkAvailability(snapshot.val(), option, completedCourses, currentTeachingPeriod);
                            });
                        })
                    } else {
                        rootRef.child(course[0]).on('value', snapshot => {
                            available = this.checkAvailability(snapshot.val(), course[0], completedCourses, currentTeachingPeriod);
                        });
                    }
                } else {
                    rootRef.child(course).on('value', snapshot => {
                        available = this.checkAvailability(snapshot.val(), course, completedCourses, currentTeachingPeriod);
                    });
                }

                if (available && recommendations.length < 4) {
                    if (Array.isArray(course)) {
                        if (course.length > 1) {
                            recommendations.push(course[Math.floor(Math.random() * course.length)]);
                        } else {
                            recommendations.push(course[0]);
                        }
                    } else {
                        recommendations.push(course);
                    }

                    this.setState({
                        recommendations: recommendations
                    });
                }
            })
        })
    }


    checkAvailability = (snapshot, course, completedCourses, currentTeachingPeriod) => {
        let available = true;
        let completedPrerequisites = 0;

        if(snapshot) {
            if (snapshot.teachingPeriod) {
                if (snapshot.teachingPeriod.indexOf(currentTeachingPeriod) < 0) {
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

    render() {
        return (
            <ProgressionRecommendedCourses recommendations={this.state.recommendations} />
        )
    }
}

export default ProgressionRecommendation;