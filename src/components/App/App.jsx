
import React, { PropTypes, Component } from 'react';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

class App extends Component {

  static propTypes = {
    children: PropTypes.element, //.isRequired,
    error: PropTypes.object,
  }

  render() {
    return !this.props.error ? (
        <html>
            <head>
	            <link rel="stylesheet" href="css/test.css" />
            </head>
        <body>
	        <div>
		        This is the react app!??
		        <Header />
		        {this.props.children}
		        <Footer />
	        </div>
        </body>

      </html>
    ) : this.props.children;
  }
}

export default App;
