/**
 * Created by Andy on 25/9/17.
 */
import React, {Component} from 'react';
import styles from './Program.css';
import Grid from 'material-ui/Grid';
import MaxIcon from 'material-ui-icons/TrendingUp';
import MinIcon from 'material-ui-icons/TrendingDown';
import StarsIcon from 'material-ui-icons/Stars';
import DurationIcon from 'material-ui-icons/Schedule';

class ProgramOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            program: {},
            courses: null
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.program !== nextProps.program) {
            this.renderOverview(nextProps.program);
        }
    }

    componentWillMount() {
        this.renderOverview(this.props.program);
    }

    renderOverview = (program) => {
        this.setState({
            program: program
        }, () => {
            if (this.state.program.courses) {

                const courses = [];
                const courseList = this.state.program.courses;

                Object.keys(courseList).forEach(key => {
                    courses.push({[key] : courseList[key]});
                });

                this.setState({
                    courses: courses
                });
            }
        });
    };

    render() {
        const program = this.state.program;
        return (
            <div className={styles.courseOverview}>
                <Grid container spacing={40}>
                    <Grid item xs={12} md={6} lg={7}>
                        <h2>Description</h2>
                        <div className={styles.programSummary}>
                            <Grid container spacing={8}>
                                <Grid item xs={3}>
                                    <div className={styles.programItemIcon}>
                                        <DurationIcon/>
                                    </div>
                                    {(program.duration) ? (<span>{`${program.duration} years`}</span>) : (<span>3 years</span>)}
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={styles.programItemIcon}>
                                        <MinIcon/>
                                    </div>
                                    <span>{`${program.minUocSemester} UOC / Semester`}</span>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={styles.programItemIcon}>
                                        <MaxIcon/>
                                    </div>
                                    <span>{`${program.maxUocSemester} UOC / Semester`}</span>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={styles.programItemIcon}>
                                        <StarsIcon/>
                                    </div>
                                    <span>{`${program.minUocTotal} UOC Total`}</span>
                                </Grid>
                            </Grid>
                        </div>
                        <p>{program.description}</p>
                    </Grid>
                    <Grid item xs={12} md={6} lg={5}>
                        <div className={styles.programStructure}>
                            <h2>Structure</h2>
                            {Object.keys(program.structure).map((key => {
                                return (
                                    <div key={key} className={styles.programItem}>
                                        <Grid container spacing={16}>
                                            <Grid item xs={6}>
                                                <div className={styles.programItemTitle}>{`${key}`.replace(/([a-z])([A-Z])/g, '$1 $2')}</div>
                                            </Grid>
                                            <Grid item xs={6}>
                                                {(program.structure[key].length > 1)
                                                    ? (<span>{`${program.structure[key][0]} to ${program.structure[key][1]} UOC`}</span>)
                                                    : (<span>{`${program.structure[key]} UOC`}</span>)
                                                }
                                            </Grid>
                                        </Grid>
                                    </div>
                                )
                            }))}
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default ProgramOverview;