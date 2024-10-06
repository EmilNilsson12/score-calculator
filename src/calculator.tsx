import { useState } from "react";

import { getRandomIntInclusive } from "./utils.tsx";

export const Calculator = () => {
  const [finalScore, setFinalScore] = useState(0);

  const [televoteScore, setTelevotescore] = useState(
    generateScoresFromTelevotes(mockedTelevotesByCountry)
  );

  const handleClick = () => {
    setFinalScore((oldCount) => oldCount + 1);

    const score = generateScoresFromTelevotes(mockedTelevotesByCountry);
    console.log("score");
    console.log(score);

    setTelevotescore(() => score);
  };
  return (
    <div>
      <article>
        <h1>How voting works in Eurovision</h1>
        <p>
          You, the viewer can call the number on the screen. This number is
          provided to you by your representing broadcaster, SVT for Sweden. All
          votes from all viewers in your country are tallied up.
        </p>
        <p>
          Where the country that got the most votes in your country gets 12
          points, the secondmost votes get 10 points, the third gets 8 points,
          fourth gets 7 points, all the way down to the 10th getting 1 point.
        </p>
      </article>
      <div>
        <h2>Scores from Public televote</h2>
        <ol style={{ textAlign: "left" }}>
          {televoteScore?.map((scoring) => {
            return (
              <li key={scoring.country}>
                {scoring.televoteScore} - {scoring.country}
              </li>
            );
          })}
        </ol>
      </div>
      {/* <div>
        <h2>Scores from United Kingdom</h2>
        <div style={{ display: "flex", gap: "24px" }}>
          <div>
            <h3>Scores from public</h3>
            <ol>
              <li>Sweden</li>
              <li>Norway</li>
              <li>Denmark</li>
              <li>Finland</li>
              <li>Germany</li>
              <li>France</li>
              <li>Spain</li>
              <li>Portugal</li>
              <li>Bulgaria</li>
              <li>Moldova</li>
              <li>Italy</li>
              <li>Ukraine</li>
            </ol>
          </div>
          <div>
            <h3>Scores from jury</h3>
            <ol>
              <li>Sweden</li>
              <li>Norway</li>
              <li>Denmark</li>
              <li>Finland</li>
              <li>Germany</li>
              <li>France</li>
              <li>Spain</li>
              <li>Portugal</li>
              <li>Bulgaria</li>
              <li>Moldova</li>
              <li>Italy</li>
              <li>Ukraine</li>
            </ol>
          </div>
        </div>
      </div> */}
    </div>
  );
};

const countriesParticipating2024 = [
  "Albania",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Belgium",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Iceland",
  "Ireland",
  "Israel",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Moldova",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "San Marino",
  "Serbia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Ukraine",
  "United Kingdom",
];

function fromVotesToPoints(country, index) {
  if (index === 0) {
    return {
      name: country.countryName,
      points: 12,
    };
  } else if (index === 1) {
    return {
      name: country.countryName,
      points: 10,
    };
  } else if (index >= 2) {
    return {
      name: country.countryName,
      points: 10 - index,
    };
  }
}
function transformTelevotesToPoints(listOfCountriesVotes) {
  const compareTelevotesRecieved = (countryA, countryB) => {
    if (countryA.votes < countryB.votes) {
      return 1;
    } else if (countryA.votes > countryB.votes) {
      return -1;
    }
    // a must be equal to b
    return 0;
  };

  return (
    listOfCountriesVotes
      .sort(compareTelevotesRecieved)
      // removeAllButTopTen
      .slice(0, 10)
      .map(fromVotesToPoints)
  );
}

const finalistCountries = countriesParticipating2024.slice(0, 26);

function getMockTopTen() {
  const randomNumbers = [];
  for (let i = 0; i < 10; i++) {
    const randomNumber = getRandomIntInclusive(0, 25);
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
    } else {
      i--;
    }
  }
  return randomNumbers;
}

function mockCountryTelevoteTopTen() {
  const mockedTelevoteResults = [];
  for (const country of countriesParticipating2024) {
    const fromRunningOrderToCountry = (runningOrder, index) => {
      return {
        countryName: finalistCountries[runningOrder],
        votes: 10 - index,
      };
    };
    const topTenByRunningOrder = getMockTopTen();
    const topTenPoints = topTenByRunningOrder
      .map(fromRunningOrderToCountry)
      .map(fromVotesToPoints);
    mockedTelevoteResults.push({
      countryName: country,
      televoteResults: topTenPoints,
    });
  }
  return mockedTelevoteResults;
}
const mockedTelevotesByCountry = mockCountryTelevoteTopTen();

function generateScoresFromTelevotes(televotesPerCountry) {
  // For each country participating in the final

  // Reduce from list of each broadcasters top 10
  const countriesWithTelevoteScores = [];
  finalistCountries.forEach((finalist) => {
    // mockedTelevotesByCountry.reduce((resultPerCountry) => {}, 0);
    let totalScoreForFinalist = 0;
    televotesPerCountry.forEach((countryTelevoteResults) => {
      if (
        countryTelevoteResults.televoteResults.find(
          (results) => results.name === finalist
        )
      ) {
        totalScoreForFinalist += countryTelevoteResults.televoteResults.find(
          (results) => results.name === finalist
        )?.points;
      }
    });
    console.log("-");
    countriesWithTelevoteScores.push({
      country: finalist,
      televoteScore: totalScoreForFinalist,
    });
  });
  return countriesWithTelevoteScores.sort((a, b) =>
    a.televoteScore > b.televoteScore ? -1 : 1
  );
}

function generateScoresFromTelevotesChatGPTReduceRewrite(televotes) {
  // Map the finalists (list of strings)
  // and give them each their televote scores from all countries
  const countriesWithTelevoteScores = finalistCountries.map((finalist) => {
    // Reduce the mockedTelevotes inside the map
    // This reduces the score for each finalist
    const totalScoreForFinalist = televotes.reduce(
      (scoreAcc, countryTelevoteResults) => {
        const result = countryTelevoteResults.televoteResults.find(
          (results) => results.name === finalist
        );
        if (result) {
          return scoreAcc + result.points;
        }
        return scoreAcc;
      },
      0
    );
    return {
      finalist,
      televoteScore: totalScoreForFinalist,
    };
  });
  return countriesWithTelevoteScores.sort((a, b) =>
    a.televoteScore > b.televoteScore ? -1 : 1
  );
}

const testDataSwedensTelevotes = [
  {
    countryName: "Norway",
    votes: 1043555555532,
  },
  {
    countryName: "Germany",
    votes: 104332,
  },
  {
    countryName: "Moldova",
    votes: 2,
  },
  {
    countryName: "Belarus",
    votes: 104332,
  },
  {
    countryName: "Iceland",
    votes: 3,
  },
  {
    countryName: "Ukraine",
    votes: 4,
  },
  {
    countryName: "Italy",
    votes: 1404332,
  },
  {
    countryName: "France",
    votes: 5,
  },
  {
    countryName: "Denmark",
    votes: 6,
  },
  {
    countryName: "Russia",
    votes: 1043132,
  },
  {
    countryName: "Greece",
    votes: 1404332,
  },
  {
    countryName: "Finland",
    votes: 1043532,
  },
];
const transformedPoints = transformTelevotesToPoints(testDataSwedensTelevotes);
