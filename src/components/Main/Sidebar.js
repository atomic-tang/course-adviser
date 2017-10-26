/**
 * Created by Andy on 9/9/17.
 */
import React, {Component} from 'react';
import styles from './Sidebar.css';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import LogoutIcon from 'material-ui-icons/LockOpen';
import SearchIcon from 'material-ui-icons/Search';
import ProgramIcon from 'material-ui-icons/School';
import CourseIcon from 'material-ui-icons/Book';
import ProgressIcon from 'material-ui-icons/Timeline';
import {Link, NavLink} from 'react-router-dom';
import Search from './Search';
import firebase from 'firebase';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            courses: [],
            programs: [],
            username: ""
        };
        this.database = firebase.database().ref();
    }

    componentWillMount() {
        this.database.child('programs').orderByKey().on('value', snapshot => {
            const prevPrograms = snapshot.val();
            if (prevPrograms) {
                this.setState({
                    programs: prevPrograms
                }, () => {
                    this.database.child("users").child(localStorage.getItem('isLoggedIn')).on('value', snapshot => {
                        const username = snapshot.val().name;
                        this.setState({
                            username: username
                        });
                    });
                });
            }
        });

        this.database.child('courses').orderByKey()
            .on('value', snapshot => {
                const prevCourses = snapshot.val();
                if (prevCourses) {
                    this.setState({
                        courses: prevCourses
                    });
                }
            });

        this.database.child('courses').orderByKey()
            .on('child_changed', snapshot => {
                const prevCourses = snapshot.val();
                if (prevCourses) {
                    this.setState({
                        courses: prevCourses
                    });
                }
            });
    }

    toggleDrawer = (drawerState) => {
        this.setState({ open: drawerState });
    }

    handleOpen = () => {
        this.toggleDrawer(true);
    }

    handleClose = () => {
        this.toggleDrawer(false);
    }

    render() {

        return (
            <div id={styles.SideMenu} className={styles.SideWidth}>
                <div id={styles.Actionbar} className={styles.Sidebar}>
                    <Link to="/">
                        <div id={styles.LogoWhite} className={styles.Logo}></div>
                    </Link>
                    <IconButton
                        className={styles.Search}
                        key="search"
                        aria-label="Search"
                        onClick={this.handleOpen}
                        >
                        <SearchIcon />
                    </IconButton>
                    <IconButton
                        className={styles.Logout}
                        key="logout"
                        aria-label="Logout"
                        onClick={this.props.logout}>
                        <Link to="/login">
                            <LogoutIcon />
                        </Link>
                    </IconButton>
                </div>
                <nav>
                    <h1>Course Adviser</h1>
                    <ul>
                        <li><NavLink activeClassName={styles.active} to="/programs"><ProgramIcon/><span>Programs</span></NavLink></li>
                        <li><NavLink activeClassName={styles.active} to="/courses"><CourseIcon/><span>Courses</span></NavLink></li>
                        <li><NavLink activeClassName={styles.active} to="/progression"><ProgressIcon/><span>Progression</span></NavLink></li>
                    </ul>
                </nav>
                <div className={styles.username}>
                    Hi, {this.state.username}
                </div>
                <Drawer
                    id={styles.SearchDrawer}
                    open={this.state.open}
                    onRequestClose={this.handleClose}>
                    <div id={styles.SearchDrawer} className={styles.SideWidth}>
                        <div className={styles.Sidebar}>
                            <Link to="/">
                                <div id={styles.LogoColour} className={styles.Logo}></div>
                            </Link>
                            <IconButton
                                key="search"
                                aria-label="Search"
                                onClick={this.handleClose}
                            >
                                <SearchIcon />
                            </IconButton>
                            <IconButton
                                className={styles.Logout}
                                key="logout"
                                aria-label="Logout"
                                onClick={this.props.logout}>
                                <LogoutIcon />
                            </IconButton>
                        </div>
                        <Search close={this.handleClose.bind(this)} courses={this.state.courses} programs={this.state.programs} />
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default Sidebar;