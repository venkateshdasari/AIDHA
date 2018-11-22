import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import { login } from '../../utils/fetchAPI'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            email: "",
            password: "",
            isSignedIn: false,
            isWrongPassword: false,
            isUserTaken: false
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
    };

    handleLogin(){
        console.log(this.state);
        login(this.state.email, this.state.password, (resp) =>{
            let userInfo = {
                "firstName": resp.first_name,
                "lastName": resp.last_name,
                "monthlyIncome": resp.monthly_income,
                "userId": resp.user_id
            };
            this.setState({
              isSignedIn: true,
            });
            console.log(userInfo);
        }, (resp) => {
            if(resp.status === 403){
                this.setState({
                  isWrongPassword: true
                });
              console.log("Wrong password given")
            }
            else if(resp.status === 404){
                this.setState({
                  isUserTaken: true
                });
              console.log("UserID has been taken")
            }
        })
    }
    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        onClick={this.handleLogin}
                    >
                        Login
                    </Button>
                </form>
            </div>
        );
    }
}