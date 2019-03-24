const d3 = require('d3');
const data = require('./cyclist-data.json');

const width = 1000;
const height = 700;
const padLeft = 55;
const padBot = 25;

function timeToSeconds(time) {
  const aux = time.split(':');
  return (aux[0] * 60 + aux[1]) | 0;
}

/* Scales */
const xScale = d3
  .scaleLinear()
  .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
  .range([padLeft, width - 10]);

const yScale = d3
  .scaleLinear()
  .domain([
    d3.min(data, d => timeToSeconds(d.Time)),
    d3.max(data, d => timeToSeconds(d.Time)),
  ])
  .range([10, height - padBot]);

const chart = d3
  .select('#chart')
  .attr('width', width)
  .attr('height', height);

const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden');

/* Circles */
chart
  .selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'circle')
  .attr('r', 5)
  .attr('cx', (d, i) => {
    console.log(`${d.Name} - ${d.Year} - ${timeToSeconds(d.Time)}`);
    return xScale(d.Year);
  })
  .attr('cy', (d, i) => yScale(timeToSeconds(d.Time)) - padBot);

chart
  .selectAll('circle')
  .on('mouseover', d => {
    return tooltip
      .style('visibility', 'visible')
      .html(
        `${d.Name}:${d.Nationality}<br/> ${timeToSeconds(d.Time)}: ${d.Year}`
      );
  })
  .on('mousemove', () => {
    return tooltip
      .style('top', event.pageY - 10 + 'px')
      .style('left', event.pageX + 10 + 'px');
  })
  .on('mouseout', () => {
    return tooltip.style('visibility', 'hidden');
  });

/* Bottom Label */
const botLabel = d3.axisBottom(xScale);
chart
  .append('g')
  .attr('transform', `translate(0, ${height - padBot})`)
  .call(botLabel);

/* Left Label */
const leftLabel = d3.axisLeft(yScale);
chart
  .append('g')
  .attr('transform', `translate(${padLeft}, 0)`)
  .call(leftLabel);
