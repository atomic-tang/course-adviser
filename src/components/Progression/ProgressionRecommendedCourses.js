/**
 * Created by Andy on 1/10/17.
 */
import React, {Component} from 'react';
import styles from './Progression.css';
import Grid from 'material-ui/Grid';
import firebase from 'firebase';
import CourseCard from '../Course/CourseCard';

class ProgressionRecommendedCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: []
        }
    }

    componentWillMount() {
        this.setRecommendations(this.props.recommendations)

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.recommendations !== nextProps.recommendations) {
            this.setRecommendations(nextProps.recommendations);
        }
    }

    setRecommendations = props => {
        const recommendations = props;
        const rootRef = firebase.database().ref().child('courses');
        const courses = [];

        recommendations.forEach(recommendation => {
            rootRef.child(recommendation).on('value', snapshot => {
               courses.push({
                   [snapshot.key] : snapshot.val()
               });

               this.setState({
                   courses: courses
               });
            });
        })
    }



    render() {
        const courses = this.state.courses;

        return (
            <Grid container spacing={16}>
                {courses.map(course => {
                    return (
                        <Grid item key={Object.keys(course)} xs={12} sm={6} lg={3}>
                            <CourseCard course={course}/>
                        </Grid>
                    )
                })}
            </Grid>
        )
    }
}

export default ProgressionRecommendedCourses;