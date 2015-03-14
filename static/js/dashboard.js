var SearchForm = React.createClass({displayName: "SearchForm",
  getInitialState: function() {
    return { queryValue: null };
  },
  componentDidUpdate: function(){
    $('#tags').tagsInput();
  },
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
  handleChange: function(e){
    var selectedOption = e.target.value;
    this.setState({queryValue:selectedOption});
    this.props.onIndustryClick(selectedOption);
  },
  render: function() {
    var industry_options = ['Industry','Finance', 'Management Consulting'];
    var location_options = ['Location','Washington D.C.', 'Lisbon', 'San Francisco']
    var queryValue = this.state.queryValue;
    var selectIndustryValue = 'Industry';
    var selectLocationValue = 'Location';
    var iOptions = industry_options.map(function(item, index){
      return React.createElement("option", {key: index, value:item }, item)
    });
    var lOptions = location_options.map(function(item, index){
      return React.createElement("option", {key: index, value:item }, item)
    });
    return (
      React.createElement("div", {className: "search-form"}, 
        React.createElement("form", {className: "form-inline", onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: "form-group"},
            React.createElement("i", {className: "fa fa-search"}) 
          ),
          React.createElement("div", {className: "form-group", id: "query"},
            queryValue ? React.createElement("input", {className: "form-control", id:"tags", type: "text", ref: "query", 
              placeholder:"Enter an industry, company, or position", name:"industry", autocomplete:"off",
              spellcheck:"off", autocorrect:"off", value: queryValue}): React.createElement("input", {className: "form-control", id:"tags", type: "text", ref: "query", 
              placeholder:"Enter an industry, company, or position", name:"industry", autocomplete:"off",
              spellcheck:"off", autocorrect:"off"})
            ),
          React.createElement("button", {className: "ph-button ph-btn-gray", type: "submit"}, "Submit"),
          React.createElement("div", {className: "form-group", id: "query"},
            React.createElement("select", {className: "styled-select", onChange:this.handleChange, value:selectIndustryValue }, iOptions
              ),
            React.createElement("select", {className: "styled-select", onChange:this.handleChange, value:selectLocationValue }, lOptions
              )
            )
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
                    React.createElement("img", {className: "img-responsive", src: mentor.picture_url}, null)
                  ),
                  React.createElement("div", {className: "details col-md-6"}, 
                    React.createElement("p", {id: "name"}, mentor.first_name+" "+mentor.last_name),
                    React.createElement("p", {id: "headline"}, mentor.headline),
                    React.createElement("p", {id: "location"}, mentor.location)
                  ),
                  React.createElement("div", {className: "col-md-4", id: "message"}, 
                    React.createElement("a", {href: "/mentor_profile/"+mentor.linkedin_id+"/"},
                      React.createElement("button", {className: "ph-button ph-btn-white"}, " View Profile")
                    ),
                    React.createElement("a", {href: "/message/?mi="+mentor.linkedin_id, target: "_blank"},
                      React.createElement("button", {className: "ph-button ph-btn-blue"}, "Message")
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
    var client = new AlgoliaSearch('J5OKZCKMBB', 'b3342978705ee0d7158eedb3acec199d'); // public credentials
    var index = client.initIndex('MENTORS');
    function searchCallback(success, content) {
        if (success) {
          this.setState({mentors: content['hits']});
        }
      }
      index.search(query, searchCallback.bind(this));
  },
  handleIndustryClick: function(value) {
    // this.queryDB(value);
    // this.setState({search: true});
  },
  handleSearchSubmit: function(query) {
    this.queryDB(query);
    this.setState({search: true});
    this.setState({formExists: false})
  },
  render: function() {
    var search = this.state.search;
    var formExists = this.state.formExists;
    var mentors = this.state.mentors;
    var queryValue = this.state.queryValue;
    return (
      React.createElement("div", {className: "searchBox"}, 
        React.createElement(SearchForm, {onSearchSubmit: this.handleSearchSubmit, onIndustryClick: this.handleIndustryClick}),
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