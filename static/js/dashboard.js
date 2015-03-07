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
          React.createElement("div", {className: "form-group"},
            React.createElement("i", {className: "fa fa-search"}) 
          ),
          React.createElement("div", {className: "form-group", id: "query"},
            React.createElement("input", {className: "form-control", id:"query", type: "text", ref: "query", 
              placeholder:"Enter an industry, company, or position", name:"industry"})
            ),
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
          React.createElement("br"), 
          React.createElement("div", {className: "results"}, 
            mentors.map(function(mentor) {
              return [
              React.createElement("div", {className: "person"}, 
                React.createElement("div", {className: "row"}, 
                  React.createElement("div", {className: "col-md-2 img"}, 
                    React.createElement("img", {className: "img", src: mentor.picture_url}, null)
                  ),
                  React.createElement("div", {className: "details col-md-6"}, 
                    React.createElement("p", {id: "name"}, mentor.first_name+" "+mentor.last_name),
                    React.createElement("p", {id: "headline"}, mentor.headline),
                    React.createElement("p", {id: "location"}, mentor.location)
                  ),
                  React.createElement("div", {className: "col-md-4", id: "message"}, 
                    React.createElement("a", {href: "/mentor_profile/"+mentor.linkedin_id+"/"},
                      React.createElement("button", {className: "btn btn-default"}, " View Profile")
                    ),
                    React.createElement("a", {href: "/message/?mi="+mentor.linkedin_id, target: "_blank"},
                      React.createElement("button", {className: "btn btn-primary"}, "Message")
                    )

                  )
                )
              )
              ];

            })
            )
  
        );
    }
});

var SearchBox = React.createClass({displayName: "SearchBox",
  getInitialState: function() {
    return { search: null, mentors: null, formExists: true };
  },
  queryDB: function(query) {
    $.ajax({
      url: "/searchdb/",
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
    var mentors = $.parseJSON(this.state.mentors);
    return (
      React.createElement("div", {className: "searchBox"}, 
        React.createElement(SearchForm, {onSearchSubmit: this.handleSearchSubmit}),
        React.createElement("br"), 
         search ? React.createElement(MentorList, {mentors: mentors}) : null
      )
    );
  }
});
React.render(
  React.createElement(SearchBox, null),
  document.getElementById('content')
);