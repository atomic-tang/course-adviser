/**
 * Created by Andy on 25/9/17.
 */
import React, {Component} from 'react';
import styles from './Program.css';
import firebase from 'firebase';
import MajorColumn from './MajorColumn';
import Grid from 'material-ui/Grid';
import ProgramCores from './ProgramCores';

class Major extends Component {
    constructor(props) {
        super(props);
        this.state = {
            majorID: '',
            major: {},
            options:[[]],
            cores: [[]],
            electives: [[]],
            courses:[]
        }
    }

    componentWillMount() {
        this.setMajor(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.setMajor(nextProps);
        }
    }

    setMajor = (props) => {
        if (props.programCourses) {

            const courses = [];
            const courseList = props.programCourses;

            Object.keys(courseList).forEach(key => {
                courses.push({[key] : courseList[key]});
            });

            this.setState({
                courses: courses
            });
        }

        this.setState({
            majorID: props.majorID
        }, () => {
            const rootRef = firebase.database().ref();
            rootRef.child('majors').child(this.state.majorID).on('value', snapshot => {
                const major = snapshot.val(),
                    options = [[]],
                    cores = [[]],
                    electives = [[]];
                let index = 0;

                major.cores.forEach((core) => {
                    if (core.length > 1) {
                        core.forEach(course => {
                            options[index].push([course]);
                        });

                        index++;
                        if (index !== major.cores.length - 1) {
                            options.push([]);
                        }

                    } else {
                        let level = parseInt(core[0].charAt(4),10);
                        if (level > cores.length) {
                            for(let i = 0; i < (level - cores.length + 1); i++) {
                                cores.push([]);
                            }
                        }
                        cores[level-1].push(core);
                    }
                });

                major.electives.forEach(elective => {
                    let level = parseInt(elective.charAt(4),10);
                    if (level > electives.length) {
                        for(let i = 0; i < (level - electives.length + 2); i++) {
                            electives.push([]);
                        }
                    }
                    electives[level-1].push([elective]);
                });

                this.setState({
                    major: major,
                    options: options,
                    cores: cores,
                    electives: electives
                });
            });
        })
    };

    render() {
        const col = Math.floor(12 / this.state.cores.length);
        const major = this.state.major;

        return (
            <div id={styles.major}>
                <h2><b>{this.state.majorID}</b> {major.name}</h2>
                <p>{major.outline}</p>
                {(this.state.courses !== null) ? this.state.courses.map((course,index) => {
                        return (
                            <ProgramCores key={index} columns={col} courses={course}/>
                        )
                    }) : (null)}
                <section>
                    <h3>Compulsory Core Courses</h3>
                    <Grid container spacing={16}>
                        {this.state.cores.map((core,index) => {
                            return (
                                <Grid item key={index} xs={12} md={col}>
                                    <MajorColumn level={index} courses={core}/>
                                </Grid>
                            )
                        })}
                    </Grid>
                </section>
                {(this.state.options[0].length > 0)
                    ? (
                        <section>
                            <h3>Compulsory Options</h3>
                            <Grid container spacing={16}>
                                {this.state.options.map((option,index) => {
                                    if (option.length >= 1) {
                                        return (
                                            <Grid item key={index} xs={12} md={col}>
                                                <MajorColumn index={index} options={option}/>
                                            </Grid>
                                        );
                                    } else {
                                        return (null)
                                    }
                                })}
                            </Grid>
                        </section>
                    ) : (null)}
                <section>
                    <h3>Electives</h3>
                    <Grid container spacing={16}>
                        {this.state.electives.map((elective,index) => {
                            if (elective.length >= 1) {
                                return (
                                    <Grid item key={index} xs={12} md={col}>
                                        <MajorColumn level={index} courses={elective}/>
                                    </Grid>
                                );
                            } else {
                                return (null)
                            }
                        })}
                    </Grid>
                </section>
            </div>
        )
    }
}

export default Major;