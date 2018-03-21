import React, { Component } from "react";
import Carousel from "./Carousel";
import Input from "./Global/Input";
import Form from "./Global/Forms/Form";
import AlertModal from "../modals/AlertModal";

export default class BandMemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: {}
    };

    this.renderMemberCard = this.renderMemberCard.bind(this);
    this.renderMembers = this.renderMembers.bind(this);
    this.onUpdateMemberEdit = this.onUpdateMemberEdit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateMember = this.updateMember.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onCancelAlert = this.onCancelAlert.bind(this);
    this.onRemoveMember = this.onRemoveMember.bind(this);
  }

  componentWillMount() {
    if (this.props.memberEdit) this.props.updateMemberEdit();
    Object.keys(this.props.band.members).map(key =>
      this.setState({ [key]: this.props.band.members[key].instruments })
    );
  }

  componentWillUnmount() {
    if (this.props.memberEdit) this.props.updateMemberEdit();
  }

  handleInputChange(event) {
    console.log(event.target.name);
    console.log(this.state);
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    console.log(event.target.id);
    if (this.refs[event.target.id].validate()) {
      this.handleAsyncUpdateButtonClick(event.target.id);
    }
  }

  onCancel() {
    this.props.updateBandEdit();
  }

  onSuccess() {
    // this.props.updateMemberEdit();
    // this.props.onGetBand(this.props.band.id);
  }

  onError(err) {
    console.log("An error occurred: " + err);
  }

  handleAsyncUpdateButtonClick(id) {
    Promise.resolve()
      .then(this.updateMember(id))
      .then(() => this.onSuccess())
      .catch(err => this.onError(err));
  }

  updateMember(id) {
    const { band, user, onUpdateMember } = this.props;
    const member = band.members[id];
    member.instruments = this.state[id];
    onUpdateMember(member, band.id, user);
  }

  onUpdateMemberEdit() {
    this.props.updateMemberEdit();
  }

  onCancelAlert() {
    this.setState({
      showRemoveMemberAlert: false
    });
  }

  onRemoveMember() {
    console.log(this.state.selectedUser);
    Promise.resolve()
      .then(() =>
        this.props.removeMember(this.props.band, this.state.selectedUser)
      )
      .then(() => this.setState({ showRemoveMemberAlert: false }))
      .catch(err => console.log(err));
  }

  renderMemberCard(doc, index) {
    let card = (
      // <a href={`/${doc.id}/profile`} className="card__link" key={doc.id}>
      <div className="card__link" key={doc.id}>
        {this.props.memberEdit ? (
          <button
            className="card__delete"
            onClick={event => {
              event.preventDefault();
              console.log(
                `are you sure you want to remove ${doc.displayName ||
                  doc.email} from the band?`
              );
              Promise.resolve()
                .then(() => {
                  this.setState({
                    showRemoveMemberAlert: true,
                    selectedUser: doc
                  });
                })
                .catch(err => console.log(err));
            }}
          >
            <i className="material-icons">close</i>
          </button>
        ) : null}
        <div className="card">
          <div className="card__user">
            {!this.props.memberEdit ? (
              <img
                src={
                  doc.imageUrl ||
                  "https://www.timeshighereducation.com/sites/default/files/byline_photos/anonymous-user-gravatar_0.png"
                }
                alt="profile pic"
              />
            ) : null}
            {doc.displayName && (
              <a href={`/${doc.id}/profile`}>
                <h3 style={{ margin: 0 }}>{doc.displayName}</h3>
              </a>
            )}
            <p>{doc.email}</p>
            {this.props.memberEdit ? (
              <Form
                className="band__member__form"
                id={doc.id}
                onSubmit={this.onSubmit}
                onCancel={this.props.updateMemberEdit}
                disabled={!this.props.memberEdit}
                ref={doc.id}
              >
                <Input
                  type="text"
                  name={doc.id}
                  placeholder="Instruments"
                  // label="Intruments"
                  disabled={!this.props.memberEdit}
                  value={
                    this.props.memberEdit
                      ? this.state[doc.id] || ""
                      : doc.instruments || ""
                  }
                  onChange={this.handleInputChange}
                  validation={{
                    isLength: { min: 2, max: 80 },
                    isAlphanumeric: { blacklist: [" "] }
                  }}
                />
                <Input
                  type="button-thin-submit"
                  value="Save"
                  style={{ width: "100%" }}
                />
              </Form>
            ) : (
              <p>{doc.instruments || null}</p>
            )}
          </div>
        </div>
      </div>
    );
    return card;
  }

  renderMembers() {
    const { members } = this.props.band;
    if (
      members &&
      Object.keys(members).length > 0 &&
      members.constructor === Object
    ) {
      let rows = Object.keys(members).map(key => {
        if (members[key]) {
          let index = members[key].date || key;
          return this.renderMemberCard(members[key], index);
        }
      });
      return (
        // <Carousel slidesToShow={Object.keys(members).length + 1}>
        rows.sort()
        // </Carousel>
      );
    }
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h3>Members</h3>
          {this.props.editable && (
            <Input
              type="button-link"
              value={this.props.memberEdit ? "Done" : "Edit"}
              onClick={this.onUpdateMemberEdit}
            />
          )}
        </div>
        <div className="band__member__list">{this.renderMembers()}</div>
        <AlertModal
          show={this.state.showRemoveMemberAlert}
          title={`Are you sure you want to remove ${this.state.selectedUser
            .displayName ||
            this.state.selectedUser.email ||
            ""} from the band?`}
          actionType="Remove"
          action={this.onRemoveMember}
          onCancel={this.onCancelAlert}
          // isLoading={this.props.uploading}
        >
          <p>This action can not be undone</p>
        </AlertModal>
      </div>
    );
  }
}
