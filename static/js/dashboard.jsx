var SearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var query = this.refs.query.getDOMNode().value.trim();
    if (!query) {
      return;
    }
    this.props.onSearchSubmit(query);
    this.refs.query.getDOMNode().value = '';
    return;
  },
  render: function() {
    debugger;
    return (
      <form className="searchForm" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label>What industry interests you?</label>
          <input className="form-control" type="text" ref="query" />
        </div>
        <input className="btn btn-success btn-lg" type="submit" value="Find Mentors" />
      </form>
    );
  }
});
var MentorList = React.createClass({
  render: function() {
      var mentors = this.props.mentors;
      return (
          <table className="table table-striped table-bordered">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>School</th>
              <th>Industry</th>
              <th>Position</th>
              <th>Location</th>
            </tr>
            <tr>
            {mentors.map(function(mentor) {
              return [
              <td>{mentor.first_name} {mentor.last_name}</td>,
              <td>{mentor.email}</td>,
              <td>{mentor.education[0]}</td>,
              <td>{mentor.industry}</td>,
              <td>{mentor.headline}</td>,
              <td>{mentor.location}</td>,
              ];
            })};
            </tr>
          </table>
        );
    }
});

var SearchBox = React.createClass({
  getInitialState: function() {
    return { search: null, mentors: [] };
  },
  queryDB: function(query) {
    $.ajax({
      url: "http://localhost:5000/mentors/c6846271b6174a0b9831ea1d34e4665c/",
      dataType: 'jsonp',
      data: {industry:query},
      success: function(mentors) {
        this.setState({mentors: mentors['mentors']});
      }.bind(this),
    });
  },
  handleSearchSubmit: function(query) {
    this.queryDB(query);
    this.setState({search: true});
  },
  render: function() {
    var search = this.state.search;
    var mentors = $.parseJSON(this.state.mentors)
    debugger;
    return (
      <div className="searchBox">
        <h1>Mentor Search</h1>
        { search ? <MentorList mentors={mentors} /> : <SearchForm onSearchSubmit={this.handleSearchSubmit} /> }
      </div>
    );
  }
});
React.render(
  <SearchBox />,
  document.getElementById('content')
);