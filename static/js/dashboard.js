var SearchForm = React.createClass({displayName: "SearchForm",
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
    return (
      React.createElement("div", {className: "search-form"}, 
        React.createElement("form", {className: "form-inline", onSubmit: this.handleSubmit}, 
          React.createElement("i", {className: "fa fa-search"}), 
          React.createElement("input", {className: "form-control", id:"query", type: "text", ref: "query", 
            placeholder:"Enter an industry, company, or position", name:"industry"}),
          React.createElement("button", {className: "btn btn-success", type: "submit", id:"query"}, "Submit")
        ) 
      )
    );
  }
});
var MentorList = React.createClass({displayName: "MentorList",
  render: function() {
      var mentors = this.props.mentors;
      return (
          React.createElement("table", {className: "table table-striped table-bordered"}, 
            React.createElement("tr", null, 
              React.createElement("th", null, "Name"), 
              React.createElement("th", null, "Email"), 
              React.createElement("th", null, "Industry"), 
              React.createElement("th", null, "Position"), 
              React.createElement("th", null, "Location")
            ), 
            React.createElement("tr", null, 
            mentors.map(function(mentor) {
              return [
              React.createElement("td", null, mentor.first_name, " ", mentor.last_name),
              React.createElement("td", null, mentor.email),
              React.createElement("td", null, mentor.industry),
              React.createElement("td", null, mentor.headline),
              React.createElement("td", null, mentor.location),
              ];
            }), ";"
            )
          )
        );
    }
});

var SearchBox = React.createClass({displayName: "SearchBox",
  getInitialState: function() {
    return { search: null, mentors: [], formExists: true };
  },
  queryDB: function(query) {
    $.ajax({
      url: "http://localhost:5000/searchdb/c6846271b6174a0b9831ea1d34e4665c/",
      dataType: 'json',
      data: {industry:query},
      success: function(mentors) {
        this.setState({mentors: mentors});
      }.bind(this),
    });
  },
  handleSearchSubmit: function(query) {
    this.queryDB(query);
    this.setState({search: true});
    this.setState({formExists: false})
  },
  render: function() {
    var search = this.state.search;
    var formExists = this.state.formExists;
    var mentors = $.parseJSON(this.state.mentors)
    console.log(mentors)
    return (
      React.createElement("div", {className: "searchBox"}, 
        React.createElement("h3", null, "Mentor Search"), 
        React.createElement(SearchForm, {onSearchSubmit: this.handleSearchSubmit}),
         search ? React.createElement(MentorList, {mentors: mentors}) : null
      )
    );
  }
});
React.render(
  React.createElement(SearchBox, null),
  document.getElementById('content')
);