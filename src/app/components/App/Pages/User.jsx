
import React, { PropTypes, Component } from 'react';

class User extends Component {

    static propTypes = {
        children: PropTypes.element, //.isRequired,
        error: PropTypes.object,
    }

    render() {
        return !this.props.error ? (
            <div>
                USER ONE!
            </div>
        ) : this.props.children;
    }
}

export default User;
