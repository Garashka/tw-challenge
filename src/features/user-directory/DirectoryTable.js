import { Paper } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { setUsers } from './directorySlice';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { compose } from '@reduxjs/toolkit';

const styles = theme => ({
  root: {
    width: '100%',
  },
});

class DirectoryTable extends React.Component {
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
        // Store the requested data in Redux
        setUsers(data);
      })
  }

  render() {
    const { classes, tableData } = this.props;

    return (
      <Paper className={classes.root}>
        <TableContainer className={classes.table}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Surname</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <Row row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    )
  }
}

// Render row as a function object, to make it simpler to hide/show avatars later
function Row(props) {
  const { row } = props;
  return (
    <React.Fragment>
      <TableRow key={row.id}>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.first_name}</TableCell>
        <TableCell>{row.last_name}</TableCell>
        <TableCell>{row.email}</TableCell>
      </TableRow>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    tableData: state.directory.users
  };
}

const mapDispatchToProps = {
  setUsers,
}

// Compose combines multiple higher order components
export default compose(
  connect(mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles),
)(DirectoryTable);