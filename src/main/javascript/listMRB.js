/** @jsx React.DOM */
var React = require('react');  // Browserify!


String.prototype.trunc =
function(n){
  return this.substr(0,n-1)+(this.length>n?'...':'');
};




// An item.  A MIDAS URL looks like this:
/*
http://slicer.kitware.com/midas3/download/bitstream/174312/126553_LungSegments_scene.mrb%20(1)?name=126553_LungSegments_scene.mrb%20(1)
*/
var MRMLItem = React.createClass({
  // Start with a blank URL
  getInitialState: function() {
    return ( { mrbURL: '' } );
  },
  componentDidMount: function() {
    // Ask jquery to go get it for us!
    // see http://facebook.github.io/react/tips/initial-ajax.html
    var itemURL = "http://slicer.kitware.com/midas3/rest/item/" + this.props.data.item_id;
    // console.log("Getting URL: ", itemURL, " for ", this );
    $.get ( itemURL, function(result) {
      if (this.isMounted() && result.data.bitstreams.length > 0) {
        // MIDAS download URL
        var midasURL = "http://slicer.kitware.com/midas3/rest/bitstream/download/" + result.data.bitstreams[0];
        var midasURL = "/midas3/rest/bitstream/download/" + result.data.bitstreams[0];
        // Need to tell the index page to open our MRB file
        var url = "index.html#mrb=" + encodeURIComponent(midasURL) + "&token=" + encodeURIComponent(this.props.token);
        this.setState({
          // hmm, bitstreams is an array?!?  take the first one, I suppose
          mrbURL: url
        });
      }
    }.bind(this));
  },
  render: function () {
    console.log ( "MRMLItem.render", this.props, this.state)

    return (
      <tr className="MRMLItem">
      <td>
        <a href={this.state.mrbURL}>
          <img src={"http://slicer.kitware.com/midas3/item/thumbnail?itemId=" + this.props.data.item_id + "&token=" + this.props.token} width="64" />
        </a>
      </td>
        <td>
      {this.props.data.name.trunc(40)}
        </td>
        <td>
      {this.props.data.description.trunc(40)}
        </td>
      </tr>
    );
  }
});

var MRMLList = React.createClass({
  getInitialState: function() {
    console.log("MRMLList.getInitialState")
    return ({ token: '' });
  },
  componentDidMount: function() {
    // Ask MIDAS for a token...
    var self = this;
    console.log("Asking for a token...")
    var loginURL = "http://slicer.kitware.com/midas3/rest/system/login";
    var parameters = {
      appname: "mrml-drop",
      email: "daniel.blezek@gmail.com",
      apikey: "uO0824aTAB7SUhnMQoQYzXxtx2lM1jXt5GwcX1lO"
    };
    $.get(loginURL, parameters)
    .done(function(response){
      if ( self.isMounted() ) {
        console.log("Got token: " + response.data.token);
        self.setState({
          token: response.data.token
        });
        self.render();
      }
    });
  },
  render: function () {
    console.log ( "MRMLList.render", this.props, this.state)
        // Construct the table rows
    var rows = [];
    var token = this.state.token;
    this.props.items.forEach(function(item) {
      rows.push(<MRMLItem key={item.item_id} data={item} token={token}/>);
    });

    return (
      <div className="MRMLList">
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
});

// Grab data from MIDAS
$.get('http://slicer.kitware.com/midas3/rest/folder/children/1555' )
.done(function(data){
  console.log("data:", data);
  // Got data from MIDAS, Render the React component
  var items = data.data.items;
  React.render(  // Render HelloMessage component at #name.
    <div>
    <MRMLList items={items} />
    </div>,
    document.getElementById('dataset-list')
  );
})
// jQuery.get ( 'http://slicer.kitware.com/midas3/rest/folder/children/298' )
  // .done(function(data){
  //   // Got data from MIDAS, Render the React component
  //   React.render(  // Render HelloMessage component at #name.
  //     <div>
  //     <MRMLList items={data.data.folders} />
  //     </div>,
  //     document.getElementById('dataset-list')
  //   );
  // })
  // .fail(function(){
  //   alert ( "Could not load data from MIDAS");
  //   React.render(
  //     <div>
  //       <h3>Could not load data from MIDAS</h3>
  //     </div>,
  //     document.getElementById('dataset-list')
  //   );
  // });
