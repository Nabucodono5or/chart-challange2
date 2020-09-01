import { select, selectAll } from "d3-selection";
import { csv } from "d3-fetch";
import iconSvg from "../resources/error.svg";

// selectAll(".icon-container").append("svg").attr("width", 50).attr("height", 60);
let width = 240;
let height = 230;

selectAll(".chart-block")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

csv(require("../data/netflix_titles.csv")).then((data) => {
  console.log(data);
  const ratings = mesuareRatings(data);
  console.log(ratings);
  renderMesuare(ratings);
});

function mesuareRatings(incomingData) {
  const ratings = [
    { rating: "TV-Y", total: 0 },
    { rating: "TV-14", total: 0 },
    { rating: "TV-MA", total: 0 },
  ];

  ratings.forEach((r) => {
    incomingData.forEach((d) => {
      if (r.rating === d.rating) {
        r.total++;
      }
    });
  });

  return ratings;
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
