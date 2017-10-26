/**
 * Created by Andy on 25/9/17.
 */
import React, {Component} from 'react';
import styles from './Program.css';
import {Link} from 'react-router-dom';
import Card from 'material-ui/Card';
import DurationIcon from 'material-ui-icons/EventNote';
import UOCIcon from 'material-ui-icons/Stars';

class ProgramCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programID: '',
            programProps: {},
        }
    }

    componentWillMount () {
        const program = this.props.program;
        this.setState({
            programID: Object.keys(program),
            programProps: program[Object.keys(program)]
        })

    }

    render() {
        const programID = this.state.programID;
        const program = this.state.programProps;
        return(
            <Link className={styles.cardLink} to={
                {   pathname:`/programs/${programID}`,
                    state: program
                }}>
                <Card className={styles.itemCard}>
                    <h3><b>{programID}</b> {program.name}</h3>
                    <div className={styles.cardFooter}>
                        <ul>
                            <li className={styles.programItem}>
                                <UOCIcon className={styles.uoc}/>
                                {`${program.minUocTotal} UOC`}
                            </li>
                            <li className={styles.programItem}>
                                <DurationIcon className={styles.duration}/>
                                {(program.duration) ? `${program.duration} YRS` : '3 YRS'}
                            </li>
                        </ul>
                    </div>
                </Card>

            </Link>
        )
    }
}

export default ProgramCard;