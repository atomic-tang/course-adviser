/**
 * Created by Andy on 27/9/17.
 */
import React, {Component} from 'react';
import styles from './Program.css';
import firebase from 'firebase';
import Grid from 'material-ui/Grid';
import ProgramCourseCard from './ProgramCourseCard';

class ProgramOverviewOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            optionList: [],
            options: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.setOptions(nextProps)
        }
    }

    componentWillMount() {
        this.setOptions(this.props)
    }

    setOptions = (props) => {
        this.setState({
            index: props.index,
            optionList: props.option
        }, () => {
            const rootRef = firebase.database().ref();
            const courses = [];

            this.state.optionList.forEach((option) => {
                rootRef.child('courses').child(option).on('value', snapshot => {
                    if(snapshot.val()) {
                        courses.push({[snapshot.key]: snapshot.val()});
                        this.setState({
                            options: courses
                        })
                    }
                });
            });
        });
    }

    render() {
        return(
            <div className={styles.courseColumn}>
                <h5>{`Option ${this.state.index + 1}`} - Select One</h5>
                <Grid container spacing={16}>
                    {this.state.options.map(option => {
                        return (
                            <Grid key={Object.keys(option)} item xs={6} md={12}>
                                <ProgramCourseCard course={option}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

export default ProgramOverviewOption;