import { Paper, TableSortLabel } from '@material-ui/core';
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
  paper: {
    overflow: "auto"
  },
  table: {
    maxHeight: 800,
  },
  hiddenSortIcon: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  }
});

const HeaderCells = [
  { id: 'id', numeric: true, label: 'ID' },
  { id: 'first_name', numeric: false, label: 'First Name' },
  { id: 'last_name', numeric: false, label: 'Surname' },
  { id: 'email', numeric: false, label: 'Email' },
];

class DirectoryTable extends React.Component {
  constructor(props) {
    super(props);
    // Local state storage for state specific to table
    this.state = {
      tableData: [],
      rowsPerPage: 5,
      page: 0,
      order: 'asc',
      orderBy: 'id',
      api: ""
    };
  }

  componentDidMount() {
    const { setUsers } = this.props;
    const { api } = this.props;

    // In production, a more robust aynsc method should probably used. This will do for now.
    // API address is stored in redux. In production we would have some central store of API addresses rather than in the individual components.
    fetch(api)
      .then(response => response.json())
      .then(data => {
        // Store the requested data in Redux
        setUsers(data);
      })
  }

  // Sorting functionality, largely taken from Material-UI example
  descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => this.descendingComparator(a, b, orderBy)
      : (a, b) => -this.descendingComparator(a, b, orderBy);
  }
  stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  render() {
    const { classes, tableData } = this.props;
    const { page, rowsPerPage, order, orderBy } = this.state;

    // Pagination functions
    const handleChangePage = (event, newPage) => {
      this.setState({ page: newPage });
    }
    const handleChangeRowsPerPage = (event) => {
      this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
      this.setState({ page: 0 });
    }

    // Sort functions
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      this.setState({ order: isAsc ? 'desc' : 'asc' });
      this.setState({ orderBy: property })
    };

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer className={classes.table}>
            <Table stickyHeader>
              <this.TableHeaders
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {
                  this.stableSort(tableData, this.getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <this.Row key={row.id} row={row} />
                    ))
                }
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
        <this.DownloadButton
          tableData={tableData}
          csvLink={this.csvLink}
        />
      </div>
    )
  }

  // Return table header row with sort features added
  TableHeaders(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    }

    return (
      <TableHead>
        <TableRow>
          {/* Empty column for expanadable avatar buttons */}
          <TableCell></TableCell>
          {HeaderCells.map((header) => (
            <TableCell
              key={header.id}
              sortDirection={orderBy === header.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === header.id}
                direction={orderBy === header.id ? order : 'asc'}
                onClick={createSortHandler(header.id)}
              >
                {header.label}
                {/* If we are currently sorting by this column, display the sort order icon (ascend or descent as appropriate) */}
                {orderBy === header.id ? (
                  <span className={classes.hiddenSortIcon}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  // Return row for rendering as a function object, to separate out state for show/hide avatars
  Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    return (
      <React.Fragment>
        <TableRow key={row.id}>
          {/* Extra cell for avatar visibility toggle */}
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
  DownloadButton(props) {
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
}


// Redux bindings
const mapStateToProps = state => {
  return {
    tableData: state.directory.users,
    api: state.directory.api
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