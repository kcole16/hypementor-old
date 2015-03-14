var SearchForm = React.createClass({displayName: "SearchForm",
  getInitialState: function() {
    return { currentSearch: "" };
  },
  autoComplete: function() {
    var algolia = new AlgoliaSearch('J5OKZCKMBB', 'b3342978705ee0d7158eedb3acec199d');
    // replace YourlocationsIndexName & YourindustrysIndexName by the name of the indexes you want to query.
    var locations = algolia.initIndex('LOCATIONS');
    var industries = algolia.initIndex('INDUSTRIES');
    var companies = algolia.initIndex('COMPANIES');

    // Mustache templating by Hogan.js (http://mustache.github.io/)
    var templateIndustry = Hogan.compile('<div class="industry">' +
      '<div class="industry">{{{ _highlightResult.name.value }}}</div>' +
    '</div>');
    var templateCompany = Hogan.compile('<div class="company">' +
      '<div class="company">{{{ _highlightResult.name.value }}}</div>' +
    '</div>');
    var templateLocation = Hogan.compile('<div class="location">' +
      '<div class="city">{{{ _highlightResult.city.value }}}</div>' +
      '<div class="state">{{{ _highlightResult.state.value }}}</div>' +
    '</div>');

    // typeahead.js initialization
    $('#mentors').typeahead({ hint: false }, [
      {
        source: industries.ttAdapter({ hitsPerPage: 3 }),
        displayKey: 'name',
        templates: {
          header: '<div class="category">Industries</div>',
          suggestion: function(hit) { return templateIndustry.render(hit); }
        }
      },
      {
        source: locations.ttAdapter({ hitsPerPage: 3 }),
        displayKey: 'city',
        templates: {
          header: '<div class="category">Locations</div>',
          suggestion: function(hit) { return templateLocation.render(hit); }
        }
      },
      {
        source: companies.ttAdapter({ hitsPerPage: 3 }),
        displayKey: 'name',
        templates: {
          header: '<div class="category">Company</div>',
          suggestion: function(hit) { return templateCompany.render(hit); }
        }
      }
    ]);
  },
  componentDidMount: function(){
    $('#tags').tagsInput();
    this.autoComplete();
  },
  clearAndFocusInput: function() {
      // Clear the input
    this.refs.query.getDOMNode().value = '';
    React.findDOMNode(this.refs.query).focus();   // Boom! Focused!
  },
  componentDidUpdate: function(){
    this.clearAndFocusInput();
    this.autoComplete();
  },
  handleSubmit: function(e) {
    $('div.form-group.search-icon').css("height", "10px");
    $('div.form-group#submit').css("height", "20px");
    $('.search-form').css("min-height", "100px");
    $('div.form-group#query').css("height", "60px");
    $('input#mentors').css("height", "60px");
    e.preventDefault();
    var query = this.refs.query.getDOMNode().value.trim();
    if (!query) {
      return;
    }
    $('#tags').addTag(query);
    if (this.state.currentSearch !== null){
      newInput = this.state.currentSearch+" "+query;
    } else {
      newInput = query;
    }
    this.refs.query.getDOMNode().value = '';
    this.props.handleQuery(newInput);
    this.setState({currentSearch: newInput});
    return;
  },
  render: function() {
    return (
      React.createElement("div", {className: "search-form"}, 
        React.createElement("form", {className: "form-inline", onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: "form-group search-icon"},
            React.createElement("i", {className: "fa fa-search"}) 
          ),
          React.createElement("div", {className: "form-group", id: "query", onClick: this.handleSubmit},
            React.createElement("input", {className: "form-control", id:"mentors", type: "text", ref:"query", 
              placeholder:"Search by location, industry, or company", name:"industry", autocomplete:"off",
              spellcheck:"off", autocorrect:"off"})
            ),
          React.createElement("div", {className: "form-group", id:"submit"},
            React.createElement("button", {className: "ph-button ph-btn-gray", type: "submit"}, "Submit")
          ),
          React.createElement("div", {className: "form-group", id:"tags"}
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
  handleQuery: function(value) {
    this.queryDB(value);
    this.setState({search: true});
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
        React.createElement(SearchForm, {handleQuery: this.handleQuery}),
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