/**
 * Created by Andy on 29/9/17.
 */
import React, {Component} from 'react';
import styles from './Progression.css';
import ProgressionCard from './ProgressionCard';
import Grid from 'material-ui/Grid';

class ProgressionOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option : [],
            index : 0,
            completed: []

        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.setOptions(nextProps);
        }
    }

    componentWillMount() {
        this.setOptions(this.props);
    }

    setOptions = (props) => {
        this.setState({
            option: props.option,
            index: props.index + 1,
            completed: props.completed
        })
    }

    render() {
        return (
            <div className={styles.progressionOption}>
                <h3>{`Option ${this.state.index}`}</h3>
                <Grid container spacing={8}>
                    {this.state.option.map(option => {
                        return (
                            <Grid item key={Object.keys(option)} xs={6} md={12}>
                                <ProgressionCard completed={(this.state.completed.indexOf(Object.keys(option)[0]) > -1)} course={option}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

export default ProgressionOption;