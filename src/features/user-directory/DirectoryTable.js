import React from 'react';
import { connect } from 'react-redux';
import { setUsers } from './userSlice';

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tableData: [] };
  }

  componentDidMount() {
    const { setUsers } = this.props;

    // In production, a more robust aynsc method should probably used. This will do for now.
    fetch('https://reqres.in/api/users')
      .then(response => response.json())
      .then(data => {
        // Store the resquested data in Redux
        setUsers(data);
      })
  }
}