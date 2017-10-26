/**
 * Created by Andy on 14/10/17.
 */
import React, {Component} from 'react';
import styles from './Course.css';
import ProgramCourseCard from '../Program/ProgramCourseCard';

class CoursePrerequisites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prerequisites: [],
            course: {},
            dependencies: []
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.props.progression !== nextProps.progression) {
            this.renderProgression(nextProps.progression);
        }

    }

    componentWillMount() {
        this.renderProgression(this.props.progression);
    }

    renderProgression = (props) => {
        const progression = props;
        const prerequisites = progression["prerequisites"];
        const course = progression["course"];
        const dependencies = progression["dependencies"];

        this.setState({
            prerequisites: prerequisites,
            course: course,
            dependencies: dependencies
        });
    }

    render() {
        const prerequisites = this.state.prerequisites;
        const course = this.state.course;
        const dependencies = this.state.dependencies;

        return (
            <div className={styles.progression}>
                {(dependencies.length >= 1) ? (
                        <div className={styles.dependencyFrame}>
                            <div className={(dependencies.length > 1) ? (styles.dependencies) : (styles.singleDependency)}>
                                {dependencies.map(dependency => {
                                    return (
                                        <div key={Object.keys(dependency)} className={styles.dependency}>
                                            <ProgramCourseCard course={dependency}/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (null)}
                <div className={styles.currentCourse}>
                    <div className={styles.current}>
                        {(prerequisites.length > 1) ? (<div className={styles.prerequisiteLink}></div>) : (null)}
                        <ProgramCourseCard course={course}/>
                        {(dependencies.length > 1) ? (<div className={styles.dependencyLink}></div>) : (null)}
                    </div>
                </div>
                {(prerequisites.length >= 1) ? (
                        <div className={styles.prerequisiteFrame}>
                            <div className={(prerequisites.length > 1) ? (styles.prerequisites) : (styles.singlePrerequisite)}>
                                {prerequisites.map(prerequisite => {
                                    return (
                                        <div key={Object.keys(prerequisite)} className={styles.prerequisite}>
                                            <ProgramCourseCard course={prerequisite}/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (null)}
            </div>
        )

    }
}

export default CoursePrerequisites;