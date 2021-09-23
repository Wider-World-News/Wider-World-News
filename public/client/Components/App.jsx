/* eslint-disable import/extensions */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';

import axios from 'axios';
import * as d3 from 'd3';
import Map from './Map.jsx';
// import LogIn from './LogIn.jsx';
// import Welcome from './Welcome.jsx';
import FavoriteList from './FavoriteList.jsx';
import NewsFeed from './NewsFeed.jsx';
import NavBar from './NavBar.jsx';
import Graph from './Graph.jsx';

function App() {
  const [isGraphShown, setIsGraphShown] = useState(true);
  const [currentFavorites, setFavorites] = useState({});
  const [loginStatus, changeLoginStatus] = useState(false);
  const [loginAttempt, changeAttempt] = useState(null);
  const [currentUser, changeUser] = useState(null);
  const [currentCountryClick, setCurrentCountryClick] = useState(null);
  const [posts, setPosts] = useState([]);

  //grabs svg in graphHolder div to graph when country is clicked in mapbox, replaces graph on graphholder if it is there
  const getGraph = (graphInput, indicatorInput) => {
    axios({
      method: 'GET',
      url: `/worldBank/economic/${graphInput}/${indicatorInput}`,
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        const { data } = response.data;
        const margin = {
          top: 30, right: 30, bottom: 30, left: 60,
        };
        const width = 370 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        const svg = d3.select('#graph');
        svg.on('dblclick', resizeChart);
        const xScale = d3
          .scaleUtc()
          .domain(d3.extent(data, (d) => d.year))
          .range([0, width]);
        const yScale = d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d.value))
          .range([height, 0]);
        const line = d3
          .line()
          .defined((d) => d.value !== null)
          .curve(d3.curveCatmullRom.alpha(0.02))
          .x((d) => xScale(d.year))
          .y((d) => yScale(d.value));
        const nullLine = d3
          .line()
          .defined((d) => d.value !== null)
          .curve(d3.curveCatmullRom.alpha(0.04))
          .x((d) => xScale(d.year))
          .y((d) => yScale(d.value));
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
        const yAxis = d3.axisLeft(yScale);
        function resizeChart() {
          const extent = d3.extent(data, (d) => d.year);
          xScale.domain(extent);
          const xAxisSelect = d3.select('.xAxis');
          xAxisSelect
            .transition()
            .duration(1000)
            .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(5));
          svg.select('.line').transition().duration(1000).attr('d', line(data));
          svg
            .select('.nullLine')
            .transition()
            .duration(1000)
            .attr('d', nullLine(data.filter(nullLine.defined())));
        }
        //updates graph if it is in graphHolder
        function updateChart(event) {
          if (event.selection) {
            const extent = event.selection;
            xScale.domain([xScale.invert(extent[0]), xScale.invert(extent[1])]);
            svg.select('.brush').call(brush.move, null);
            const xAxisSelect = d3.select('.xAxis');
            xAxisSelect
              .transition()
              .duration(1000)
              .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(5));
            svg
              .selectAll('.line')
              .transition()
              .duration(1000)
              .attr('d', line(data));
            svg
              .select('.nullLine')
              .transition()
              .duration(1000)
              .attr('d', nullLine(data.filter(nullLine.defined())));
          }
        }
        const brush = d3
          .brushX()
          .extent([
            [0, 0],
            [width, height + 20],
          ])
          .on('end', updateChart);
        svg
          .append('defs')
          .append('svg:clipPath')
          .attr('id', 'clip')
          .append('svg:rect')
          .attr('width', width)
          .attr('height', height + 10)
          .attr('x', 0)
          .attr('y', -10);
        if (line(data)) {
          const graph = d3.select('#graph');
          graph.selectChild('path').remove();
          graph.selectChildren('g').remove();
          graph.selectChildren('text').remove();
          svg
            .append('path')
            .data(data)
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .attr('stroke', '#ccc')
            .attr('clip-path', 'url(#clip)')
            .attr('fill', 'none')
            .attr('class', 'nullLine')
            .attr('d', nullLine(data.filter(nullLine.defined())));
          svg
            .data(data)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .append('path')
            .attr('d', line(data))
            .attr('class', 'line')
            .attr('clip-path', 'url(#clip)')
            .attr('fill', 'none')
            .attr('stroke', 'black');
          svg
            .append('g')
            .call(xAxis)
            .attr('class', 'xAxis')
            .attr(
              'transform',
              `translate(${margin.left},${height + margin.top})`,
            );
          svg
            .append('g')
            .attr('class', 'axis y')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);
          svg
            .append('text')
            .attr('class', 'x label')
            .attr('text-anchor', 'middle')
            .attr('x', (width + margin.left + margin.right) / 2)
            .attr('y', height + margin.bottom + margin.top)
            .attr('font-size', 10)
            .attr('font-family', 'sans-serif')
            .text('year');
          svg
            .append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('font-family', 'sans-serif')
            .attr('x', -(height + margin.bottom + margin.top) / 2)
            .attr('y', margin.left - 50)
            .attr('font-size', 10)
            .attr('transform', 'rotate(-90)')
            .text(response.data.yAxis);
          svg
            .append('g')
            .attr('class', 'brush')
            .attr('transform', `translate(${margin.left}, ${margin.top + 20})`)
            .call(brush);
        } else {
          const graph = d3.select('#graph');
          d3.selectAll('.line').remove();
          d3.selectAll('.nullLine').remove();
          graph.selectChild('.title').remove();
          svg
            .append('text')
            .attr('class', 'noData')
            .attr('text-anchor', 'middle')
            .attr('font-family', 'sans-serif')
            .attr('font-size', '20')
            .attr('x', (width + margin.left + margin.right) / 2)
            .attr('y', height / 2)
            .text('No Data to Display :(');
        }
        svg
          .append('text')
          .attr('class', 'title')
          .attr('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
          .attr('font-size', 14)
          .attr('x', (width + margin.left + margin.right) / 2)
          .attr('y', margin.top - 10)
          .text(response.data.countryName);
      })
      .catch((error) => alert(`${graphInput}is not a Country`));
  };

  const getPosts = (countryName) => {
    setTimeout(async () => {
      const postFetchData = await axios(`/api/getArticles/${countryName}`);
      // const postsArr = await postFetchData.json();
      setPosts(postFetchData.data);
    }, 1000);
  };

  const addFavorite = (title, link) => {
    const currentFavoritesCopy = { ...currentFavorites };
    const favoriteUpdate = Object.assign(currentFavoritesCopy, {
      [title]: link,
    });
    setFavorites(favoriteUpdate);
    axios('/api/addFav', {
      method: 'POST',
      data: { currentUser, title, link },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const deleteFavorite = (title, link) => {
    const currentFavoritesCopy = { ...currentFavorites };
    delete currentFavoritesCopy[title];
    setFavorites(currentFavoritesCopy);
    axios('/api/deleteFav', {
      method: 'DELETE',
      data: { currentUser, title, link },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <div className="wrapper">
      <NavBar
        setFavorites={setFavorites}
        loginStatus={loginStatus}
        changeLoginStatus={changeLoginStatus}
        loginAttempt={loginAttempt}
        changeAttempt={changeAttempt}
        currentUser={currentUser}
        changeUser={changeUser}
        setCurrentCountryClick={setCurrentCountryClick}
        setPosts={setPosts}
      />
      <div id="mainContainer">
        <Map
          setCurrentCountryClick={setCurrentCountryClick}
          setPosts={setPosts}
          getPosts={getPosts}
          getGraph={getGraph}
          isGraphShown={isGraphShown}
        />
        {!isGraphShown && (
          <>
            <NewsFeed
              currentCountryClick={currentCountryClick}
              posts={posts}
              currentFavorites={currentFavorites}
              setFavorites={setFavorites}
              addFavorite={addFavorite}
              deleteFavorite={deleteFavorite}
            />
            <FavoriteList
              currentFavorites={currentFavorites}
              deleteFavorite={deleteFavorite}
            />
          </>
        )}
        <button onClick={() => setIsGraphShown(!isGraphShown)}>
          Change Displays!
        </button>
        {isGraphShown && (
          <div>
            <select id='worldBankSelector'>
              <option value='DPANUSSPB'>Economic</option>
              <option value='SP.DYN.CBRT.IN'>Health</option>
              <option value='SP.POP.SCIE.RD.P6'>Science and Technology</option>
              <option value='EN.ATM.CO2E.KT'>Environmental Quality</option>
              <option value='AG.LND.AGRI.ZS'>Agricultural Development</option>
            </select>
            <Graph getGraph={getGraph} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
