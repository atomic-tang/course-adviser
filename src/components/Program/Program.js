/**
 * Created by Andy on 25/9/17.
 */
import React, {Component} from 'react';
import styles from './Program.css';
import firebase from 'firebase';
import ProgramIcon from 'material-ui-icons/School';
import Tabs, {Tab} from 'material-ui/Tabs';
import ProgramOverview from './ProgramOverview';
import ProgramStructure from './ProgramStructure';

class Program extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programID: '',
            programProps: {},
            value: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.renderProgram(nextProps);
        }
    }

    componentWillMount() {
        this.renderProgram(this.props);
    }

    renderProgram = (props) => {
        if (props.location.state) {
            this.setState({
                programID: props.match.params.code,
                programProps: props.location.state
            })
        } else {
            const rootRef = firebase.database().ref();

            rootRef.child('programs').child(props.match.params.code).on('value', snapshot => {
                this.setState({
                    programID : props.match.params.code,
                    programProps: snapshot.val()
                });
            })
        }
    }

    handleChange = (event, value) => {
        this.setState({
            value: value
        })
    };

    render() {
        const programID = this.state.programID,
            program = this.state.programProps,
            value = this.state.value;
        return(
            <article>
                <header className={styles.programHeader}>
                    <div className={styles.container}>
                        <div className={styles.programTitle}>
                            <div className={styles.programIcon}>
                                <ProgramIcon/>
                            </div>
                            <h1><b>{programID}</b> {program.name}</h1>
                            <div className={styles.subtitle}>Undergraduate <i>·</i> {program.faculty} <i>·</i> {program.campus}</div>
                        </div>
                        <Tabs className={styles.tabs} value={value} onChange={this.handleChange}>
                            <Tab label="overview" />
                            <Tab label="majors" />
                        </Tabs>
                    </div>
                </header>
                <div className={styles.programBody}>
                    <div className={styles.container}>
                        {value === 0 && <ProgramOverview program={program}/>}
                        {value === 1 && <ProgramStructure program={program}/>}
                    </div>
                </div>
            </article>
        )
    }
}

export default Program;