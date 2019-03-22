import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import css from "./authed.module.css";
import Stepper from "@material-ui/core/Stepper";

const API_URL = process.env.REACT_APP_API_URL;

class Authed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: Boolean(localStorage.getItem("mytoken")),
      email: "",
      password: "",
      firstName: "",
      lastname: "",
      isLoading: false
    };
  }

  onChange = event => {
    const { value, name } = event.target;
    this.setState(state => ({
      [name]: value
    }));
  };

  //want to prevent default bc is just submitting right away
  login = event => {
    event.preventDefault();
    this.setState(state => ({ isLoading: "true" }));
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState(state => ({
            isLoggedIn: true,
            firstName: data.firstName,
            lastName: data.lastName,
            isLoading: false
          }));
          localStorage.setItem("mytoken", data.token);
        }
      });

    // const data = await Response.json();
    // console.log(data);
  };

  logOut = () => {
    localStorage.removeItem("mytoken");
    this.setState(() => ({
      isLoggedIn: false,
      secret: ""
    }));
  };

  showSecret = async () => {
    console.log("secret function is working");
    const token = localStorage.getItem("mytoken");
    this.setState(() => ({ isLoading: true }));
    const response = await fetch(
      `http://localhost:5000/private?token=${token}`
    );

    const data = await response.json();
    this.setState(() => ({
      secret: data.message,
      isLoading: false
    }));
  };

  //need to add try / catch / finally

  render() {
    return (
      <>
        <div className={css.loading}>
          {this.state.isLoading && "BE PATIENT! IT IS NOW FUCKING LOADING"}
        </div>

        <div className={css.form}>
          {this.state.isLoggedIn
            ? `You are now logged in ${this.state.firstName} ${
                this.state.lastName
              }`
            : "You are not logged in"}
        </div>

        <div className={css.emailandpw}>
          {!this.state.isLoggedIn ? (
            <>
              {/* {this.state.secret || <button onClick={this.secret}>Show Secret</button> */}
              <form onSubmit={this.login}>
                <TextField
                  onChange={this.onChange}
                  value={this.state.email}
                  name="email"
                  type="email"
                  placeholder="email"
                />

                <TextField
                  onChange={this.onChange}
                  value={this.state.password}
                  name="password"
                  type="password"
                  placeholder="password"
                />

                <Button
                  className={css.button}
                  size="small"
                  variant="contained"
                  type="submit"
                >
                  Log In
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button onClick={this.showSecret}>Show Secret</Button>
              <div className="secret"> {this.state.secret} </div>

              <Button onClick={this.logOut}>Log Out</Button>
            </>
          )}
        </div>
      </>
    );
  }
}

export default Authed;
