/**
 * Created by Andy on 17/9/17.
 */
import React, {Component} from 'react';
import styles from './SearchResult.css';
import CourseIcon from 'material-ui-icons/Book';
import {Link} from 'react-router-dom';
import Rating from './Rating';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: [],
            courseProps: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.course !== this.props.course) {
            this.setState({
                courseID: Object.keys(nextProps.course),
                courseProps: nextProps.course[Object.keys(nextProps.course)],
            });
        }
    }

    componentWillMount() {
        this.setState({
            courseID: Object.keys(this.props.course),
            courseProps: this.props.course[Object.keys(this.props.course)],
        });
    }

    render() {
        return (
            <Link className={styles.CourseLink} onClick={this.props.close} to={
                {pathname:`/courses/${this.state.courseID}`,
                    state: this.state.courseProps}}>
                <div className={styles.CourseIcon}><CourseIcon/></div>
                <span><b>{this.state.courseID}</b> {this.state.courseProps.name}</span>
                <div className={styles.RatingContainer}>
                    <Rating className={styles.Rating} course={this.state.courseProps}/>
                </div>
            </Link>
        )
    }
}

export default SearchResult;