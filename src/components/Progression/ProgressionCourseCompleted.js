/**
 * Created by Andy on 1/10/17.
 */
import React, {Component} from 'react';
import styles from './Progression.css';
import firebase from 'firebase';
import ProgramCourseCard from '../Program/ProgramCourseCard';

class ProgressionCourseCompleted extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.setCourse(nextProps.course);
        }
    }

    componentWillMount() {
        this.setCourse(this.props.course);
    }

    setCourse = (props) => {
        const course = props;
        const rootRef = firebase.database().ref();

        rootRef.child('courses').child(course).on('value', snapshot => {
            this.setState({
                course: {[snapshot.key] : snapshot.val()}
            })
        })
    }

    render() {
        return (
            <ProgramCourseCard course={this.state.course}/>
        )
    }
}

export default ProgressionCourseCompleted;