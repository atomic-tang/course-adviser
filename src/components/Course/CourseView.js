/**
 * Created by Andy on 9/9/17.
 */
import React, { Component } from 'react';
import styles from './CourseView.css';
import firebase from 'firebase';
import CourseSubject from './CourseSubject';
import Loader from '../Main/Loader';


class CourseView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: {},
            subjects: {},
            courseSubjects: [],
            loading: true
        }
    }

    componentWillMount(){
        const rootRef = firebase.database().ref();

        const prevCourseSubjects = this.state.courseSubjects;

        rootRef.child('courses').on('value', (snapshot) => {
            const prevCourses = snapshot.val();
            this.setState({
                courses : prevCourses
            });
            rootRef.child('subjects').on('value', (snapshot) => {
                const prevSubjects = snapshot.val();
                this.setState({
                    subjects: prevSubjects
                }, () => {
                    Object.keys(this.state.subjects).forEach(subjectID => {
                        prevCourseSubjects.push({
                            [subjectID] : {
                                "name": this.state.subjects[subjectID].name,
                                "courses":[]
                            }
                        })
                    });
                    Object.keys(this.state.courses).forEach(courseID => {
                        prevCourseSubjects.forEach((subject,index) => {
                            if(courseID.substring(0,4) === Object.keys(subject)[0]) {
                               subject[Object.keys(subject)].courses.push({
                                   [courseID] : this.state.courses[courseID]
                               })
                            }
                        });
                    });
                    this.setState({
                        courseSubjects: prevCourseSubjects
                    }, () => {
                        this.setState({
                            loading: false
                        });
                    });
                });
            });
        });
    }

    render() {
        return(
           <div className={styles.container}>
                <h1>Course</h1>
               {this.state.courseSubjects.map((courseSubject) => {
                    return (
                        <CourseSubject key={Object.keys(courseSubject)} courseSubject={courseSubject}/>
                    )
               })}
               <Loader loading={this.state.loading}/>
           </div>
        )
    }
}

export default CourseView;