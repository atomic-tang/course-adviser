/**
 * Created by Andy on 16/10/17.
 */
import React, {Component} from 'react';
import styles from './ProgramSearchResult.css';
import ProgramIcon from 'material-ui-icons/School';
import {Link} from 'react-router-dom';

class ProgramSearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programID: [],
            programProps: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.program !== this.props.program) {
            this.setState({
                programID: Object.keys(nextProps.program),
                programProps: nextProps.program[Object.keys(nextProps.program)],
            });
        }
    }

    componentWillMount() {
        this.setState({
            programID: Object.keys(this.props.program),
            programProps: this.props.program[Object.keys(this.props.program)],
        });
    }

    render() {
        return (
            <Link className={styles.programLink} onClick={this.props.close} to={
                {pathname:`/programs/${this.state.programID}`,
                    state: this.state.programProps}}>
                <div className={styles.programIcon}><ProgramIcon/></div>
                <span><b>{this.state.programID}</b> {this.state.programProps.name}</span>
            </Link>
        )
    }
}

export default ProgramSearchResult;