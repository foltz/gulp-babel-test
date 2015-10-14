
import React, { PropTypes, Component } from 'react';

class Users extends Component {

    //static propTypes = {
    //    children: PropTypes.element, //.isRequired,
    //    error: PropTypes.object,
    //}

    render() {
        return (
            <div>
                <h1>Users</h1>
                <div className="master">
                    list users here...
                </div>
                <div className="detail">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Users;
