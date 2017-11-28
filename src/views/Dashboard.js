import React, { Component } from 'react';
import Table from '../components/Global/Table';
import TableRow from '../components/Global/TableRow';
import TableRowMenu from '../components/Global/TableRowMenu';
import TableRowMenuItem from '../components/Global/TableRowMenuItem';
import Drawer from '../components/Global/Drawer';

let docs = [{doc:{venue: "Viper Room", address: "123 Main St", type:"gig", date: "1/11/18", loadIn: "7:00", showTime: "11:00", status: "upcoming"}}, {doc:{venue: "Pianos", address: "123 Main St", type:"gig", date: "12/12/17", loadIn: "7:00", showTime: "11:00", status: "upcoming"}}, {doc:{venue: "Bordner's", address: "123 Main St", type:"gig", date: "11/11/17", loadIn: "7:00", showTime: "11:00", status: "past"}}];

export const initialState = {
  showCreateProjectModal: false,
  showShareModal: false,
  selected: '',
};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleRowClick(row) {
  }

  handleRowMenuItemClick(doc, action, event) {
    event.stopPropagation();
  }
  renderRow(doc, index) {

    doc = doc.doc;

    let statusColorClass = '';
    switch(doc.status) {
      case 'upcoming':
        statusColorClass = 'clr-green';
        break;
      case 'past':
        statusColorClass = 'clr-red';
        break;
    }

    let columns = [
      { value: doc.date },
      { value: doc.venue },
      { value: doc.address },
      { value: doc.loadIn },
      { value: doc.showTime },
      { value: doc.status.toUpperCase(), colorClass: statusColorClass },
    ];

    let menu = (
      doc.status === 'upcoming' ?
      <TableRowMenu>
        <TableRowMenuItem
          label="Edit Details"
          // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_EDIT_SHOW_DETAILS) }
        />
        <TableRowMenuItem
          label="Share"
          // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_SHARE) }
        />
        <TableRowMenuItem
          label="Delete"
          // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_SHARE) }
        />
      </TableRowMenu>
      :
      <TableRowMenu>
      <TableRowMenuItem
        label="Edit Details"
        // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_EDIT_SHOW_DETAILS) }
      />
      <TableRowMenuItem
        label="Share"
        // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_SHARE) }
      />
      <TableRowMenuItem
        label="Delete"
        // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_SHARE) }
      />
      <TableRowMenuItem
        label="Archive"
        // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_ARCHIVE) }
      />
    </TableRowMenu>

    );

    return (
      <TableRow
        key={ index }
        columns={ columns }
        onClick={ this.handleRowClick.bind(this, doc) }
      >
      { menu }
      </TableRow>
    );
  }

  // sortData(docs) {
  //   let bands, bids;

  //   // Sort data
  //   bands = docs.filter((doc) => {
  //     return doc.key[1] === 0;
  //   });
  //   shows = docs.filter((doc) => {
  //     return doc.key[1] === 1;
  //   });

  //   // Calculate total cost
  //   bands = bands.map((doc) => {
  //     doc.doc.estimateCost = shows.reduce((a, b) => {
  //       return (b.key[0] == doc.doc._id) ? a + parseInt(b.doc.estimateCost) : a;
  //     }, 0);
  //     return doc;
  //   });

  //   return {
  //     bands: bands,
  //     shows: shows
  //   };
  // }

  renderTable() {
      docs = docs.filter((doc) => {
        if(doc.doc.type === "gig") {
          return doc.doc.type === 'gig';
        }
        else if(doc.doc.status === "past") {
          return true;
        }
      });
      if(docs.length) {
        // let results = this.sortData(docs);
        let rows = docs.map(this.renderRow.bind(this));
        return (
          <Table columnLabels={["Date", "Venue", "Address", "Load In", "Show Time", "Status", "+"]}>
            { rows }
          </Table>
        );
      }
      else {
        return (
          // <NoContent text="No Shows" />
          <div>No Shows</div>
        );
      }
    // }
  }

  render() {

    return (
      <div className='page__content'>
      <Drawer
          // userName={ userName }
          show={ true }
          className="drawer__sidebar"
          // toggle={ this.toggleDrawer }
        />
        {/* <CreateShowModal
          show={ showCreateShowModal }
          onSubmit={ this.onCreateShowSubmit }
          onCancel={ this.onCreateShowCancel }
          onSuccess={ this.onCreateShowSuccess }
          onError={ this.onCreateShowError }
        /> */}
        { this.renderTable() }
      </div>
    );
  }
}

export default Dashboard;