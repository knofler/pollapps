	// **************** ReactClass defined here for any Directive to access for view rendering ************
	  
    // ######## Example-1
    var MYAPP  = React.createClass({
     displayName : 'MYAPP',
     render      : function(){
       return React.DOM.div(null, "Rendering faster in AngularJs with ", this.props.framework);
     }
      });
    // ######## Example-2
    var MYLIST = React.createClass({
      displayName : 'MYLIST',
      render      : function() {
        var data = this.props.data;
        var rows = data.map(function(datum) {
          var clickHandler = function(ev){
            console.log("Still in reactJs");
            console.log(ev);
           }
          return (
              React.DOM.tr( {onClick:clickHandler},
              React.DOM.td(null, datum['0']),
              React.DOM.td(null, datum['1']),
              React.DOM.td(null, datum['2']),
              React.DOM.td(null, datum['3']),
              React.DOM.td(null, datum['4'])
             )
             );
           });
        return (
          React.DOM.table(null,
            rows
          )
        );
      }
     });

  // **************** ReactClass defined here for any Directive to access for view rendering ************
