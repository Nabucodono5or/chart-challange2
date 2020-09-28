import { select, selectAll } from "d3-selection";
import { csv } from "d3-fetch";
import { histoChart } from "./histogram";
import { lineChart } from "./lineChart";

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


csv(require("../data/netflix_titles.csv")).then((data) => {
  let block1 = select(".block1").select("svg");
  let block2 = select(".block2").select("svg");
  let block3 = select(".block3").select("svg");
  let ratings = mesuareRatings(highlightRatings, data);
  let countries = mesuareCountry(countriesHighlight, data);

  renderMesuare(ratings);
  ratings = mesuareRatings(allRatings, data);

  lineChart(block1, {
    width,
    height,
    margin,
    variable: "rating",
    incomingData: ratings,
  });

  lineChart(block3, {
    width,
    height,
    margin,
    variable: "sigla",
    incomingData: countries,
  });

  histoChart(block2, { width, height, margin, incomingData: data });
});
