import React, { Component } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";
import styles from './App.css';
import Login from './components/Login/Login';
import CourseView from "./components/Course/CourseView";
import CoursePage from "./components/Course/CoursePage";
import NotFound from "./NotFound";
import Sidebar from './components/Main/Sidebar';
import ProgramCatalogue from './components/Program/ProgramCatalogue';
import Program from './components/Program/Program';
import Progression from './components/Progression/Progression';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: null,
        }
    }

    componentDidMount() {
        try {
            this.setState({
                isLoggedIn: localStorage.getItem('isLoggedIn')
            });
        } catch(error) {

        }
    }

    login = () => {
        this.setState({
            isLoggedIn: localStorage.getItem('isLoggedIn')
        });
    }

    logout = () => {
        localStorage.removeItem('isLoggedIn');
        this.setState({
            isLoggedIn: null
        });
    }

    render() {
        return (
            <BrowserRouter>
                {(this.state.isLoggedIn == null)
                    ? (
                        <div id={styles.Main}>
                            <Switch>
                                <Route render={() => <Login login={this.login.bind(this)} />}/>
                            </Switch>
                        </div>
                    ) : (
                        <div id={styles.Main}>
                            <Sidebar logout={this.logout.bind(this)}/>
                            <div id={styles.Content}>
                                <Switch>
                                    <Route exact path="/" render={() => <Redirect to="/progression"/> }/>
                                    <Route path="/login" render={() => <Redirect to="/"/> }/>
                                    <Route exact path="/courses" component={CourseView}/>
                                    <Route path="/courses/:code" component={CoursePage}/>
                                    <Route exact path="/programs" component={ProgramCatalogue}/>
                                    <Route path="/programs/:code" component={Program}/>
                                    <Route path="/progression" render={() => <Progression loggedInUser={this.state.isLoggedIn} />}/>
                                    <Route path="/404" component={NotFound}/>
                                    <Route render={() => <Redirect to="/404"/>}/>
                                </Switch>
                            </div>
                        </div>
                    )
                }
            </BrowserRouter>
        )
    }
}

export default App;
