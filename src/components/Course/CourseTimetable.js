/**
 * Created by Andy on 14/10/17.
 */
import React, {Component} from 'react';
import styles from './Course.css';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import InstructorIcon from 'material-ui-icons/AccountCircle';
import TimeIcon from 'material-ui-icons/Schedule';
import EnrolmentIcon from 'material-ui-icons/Group';

const tableStyles = theme => ({
    paper: {
        width: '100%',
        marginTop: '1rem',
        overflowX: 'auto',
    },
});

class CourseTimetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timetable: []
        }
    }

    componentWillMount() {
        this.setState({
            timetable: this.props.timetable
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timetable !== this.props.timetable) {
            this.setState({
                timetable: nextProps.timetable
            });
        }
    }

    render() {
        const timetable = this.state.timetable;
        const { classes } = this.props;

        return (
            <div>
                {(timetable.length > 0) ? (
                        <Paper className={classes.paper}>
                            <Table className={styles.timetable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Activity</TableCell>
                                        <TableCell>Period</TableCell>
                                        <TableCell>Class</TableCell>
                                        <TableCell><EnrolmentIcon/><span>Enrolments</span></TableCell>
                                        <TableCell><TimeIcon/><span>Day and Time</span></TableCell>
                                        <TableCell><InstructorIcon/><span>Instructor</span></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {timetable.map((time,index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{(time.activity) ? (time.activity) : ("-")}</TableCell>
                                                <TableCell>{(time.teaching_period) ? (time.teaching_period) : ("-")}</TableCell>
                                                <TableCell>{(time.class) ? (time.class) : ("-")}</TableCell>
                                                <TableCell>
                                                    <div className={(time.enrolments && time.capacity && (time.enrolments == time.capacity)) ? (styles.full) : (styles.open)}>
                                                        {(time.enrolments) ? (`${time.enrolments} / `) : (null)}
                                                        {(time.capacity) ? (time.capacity) : (null)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {(time.day) ? (`${(time.day).substring(0,3)} `) : (null)}
                                                    {(time.start_time) ? (`${time.start_time} - `) : (null)}
                                                    {(time.end_time) ? (time.end_time) : (null)}
                                                    </TableCell>
                                                <TableCell>{(time.instructor) ? (time.instructor) : ("TBA")}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    ) : (<span>A timetable for this course is not available</span>) }
            </div>
        )
    }
}

export default withStyles(tableStyles)(CourseTimetable);