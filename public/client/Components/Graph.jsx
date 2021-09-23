import React from 'react';
import * as d3 from 'd3';
const Graph = (props) => {
  React.useEffect(() => {
    d3.select('#graph')
      .append('text')
      .text('Click on a Country to Display Data')
      .attr('class', 'graphPlaceholder')
      .attr('x', '200')
      .attr('y', '150')
      .attr('text-anchor', 'middle');
  }, []);
  return (
    <div id='graphHolder'>
      <svg id='graph'></svg>
    </div>
  );
};

export default Graph;
