import React, { Component } from 'react';
import Table from '../components/Global/Table';
import TableRow from '../components/Global/TableRow';
import TableRowMenu from '../components/Global/TableRowMenu';
import TableRowMenuItem from '../components/Global/TableRowMenuItem';

let docs = [{doc:{venue: "Viper Room", address: "123 Main St", type:"gig", date: "1/11/18", status: "upcoming"}},{doc:{venue: "Pianos", address: "123 Main St", type:"gig", date: "12/12/17", status: "upcoming"}},{doc:{venue: "Bordner's", address: "123 Main St", type:"gig", date: "11/11/17", status: "past"}}];

export const initialState = {
  showCreateProjectModal: false,
  showShareModal: false,
  selected: '',
};
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    // this.toggleCreateProjectModal = this.toggleCreateProjectModal.bind(this);
    // this.toggleShareModal = this.toggleShareModal.bind(this);
    // this.asyncFindProjects = this.asyncFindProjects.bind(this);
    // this.asyncToggleProjectStatus = this.asyncToggleProjectStatus.bind(this);
    // this.onCreateProjectSubmit = this.onCreateProjectSubmit.bind(this);
    // this.onCreateProjectCancel = this.onCreateProjectCancel.bind(this);
    // this.onCreateProjectSuccess = this.onCreateProjectSuccess.bind(this);
    // this.onCreateProjectError = this.onCreateProjectError.bind(this);
    // this.onShareProjectSubmit = this.onShareProjectSubmit.bind(this);
    // this.onShareProjectCancel = this.onShareProjectCancel.bind(this);
    // this.onShareProjectSuccess = this.onShareProjectSuccess.bind(this);
    // this.onShareProjectError = this.onShareProjectError.bind(this);
  }

  handleRowClick(row) {
    // history.push(`/${this.props.match.params.userId}/projects/${row._id}/bids/`);
  }

  handleRowMenuItemClick(doc, action, event) {
    event.stopPropagation();
    // let apiUrl = config.get('api').url;
    // switch(action) {
    //   case MENU_DOWNLOAD_PDFS:
    //     this.props.dispatch(projectsDownloadsAsyncBidsArchive({ id: doc._id }));
    //     break;
    //   case MENU_DOWNLOAD_EXCEL:
    //     window.open(`${apiUrl}/project/excel/download/${doc._id}`);
    //     break;
    //   case MENU_SHARE:
    //     this.toggleShareModal(doc._id);
    //     break;
    //   case MENU_ARCHIVE:
    //     this.asyncToggleProjectStatus(doc);
    //     break;
    //   case MENU_EDIT_PROJECT_DETAILS:
    //     history.push(`/${this.props.match.params.userId}/projects/${doc._id}/edit`);
    //     break;
    // }
  }
  renderRow(doc, index) {
    // const {
    //   asyncLoginData,
    // } = this.props;

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
      { value: doc.venue },
      { value: doc.address },
      { value: `${doc.date}` },
      { value: doc.status.toUpperCase(), colorClass: statusColorClass },
    ];

    let menu = (
      doc.status === 'upcoming' ?
      <TableRowMenu>
        <TableRowMenuItem
          label="Edit Details"
          // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_EDIT_PROJECT_DETAILS) }
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
        // onClick={ this.handleRowMenuItemClick.bind(this, doc, MENU_EDIT_PROJECT_DETAILS) }
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
  //   let projects, bids;

  //   // Sort data
  //   projects = docs.filter((doc) => {
  //     return doc.key[1] === 0;
  //   });
  //   bids = docs.filter((doc) => {
  //     return doc.key[1] === 1;
  //   });

  //   // Calculate total cost
  //   projects = projects.map((doc) => {
  //     doc.doc.estimateCost = bids.reduce((a, b) => {
  //       return (b.key[0] == doc.doc._id) ? a + parseInt(b.doc.estimateCost) : a;
  //     }, 0);
  //     return doc;
  //   });

  //   return {
  //     projects: projects,
  //     bids: bids
  //   };
  // }

  renderTable() {
      docs = docs.filter((doc) => {
        if(doc.doc.type === "gig") {
          return doc.doc.type == 'gig';
        }
        else if(doc.doc.status === "past") {
          return true;
        }
      });
      if(docs.length) {
        // let results = this.sortData(docs);
        let rows = docs.map(this.renderRow.bind(this));
        return (
          <Table columnLabels={["Venue", "Address", "Date", "Time", ""]}>
            { rows }
          </Table>
        );
      }
      else {
        return (
          // <NoContent text="No Projects" />
          <div>No Gigs</div>
        );
      }
    // }
  }

  render() {

    return (
      <div className='page__content'>
        {/* <CreateGigModal
          show={ showCreateGigModal }
          onSubmit={ this.onCreateGigSubmit }
          onCancel={ this.onCreateGigCancel }
          onSuccess={ this.onCreateGigSuccess }
          onError={ this.onCreateGigError }
        /> */}
        { this.renderTable() }
      </div>
    );
  }
}

export default Dashboard;