
import React, { PropTypes, Component } from 'react';

class NoMatch extends Component {

  static propTypes = {
    children: PropTypes.element, //.isRequired,
    error: PropTypes.object,
  }

  render() {
    return !this.props.error ? (
      <div>
          NO MATCH!!!!
      </div>
    ) : this.props.children;
  }
}

export default NoMatch;
