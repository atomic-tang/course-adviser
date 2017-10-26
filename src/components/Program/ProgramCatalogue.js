/**
 * Created by Andy on 25/9/17.
 */
import React, {Component} from 'react';
import styles from './ProgramCatalogue.css';
import firebase from 'firebase';
import ProgramFaculty from './ProgramFaculty';
import Loader from '../Main/Loader';

class ProgramCatalogue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faculties: [],
            programs: [],
            facultyPrograms: [],
            loading: true
        }
    }

    componentWillMount() {
        const rootRef = firebase.database().ref();

        const prevFacultyPrograms = this.state.facultyPrograms;

        rootRef.child('programs').on('value', (snapshot) => {
            const prevPrograms = snapshot.val();
            this.setState({
                programs: prevPrograms
            });
            rootRef.child('faculties').on('value', (snapshot) => {
                const prevFaculty = snapshot.val();
                this.setState({
                    faculties: prevFaculty
                }, () => {
                    this.state.faculties.forEach(faculty => {
                        prevFacultyPrograms.push({
                            [faculty] : {
                                "programs": []
                            }
                        })
                    });
                    Object.keys(this.state.programs).forEach(programID => {
                        prevFacultyPrograms.forEach((faculty, index) => {
                            if (this.state.programs[programID].faculty === Object.keys(faculty)[0]) {
                                faculty[Object.keys(faculty)].programs.push({
                                    [programID]: this.state.programs[programID]
                                })
                            }
                        });
                    });
                    this.setState({
                        facultyPrograms: prevFacultyPrograms
                    }, () => {
                        this.setState({
                            loading: false
                        });
                    })
                })
            });
        });

    }

    render() {
        const faculties = this.state.facultyPrograms;
        return (
            <div className={styles.container}>
                <h1>Programs</h1>
                {faculties.map((faculty,index) => {
                    return (
                        <ProgramFaculty key={Object.keys(faculty)} programFaculty={faculty}/>
                    )
                })}
                <Loader loading={this.state.loading}/>
            </div>
        )
    }
}

export default ProgramCatalogue;