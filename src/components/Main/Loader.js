/**
 * Created by Andy on 16/10/17.
 */
import React, {Component} from 'react';
import styles from './Loader.css';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';

const progressStyles = () => ({
    progress: {
        color: "#2bde73",
    },
});

class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true
        }
    }

    componentWillMount() {
        this.setState({
            loading: this.props.loading
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loading !== this.props.loading) {
            this.setState({
                loading: nextProps.loading
            });
        }
    }

    render() {
        const { classes } = this.props;
        if (this.state.loading) {
            return (
                <div className={styles.loader}>
                    <div className={styles.circularProgress}>
                        <CircularProgress className={classes.progress} size={64} />
                    </div>
                </div>
            )
        } else {
            return (null)
        }
    }
}

export default withStyles(progressStyles)(Loader);