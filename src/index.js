import { select, selectAll } from "d3-selection";
import { csv } from "d3-fetch";
import { histogram, extent } from "d3-array";
import { scaleBand, scaleLinear, max, axisBottom, axisLeft } from "d3";
import { line } from "d3-shape";

// selectAll(".icon-container").append("svg").attr("width", 50).attr("height", 60);
let width = 240;
let height = 230;

const highlightRatings = [
  { rating: "TV-Y", total: 0 },
  { rating: "TV-14", total: 0 },
  { rating: "TV-MA", total: 0 },
];

const allRatings = [
  { rating: "TV-Y", total: 0 },
  { rating: "NR", total: 0 },
  { rating: "PG", total: 0 },
  { rating: "PG-13", total: 0 },
  { rating: "R", total: 0 },
  { rating: "TV-14", total: 0 },
  { rating: "TV-G", total: 0 },
  { rating: "TV-MA", total: 0 },
];

const countriesHighlight = [
  { name: "United States", sigla: "USA", total: 0 },
  { name: "Italy", sigla: "ITA", total: 0 },
  { name: "Japan", sigla: "JPN", total: 0 },
  { name: "Australia", sigla: "AUS", total: 0 },
  { name: "Canada", sigla: "CAN", total: 0 },
  { name: "Brazil", sigla: "BRA", total: 0 },
];

const margin = { top: 30, left: 40, right: 30, bottom: 30 };

selectAll(".chart-block")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

csv(require("../data/netflix_titles.csv")).then((data) => {
  let block1 = select(".block1").select("svg");
  let block2 = select(".block2").select("svg");
  let block3 = select(".block3").select("svg");
  let ratings = mesuareRatings(highlightRatings, data);
  let countries = mesuareCountry(countriesHighlight, data);

  renderMesuare(ratings);
  ratings = mesuareRatings(allRatings, data);

  lineChart(block1, ratings);
  lineChart2(block3, countries);
  histoChart(block2, data);
});

function mesuareYearsRelease(incomingData) {
  let frequencyOfYearsRelease = incomingData.map((d) => {
    d.release_year = +d.release_year;
  });

  return frequencyOfYearsRelease;
}

function mesuareRatings(ratings, incomingData) {
  ratings.forEach((r) => {
    incomingData.forEach((d) => {
      if (r.rating === d.rating) {
        r.total++;
      }
    });
  });

  return ratings;
}

function mesuareCountry(countries, incomingData) {
  countries.forEach((c) => {
    incomingData.forEach((d) => {
      if (c.name == d.country) {
        c.total += 1;
      }
    });
  });

  return countries;
}

function renderMesuare(incomingData) {
  selectAll(".numbers")
    .select("span")
    .data(incomingData)
    .each(function (d) {
      select(this).html(d.rating);
    });

  selectAll(".numbers")
    .select("h2")
    .data(incomingData)
    .each(function (d) {
      select(this).html(d.total);
    });
}

function lineChart(svg, incomingData) {
  const innerWidth = width - margin.left - margin.right;
  const inneHeight = height - margin.top - margin.bottom;
  let names = incomingData.map((d) => d.rating);

  let xValue = (d) => xScale(d.rating);
  let yValue = (d) => yScale(d.total);

  let xScale = scaleBand().domain(names).range([0, innerWidth]).paddingInner(1);

  let yScale = scaleLinear()
    .domain([0, max(incomingData, (d) => d.total)])
    .range([inneHeight, 0]);

  let xAxis = axisBottom(xScale).tickSize(-inneHeight).tickPadding(9);
  let yAxis = axisLeft(yScale).tickSize(0).tickPadding(10);

  let lineGenarator = line().x(xValue).y(yValue);

  let gGroup = svg
    .append("g")
    .attr("class", "gGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let xAxisG = gGroup
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${inneHeight})`)
    .call(xAxis);

  let yAxisG = gGroup
    .append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${0}, 0)`)
    .call(yAxis);

  xAxisG
    .selectAll("text")
    .attr("transform", `rotate(45)`)
    .attr("text-anchor", "start")
    .style("font-size", "0.6rem");

  gGroup
    .selectAll("circle")
    .data(incomingData)
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("cx", xValue)
    .attr("cy", yValue);

  gGroup
    .append("path")
    .attr("class", "line-ratings")
    .attr("d", lineGenarator(incomingData));
}

function lineChart2(svg, incomingData) {
  const innerWidth = width - margin.left - margin.right;
  const inneHeight = height - margin.top - margin.bottom;
  let siglas = incomingData.map((d) => d.sigla);

  let xValue = (d) => xScale(d.sigla);
  let yValue = (d) => yScale(d.total);

  let xScale = scaleBand()
    .domain(siglas)
    .range([0, innerWidth])
    .paddingInner(1);

  let yScale = scaleLinear()
    .domain([0, max(incomingData, (d) => d.total + 1000)])
    .range([inneHeight, 0])
    .nice();

  let xAxis = axisBottom(xScale).tickSize(-inneHeight).tickPadding(9);
  let yAxis = axisLeft(yScale).tickSize(-innerWidth).ticks(6).tickPadding(10);

  let lineGenarator = line().x(xValue).y(yValue);

  let gGroup = svg
    .append("g")
    .attr("class", "gGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let xAxisG = gGroup
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${inneHeight})`)
    .call(xAxis);

  let yAxisG = gGroup
    .append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${0}, 0)`)
    .call(yAxis);

  gGroup
    .selectAll("circle")
    .data(incomingData)
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("cx", xValue)
    .attr("cy", yValue);

  gGroup
    .append("path")
    .attr("class", "line-ratings")
    .attr("d", lineGenarator(incomingData));
}

function histoChart(svg, incomingData) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  let xValue = (d) => xScale(d.release_year);
  let xPosition = (d) => xScale(d.x0);
  let yValue = (d) => yScale(d.length);

  let xScale = scaleLinear()
    .domain(extent(incomingData, (d) => d.release_year))
    .range([0, innerWidth]);

  let h = histogram().value((d) => {
    return d.release_year;
  });

  let bins = h(incomingData);
  let maxBin = max(bins, (d) => d.length);

  let yScale = scaleLinear()
    .domain([maxBin + 500, 2000, 500, 0])
    .range([0, 50, 100, innerHeight]);

  console.log(yScale.range());

  let xAxis = axisBottom(xScale).ticks(5).tickSize(-innerHeight).tickPadding(9);
  let yAxis = axisLeft(yScale).tickValues([maxBin, 2000, 1000, 300, 0]);

  let gGroup = svg
    .append("g")
    .attr("class", "gGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let xAxisG = gGroup
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${innerHeight})`)
    .call(xAxis);

  let yAxisG = gGroup
    .append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${0}, 0)`)
    .call(yAxis);

  gGroup
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar-graph")
    .attr("x", xPosition)
    .attr("y", yValue)
    .attr("width", 10)
    .attr("height", (d) => innerHeight - yScale(d.length));
  // .attr("height", (d) => innerHeight - yScale(d.length));
}
