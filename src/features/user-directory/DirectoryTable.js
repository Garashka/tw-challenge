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
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { CSVLink } from 'react-csv';

const styles = theme => ({
  root: {
    width: '100%',
    '& > *': {
      margin: theme.spacing(2),
    },
  },
  table: {
    maxHeight: 800,
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

    // Pagination functions
    const handleChangePage = (event, newPage) => {
      this.setState({ page: newPage });
    }
    const handleChangeRowsPerPage = (event) => {
      this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
      this.setState({ page: 0 });
    }

    return (
      <div className={classes.root}>
        <Paper>
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
        <DownloadButton
          tableData={tableData}
          csvLink={this.csvLink}
        />
      </div>
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
        {/* Generate an extra cell for a toggle button for the collapsible avatar menu */}
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
      {/* Extra row for collapsible user avatar */}
      <TableRow>
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

// Returns a download button that exports csv
function DownloadButton(props) {
  const { tableData } = props;

  // Ref used to link material-UI button to CSV-Link library button
  const csvLink = React.createRef();

  return ([
    <Button
      variant="contained"
      onClick={() => csvLink.current.link.click()}
      key="0"
    >
      Export to CSV
    </Button >,
    <CSVLink
      data={tableData}
      filename={'directory.csv'}
      className="hidden"
      ref={csvLink}
      key="1"
    />
  ])
}


// Redux bindings
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