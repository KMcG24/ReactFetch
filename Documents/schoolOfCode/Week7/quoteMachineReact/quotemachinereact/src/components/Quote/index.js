import React from "react";
import css from "./quote.css";

class Quote extends React.Component {
  constructor() {
    super();
    this.state = {
      quotes: []
    };
  }

  componentDidMount() {
    fetch("https://thesimpsonsquoteapi.glitch.me/quotes")
      .then(results => results.json())
      .then(json => this.setState({ quotes: json[0] }));
  }
  //     .then(data => {
  //       let quotes = data.results(quote => {
  //         return <div key={quote.results} />;
  // });
  //     }
  // ;
  //     });
  //   }

  render() {
    return (
      <div className="pic">
        <div className="quoteContainer">{this.state.quotes.quote}</div>
      </div>
    );
  }
}

export default Quote;
