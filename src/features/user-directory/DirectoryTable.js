import { Paper } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { setUsers } from './directorySlice';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import { compose } from '@reduxjs/toolkit';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const styles = theme => ({
  root: {
    width: '100%',
  },
});

class DirectoryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      rowsPerPage: 5,
      page: 0,
    };
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
    const { page, rowsPerPage } = this.state;

    const handleChangePage = (event, newPage) => {
      this.setState({ page: newPage });
    }

    const handleChangeRowsPerPage = (event) => {
      this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
      this.setState({ page: 0 });
    }

    return (
      <Paper className={classes.root} >
        <TableContainer className={classes.table}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Surname</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(this.state.rowsPerPage > 0
                ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : tableData
              ).map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  colSpan={3}
                  count={tableData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper >
    )
  }
}

// Render row as a function object, to make it simpler to hide/show avatars later
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow key={row.id}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.first_name}</TableCell>
        <TableCell>{row.last_name}</TableCell>
        <TableCell>{row.email}</TableCell>
      </TableRow>
      {/* Collapsible user avatar */}
      <TableRow>
        {/* TODO: Display loading symbol */}
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto">
            <Box margin={1}>
              <img src={row.avatar} alt="User Avatar" />
            </Box>
          </Collapse>
        </TableCell>
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