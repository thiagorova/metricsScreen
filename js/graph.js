;(function( window ) {

"use strict";

var LineGraph = function (key) {};

LineGraph.hidden = {};

LineGraph.hidden.setDateFormat = function(format) {
  if (format==="yearly") { return function (date) {
      return date.split(" ")[0].split("/")[2];
    };
  }
  if (format==="yearly_whole") { return function (date) {
      return date.split(" ")[0];
    };
  }
  if (format==="month-year") { return function (date) {
      var mainDate = date.split(" ")[0].split("/");
      return mainDate[1] + "/" + mainDate[2];
    };
  }
  if (format==="daily") { return function (date) {
      return date.split(" ")[0].split("/")[0];
    };
  }
  if (format==="day-month") { return function (date) {
      var mainDate = date.split(" ")[0].split("/");
      return mainDate[0] + "/" + mainDate[1];
    };
  }
  if (format==="hour-day") { return function (date) {
      var mainDate = date.split(" ")[0]
      return mainDate[0].split("/")[0] + " " + mainDate[1].split(":")[0];
    };
  }
  if (format==="minute-hour") { return function (date) {
      return mainDate = date.split(" ")[1]
    };
  }
  if (format==="day_whole") { return function (date) {
      var mainDate = date.split(" ")
      var time = mainDate[1].split(":")
      return mainDate[0].split("/")[0] + " " + time[0] + ":" + time[1] + ":" + time[2];
    };
  }
};

LineGraph.prototype.clear = function() {

};

LineGraph.prototype.build = function(width, height) {


};

LineGraph.prototype.dateFormat;

LineGraph.prototype.setDateFormat = function(format) {

};

LineGraph.prototype.setData = function(data) {
};

LineGraph.prototype.buildAxis = function() {
};

LineGraph.prototype.buildHLines = function(data) {};

window.LineGraph = LineGraph;


})( window );
