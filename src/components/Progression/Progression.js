/**
 * Created by Andy on 28/9/17.
 */
import React, {Component} from 'react';
import styles from './Progression.css';
import firebase from 'firebase';
import Grid from 'material-ui/Grid';
import ProgressionColumn from './ProgressionColumn';
import ProgressionIcon from 'material-ui-icons/Timeline';
import {Link} from 'react-router-dom';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import List, { ListItem, ListItemText, ListItemAvatar } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import ProgressionCourseCompleted from './ProgressionCourseCompleted';
import MajorIcon from 'material-ui-icons/School';
import ClearIcon from 'material-ui-icons/Clear';
import ProgressionRecommendation from './ProgressionRecommendation';
import ProgressionPlanner from './ProgressionPlanner';
import Tabs, {Tab} from 'material-ui/Tabs';
import Loader from '../Main/Loader';

class Progression extends Component {
    constructor(props) {
        super(props);
        this.state = {
            completedCourses: [],
            program: {},
            major: null,
            structure: [],
            open: false,
            selectedValue : 0,
            selectedMajor : '',
            tabValue: 0,
            loading: true
        }
    }

    componentWillMount() {
        const loggedInUser = this.props.loggedInUser;
        const rootRef = firebase.database().ref();
        rootRef.child('users').child(loggedInUser).on('value', snapshot => {
            if (snapshot.val().major !== '') {
                rootRef.child('majors').child(snapshot.val().major).on('value', major => {
                    this.setState({
                        major: {[major.key] : major.val()},
                        completedCourses : snapshot.val().completedCourses
                    }, () => {
                        const loggedInUser = this.props.loggedInUser;
                        const rootRef = firebase.database().ref();
                        rootRef.child('users').child(loggedInUser).child('program').on('value', userProgram => {
                            rootRef.child('programs').child(userProgram.val()).on('value', program => {
                                this.setState({
                                    program : {[program.key] : program.val()}
                                }, () => {
                                    const structure = [];
                                    const programID = Object.keys(this.state.program);
                                    const program = this.state.program[programID];
                                    const majorID = Object.keys(this.state.major);
                                    const major = this.state.major[majorID];
                                    let genEd = major.structure.genEds;

                                    Object.keys(major.structure).forEach(key => {
                                        structure.push({
                                            [key] : {
                                                "uoc" : major.structure[key],
                                                "courses" : []
                                            }
                                        });
                                    });

                                    if (program.courses) {
                                        Object.keys(program.courses).forEach(key => {
                                            structure.forEach(criteria => {
                                                if(key == Object.keys(criteria)) {
                                                    criteria[Object.keys(criteria)].courses = program.courses[key];
                                                }
                                            });
                                        });
                                    }

                                    if (this.state.major !== null) {
                                        Object.keys(major).forEach(key => {
                                            structure.forEach(criteria => {
                                                if(key == Object.keys(criteria)) {
                                                    criteria[Object.keys(criteria)].courses = major[key];
                                                }
                                            });
                                        });

                                        const coreCourses = structure.filter(core => Object.keys(core) == "cores")[0]["cores"].courses;
                                        coreCourses.forEach(core => {
                                            structure.forEach(criteria => {
                                                if (Object.keys(criteria)[0] !== "cores") {
                                                    criteria[Object.keys(criteria)].courses.forEach((course,index) => {
                                                        if (core.length > 1) {
                                                            core.forEach(option => {
                                                                if (Array.isArray(course)) {
                                                                    if (option == course[0]) {
                                                                        criteria[Object.keys(criteria)].courses.splice(index, 1)
                                                                    }
                                                                } else {
                                                                    if (option == course) {
                                                                        criteria[Object.keys(criteria)].courses.splice(index, 1)
                                                                    }
                                                                }
                                                            })
                                                        } else {
                                                            if (Array.isArray(course)) {
                                                                if (core[0] == course[0]) {
                                                                    criteria[Object.keys(criteria)].courses.splice(index, 1)
                                                                }
                                                            } else {
                                                                if (core[0] == course) {
                                                                    criteria[Object.keys(criteria)].courses.splice(index, 1)
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            })

                                        });
                                    }

                                    this.setState({
                                        structure: structure
                                    });

                                    this.state.completedCourses.forEach(completedCourse => {
                                        var unique = true;
                                        structure.forEach(criteria => {
                                            if (criteria[Object.keys(criteria)].courses.length > 0) {
                                                criteria[Object.keys(criteria)].courses.forEach(course => {
                                                    if (Array.isArray(course)) {
                                                        if(course.indexOf(completedCourse) > -1) {
                                                            unique = false;
                                                        }
                                                    } else {
                                                        if (course == completedCourse) {
                                                            unique = false;
                                                        }
                                                    }
                                                })
                                            }
                                        });

                                        if (unique) {
                                            rootRef.child('courses').child(completedCourse).once('value').then(snapshot => {
                                                if (snapshot.val().genEd && genEd > 0 && snapshot.val()) {
                                                    structure.forEach(criteria => {
                                                        if (Object.keys(criteria) == "genEds") {
                                                            criteria[Object.keys(criteria)].courses.push(completedCourse);
                                                            genEd -= snapshot.val().genEd;
                                                        }
                                                    });
                                                } else {
                                                    structure.forEach(criteria => {
                                                        if (Object.keys(criteria) == "freeElectives") {
                                                            criteria[Object.keys(criteria)].courses.push(completedCourse);
                                                        }
                                                    });
                                                }

                                                this.setState({
                                                    structure: structure
                                                }, () => {
                                                    this.setState({
                                                        loading: false
                                                    });
                                                });
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });
                })
            } else {
                this.setState({
                    completedCourses : snapshot.val().completedCourses
                }, () => {
                    const loggedInUser = this.props.loggedInUser;
                    const rootRef = firebase.database().ref();
                    rootRef.child('users').child(loggedInUser).child('program').on('value', userProgram => {
                        rootRef.child('programs').child(userProgram.val()).on('value', program => {
                            this.setState({
                                program: {[program.key]: program.val()}
                            }, () => {
                                this.setState({
                                   loading: false
                                });
                            });
                        });
                    });
                });
            }
        });
    }

    handleChange = (event, value) => {
        if (this.state.tabValue !== value) {
            this.setState({
                tabValue: value
            });
        }
    };

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };


    updateMajor = (value) => {
        const rootRef = firebase.database().ref();
        const loggedInUser = this.props.loggedInUser;
        const programID = Object.keys(this.state.program);
        const program = this.state.program[programID];

        if (value == -1) {
            this.setState({selectedValue: value, open: false, major:null },
                () => {
                    rootRef.child('users').child(loggedInUser).child('major').set("");
                });

        } else {
            this.setState({selectedValue: value, open: false},
                () => {
                    const index = this.state.selectedValue;
                    const major = program.majors[index];
                    rootRef.child('users').child(loggedInUser).child('major').set(`${major}`);
                });
        }
    }

    render() {
        const col = Math.floor(12 / this.state.structure.length);
        const programObject = this.state.program;
        const programID = Object.keys(this.state.program);
        const program = programObject[programID];
        const tabValue = this.state.tabValue;

        return (
            <div>
                <header className={styles.progressionHeader}>
                    <div className={styles.container}>
                        <div className={styles.headerContainer}>
                            <div className={styles.progressionIcon}>
                                <ProgressionIcon/>
                            </div>
                            {(program) ? (
                                <div className={styles.progressionTitle}>
                                    <Link className={styles.title} to={`/programs/${programID}`}>
                                        <h1><b>{programID}</b> {program.name}</h1>
                                    </Link>
                                    <div className={styles.subtitle}>You are currently enrolled in this program</div>
                                </div>
                                ) : (null)}
                        </div>
                        {(this.state.major !== null) ? (
                            <Tabs className={styles.tabs} value={tabValue} onChange={this.handleChange}>
                                <Tab label="progression" />
                                <Tab label="planner" />
                            </Tabs>
                            ) : (null)}
                    </div>
                </header>
                <div className={styles.progressionBody}>
                    {(this.state.major !== null) ? (
                        <div className={styles.container}>
                            { tabValue == 0 && (
                                <div>
                                    <h2 className={styles.majorTitle}>{this.state.major[Object.keys(this.state.major)].name}</h2>
                                    <Button className={styles.btn} onClick={this.handleClickOpen}>Change Major</Button>
                                    <Grid container spacing={0}>
                                        {this.state.structure.map(criteria => {
                                            return (
                                                <Grid key={Object.keys(criteria)} item xs={12} md={col}>
                                                    <ProgressionColumn completed={this.state.completedCourses} courses={criteria}/>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                    <div className={styles.recommendation}>
                                        <h2>Recommendations For Next Semester</h2>
                                        <ProgressionRecommendation completed={this.state.completedCourses} structure={this.state.structure}/>
                                    </div>
                                </div>
                            )}
                            { tabValue == 1 && (
                                <ProgressionPlanner completed={this.state.completedCourses} structure={this.state.structure}/>
                            )}
                        </div>
                    ) : (
                        <div className={styles.container}>
                            <h2 className={styles.heroTitle}>Declare your major</h2>
                            <Button className={styles.btn} onClick={this.handleClickOpen}>Select Major</Button>
                            <h3 className={styles.heroSubtitle}>What you have completed so far</h3>
                            <Grid container spacing={16}>
                                {this.state.completedCourses.map(course => {
                                    return (
                                        <Grid className={styles.courseCompleted} key={course} item xs={12} sm={6} md={4} lg={3}>
                                            <ProgressionCourseCompleted course={course}/>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </div>
                    )}
                </div>
                <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
                    <DialogTitle>Select Major</DialogTitle>
                        {(program) ? (
                            <List>
                                {program.majors.map((major,index) => {
                                    return (
                                        <ListItem key={major} button onClick={() => {this.updateMajor(index)}} >
                                            <ListItemAvatar>
                                                <Avatar className={styles.majorIcon}>
                                                    <MajorIcon/>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={major} />
                                        </ListItem>
                                    )
                                })}
                                <ListItem key="clear" button onClick={() => {this.updateMajor(-1)}} >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ClearIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Clear Major" />
                                </ListItem>
                            </List>
                        ) : (null)}
                </Dialog>
                <Loader loading={this.state.loading}/>
            </div>
        )
    }
}

export default Progression;