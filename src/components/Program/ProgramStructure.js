/**
 * Created by Andy on 25/9/17.
 */
import React, {Component} from 'react';
import styles from './Program.css';
import Menu, {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Major from './Major';
import ChevronDownIcon from 'material-ui-icons/KeyboardArrowDown';

class ProgramStructure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            open: false,
            majors: [],
            selectedIndex: 0,
            selectedMajor: '',
            courses: []
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillMount() {
        this.setState({
            majors: this.props.program.majors,
            selectedMajor: this.props.program.majors[0],
            courses: this.props.program.courses
        });
    }

    handleClick = event => {
        this.setState({ open: true, anchorEl: event.currentTarget });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    handleSelectedMajor = (event,index) => {
        this.setState({
            selectedMajor: this.state.majors[index],
            selectedIndex: index,
            open: false
        });
    };

    render() {
        const majors = this.state.majors;
        return (
            <div id={styles.programStructure}>
                {(majors.length > 1)
                    ? (
                        <div className={styles.majorDropdown}>
                            <span>Select Major</span>
                            <Button
                                aria-owns={this.state.open ? 'majorMenu' : null}
                                aria-haspopup="true"
                                onClick={this.handleClick}
                            >
                                {this.state.selectedMajor}<ChevronDownIcon/>
                            </Button>
                            <Menu
                                id="majorMenu"
                                anchorEl={this.state.anchorEl}
                                open={this.state.open}
                                onRequestClose={this.handleRequestClose}
                            >
                                {majors.map((major,index) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            selected={index === this.state.selectedIndex}
                                            onClick={event => {this.handleSelectedMajor(event,index)}}>
                                            {major}
                                        </MenuItem>
                                    )
                                })}
                            </Menu>
                        </div>
                    ) : (null)}

                <Major programCourses={this.state.courses} majorID={this.state.selectedMajor}/>
            </div>
        )
    }
}

export default ProgramStructure;