/**
 * Created by Andy on 27/9/17.
 */
import React, {Component} from 'react';
import styles from './Program.css';
import firebase from 'firebase';
import ProgramCourseCard from './ProgramCourseCard';
import Grid from 'material-ui/Grid';
import ProgramCoreOptions from './ProgramCoreOptions';

class ProgramOverviewCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            cores: [],
            options: [],
            columns: 6
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setCourses(nextProps);
        }
    }

    componentWillMount() {
        this.setCourses(this.props);
    }

    setCourses = (props) => {
        const courses = props.courses[Object.keys(props.courses)];
        const coresArray = [];
        const cores = [];
        const options = [];
        const rootRef = firebase.database().ref();

        courses.forEach((course) => {
            if (course.length > 1) {
                options.push(course);
            } else {
               coresArray.push(course);
            }
        });

        this.setState({
            options: options,
            title: Object.keys(props.courses),
            columns: props.columns
        });

        coresArray.forEach((core) => {
            rootRef.child('courses').child(core[0]).on('value', snapshot => {
                if(snapshot.val()) {
                    cores.push({[snapshot.key]: snapshot.val()});
                    this.setState({
                        cores: cores
                    })
                }
            });
        });
    };

    render() {
        return (
            <div className={styles.programCourses}>
                <h3 className={styles.title}>{`${this.state.title}`.replace(/([a-z])([A-Z])/g, '$1 $2')}</h3>
                <Grid container spacing={16}>
                    {this.state.cores.map((core,index) => {
                        return (
                            <Grid key={Object.keys(core)} item xs={12} sm={6} md={this.state.columns}>
                                <div className={styles.compulsoryCore}>
                                    <ProgramCourseCard course={core}/>
                                </div>
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid className={styles.coreOptions} container spacing={16}>
                    {(this.state.options.length > 0)
                        ? this.state.options.map((option,index) => {
                            return (
                                <Grid item key={index} xs={12} md={this.state.columns}>
                                    <ProgramCoreOptions key={index} index={index} option={option} />
                                </Grid>
                            )
                        }) : (null)
                    }
                </Grid>
            </div>

        )
    }
}

export default ProgramOverviewCourses;