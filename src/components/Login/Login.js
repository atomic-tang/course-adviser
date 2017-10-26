/**
 * Created by Andy on 9/9/17.
 */
import React, { Component } from 'react';
import styles from "./Login.css";
import Card from "material-ui/Card"
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";
import Snackbar from "material-ui/Snackbar";
import firebase from 'firebase';



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            open: false,
            message: ''
        }
    }

    handleNotification = (message) => {
        this.setState({
            open: true,
            message: message
        })
    }

    handleCloseNotification = (event, reason) => {
        if(reason === 'clickaway') {
            return;
        }

        this.setState({
            open: false
        });
    }

    handleUsernameInput = event => {
        this.setState({
            username : event.target.value
        })
    }

    handlePasswordInput = event => {
        this.setState({
            password : event.target.value
        })
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.checkLogin();
        }
    }

    checkLogin = () => {
        if (this.state.username === '') {
            this.handleNotification("Please enter your username");
        } else {
            firebase.database().ref().child('users').child(this.state.username).on('value', snapshot => {
                if (snapshot.val() == null) {
                    this.handleNotification("User does not exist");
                } else if (this.state.password === snapshot.val().password) {
                    localStorage.setItem('isLoggedIn', this.state.username );
                    this.props.login();
                } else {
                    this.handleNotification("Incorrect password");
                }
            });
        }
    }

    render() {
        return (
            <div id={styles.Login}>
                <Card id={styles.loginForm}>
                    <h1 id={styles.Logo}>Course Adviser</h1>
                    <TextField
                        id = "username"
                        label = "Username"
                        className={styles.textField}
                        onChange={this.handleUsernameInput}
                        onKeyPress = {this.handleKeyPress}/>
                    <TextField
                        id = "password"
                        label = "Password"
                        type="password"
                        className={styles.textField}
                        onChange={this.handlePasswordInput}
                        onKeyPress = {this.handleKeyPress}/>
                    <Button
                        id={styles.loginBtn}
                        raised
                        color="primary"
                        onClick={this.checkLogin}
                    >Login</Button>
                </Card>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6e3}
                    onRequestClose={this.handleCloseNotification}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                    action={
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseNotification}
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                />
            </div>

        )
    }
}

export default Login;