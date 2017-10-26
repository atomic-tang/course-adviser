/**
 * Created by Andy on 29/9/17.
 */
import React, {Component} from 'react';
import styles from './Progression.css';
import { Link } from 'react-router-dom';
import UOCIcon from 'material-ui-icons/Stars';

class ProgressionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course : {},
            completed : false
        }
    }

    componentWillMount() {
        this.setState({
            course: this.props.course,
            completed: this.props.completed
        });
    }

    render() {
        const courseID = Object.keys(this.state.course);
        const course = this.state.course[courseID];

        return (
            <Link className={styles.progressionCard} to={`/courses/${courseID}`}>
                <div className={(this.state.completed) ? styles.completed : styles.pending }>
                    <div className={styles.courseID}>{courseID}</div>
                    <div className={styles.uoc}>
                        <UOCIcon/><span>{course.uoc}</span>
                    </div>
                </div>
            </Link>
        )
    }
}

export default ProgressionCard;