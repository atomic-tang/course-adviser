/**
 * Created by Andy on 9/9/17.
 */
import React, {Component} from 'react';
import styles from './Search.css';
import TextField from "material-ui/TextField";
import SearchResult from './SearchResult';
import ProgramSearchResult from './ProgramSearchResult';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query:'',
            courseResults:[],
            courses: [],
            programs:[],
            programResults:[]
        }
    }

    componentWillMount() {
        if (this.props.programs) {
            this.setState({
                programs: this.props.programs,
            });
        }

        if (this.props.courses) {
            this.setState({
                courses: this.props.courses,
            });
        }
    }


    handleSearchInput = event => {
        this.setState({
            query : event.target.value.toLowerCase(),
            courseResults: [],
            programResults: []
        }, () => {
            const courseResults = this.state.courseResults;
            const programResults = this.state.programResults;

            if(this.state.query !== '') {
                Object.keys(this.state.programs).forEach((key) => {
                    const programID = key;
                    const programProps = this.state.programs[key];
                    if(programProps.name.toLowerCase().indexOf(this.state.query) > -1 || programID.toLowerCase().indexOf(this.state.query) > -1) {
                        programResults.push({[key] : programProps});
                    }
                });

                Object.keys(this.state.courses).forEach((key) => {
                    const courseID = key;
                    const courseProps = this.state.courses[key];
                    if(courseProps.name.toLowerCase().indexOf(this.state.query) > -1 || courseID.toLowerCase().indexOf(this.state.query) > -1) {
                        courseResults.push({[key] : courseProps});
                    }
                });

                this.setState({
                    courseResults: courseResults,
                    programResults: programResults
                });
            } else {
                this.setState({
                    courseResults: [],
                    programResults: []
                });
            }
        });

    }

    render() {
        return (
            <div id={styles.Search}>
                <h1>Course Adviser</h1>
                <TextField
                    id = {styles.Searchbar}
                    className={styles.TextField}
                    label = "Search"
                    onChange={this.handleSearchInput}
                />
                <ul id={styles.SearchContainer}>
                    {this.state.programResults.map((program) => {
                        return(
                            <li key={Object.keys(program)}><ProgramSearchResult close={this.props.close} program={program}/></li>
                        )
                    })}
                    {this.state.courseResults.map((course) => {
                        return(
                            <li key={Object.keys(course)}><SearchResult close={this.props.close} course={course}/></li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default Search;