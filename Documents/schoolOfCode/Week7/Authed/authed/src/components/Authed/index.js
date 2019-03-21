import React from "react";

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
    fetch("http://localhost:5000/login", {
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

  render() {
    return (
      <>
        <div>
          {this.state.isLoading && "BE PATIENT! IT IS NOW FUCKING LOADING"}{" "}
        </div>

        <div>
          {this.state.isLoggedIn
            ? `You are now logged in ${this.state.firstName} ${
                this.state.lastName
              }`
            : "You are not logged in"}

          {!this.state.isLoggedIn ? (
            <>
              {/* {this.state.secret || <button onClick={this.secret}>Show Secret</button> */}

              <form onSubmit={this.login}>
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  name="email"
                  type="email"
                  placeholder="email"
                />
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  name="password"
                  type="password"
                  placeholder="password"
                />
                <button type="submit">Log In</button>
              </form>
            </>
          ) : (
            <>
              <button onClick={this.showSecret}>Show Secret</button>
              <div> {this.state.secret} </div>

              <button onClick={this.logOut}>Log Out</button>
            </>
          )}
        </div>
      </>
    );
  }
}

export default Authed;
