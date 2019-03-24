const d3 = require('d3');
const $ = require('jquery');

const dataSet = require('./GDP-data.json').data;
const years = dataSet
  .filter(d => {
    const year = d[0].split('-');
    return year[1] === '01';
  })
  .map(d => {
    return Number(d[0].split('-')[0]);
  });

const width = 1000;
const height = 500;
const paddingLeft = 44;
const paddingBottom = 20;

const chart = d3
  .select('#chart')
  .attr('width', width)
  .attr('height', height);

console.log(years);

const xScale = d3
  .scaleLinear()
  .domain([0, (d3.max(years) - d3.min(years)) * 4])
  .range([paddingLeft, width]);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataSet, d => d[1])])
  .range([0, height]);

const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden');

/* Bars */
chart
  .selectAll('rect')
  .data(dataSet)
  .enter()
  .append('rect')
  .attr('x', (d, i) => xScale(i))
  .attr('y', d => height - yScale(d[1]) - paddingBottom)
  .attr('width', 3)
  .attr('height', d => yScale(d[1]))
  .attr('class', 'bar');

chart
  .selectAll('rect')
  .on('mouseover', function(d) {
    return tooltip
      .style('visibility', 'visible')
      .text(`Year: ${d[0]} - GDP: ${d[1]}`);
  })
  .on('mousemove', function() {
    return tooltip
      .style('top', event.pageY - 10 + 'px')
      .style('left', event.pageX + 10 + 'px');
  })
  .on('mouseout', function() {
    return tooltip.style('visibility', 'hidden');
  });

/* Left Label */
const yScaleLabel = d3
  .scaleLinear()
  .domain([0, d3.max(dataSet, d => d[1])])
  .range([height - paddingBottom, 0]);
const leftAxis = d3.axisLeft(yScaleLabel);
chart
  .append('g')
  .attr('transform', `translate(${paddingLeft}, 0)`)
  .call(leftAxis);

/* Bottom Label */
const xScaleLabel = d3
  .scaleLinear()
  .domain([d3.min(years), d3.max(years)])
  .range([paddingLeft, width]);
const botAxis = d3.axisBottom(xScaleLabel);
chart
  .append('g')
  .attr('transform', `translate(0, ${height - paddingBottom})`)
  .call(botAxis);
