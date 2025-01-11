import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PoolGraphByEpoch = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const d3Container = useRef(null);

  useEffect(() => {
    try {
        const fetchData = async () => {
          try {
            // Fetch data from the API
            const response = await axios.get('http://localhost:5000/rest/v1/pools.json?rows=true&limit=1000');
            const rows = response.data.rows;
    
            // Aggregate data by epoch
            const epochData = rows.reduce((acc, pool) => {
              const epoch = pool.block_epoch;
              if (!epoch) return acc; // Skip pools without block_epoch
    
              if (!acc[epoch]) {
                acc[epoch] = { epoch: epoch, totalPools: 0, producerPools: 0 };
              }
    
              acc[epoch].totalPools += 1; // Count every pool
              if (pool.block > 0) {
                acc[epoch].producerPools += 1; // Count producer pools
              }
    
              return acc;
            }, {});
    
            // Convert aggregated data to an array
            const chartData = Object.keys(epochData)
              .sort((a, b) => Number(a) - Number(b)) // Sort by epoch
              .map(epoch => ({
                epoch: `${epoch}`,
                totalPools: epochData[epoch].totalPools,
                producerPools: epochData[epoch].producerPools,
                ratio: (epochData[epoch].producerPools / epochData[epoch].totalPools) || 0,
              }));
    
              setLineChartData(chartData);

        // Process heatmap data (active stake, live stake)
        const epochDataForHeatmap = rows.reduce((acc, pool) => {
          const epoch = pool.block_epoch;
          if (!epoch || !pool.active_stake || !pool.live_stake) return acc;

          if (!acc[epoch]) {
            acc[epoch] = { epoch: epoch, activeStake: 0, liveStake: 0 };
          }

          acc[epoch].activeStake += Number(pool.active_stake);
          acc[epoch].liveStake += Number(pool.live_stake);

          return acc;
        }, {});

        const heatmapData = Object.keys(epochDataForHeatmap)
          .sort((a, b) => Number(a) - Number(b))
          .map(epoch => ({
            epoch: `${epoch}`,
            activeStake: epochDataForHeatmap[epoch].activeStake,
            liveStake: epochDataForHeatmap[epoch].liveStake,
          }));

        console.log('Heatmap Data:', heatmapData);
        setHeatmapData(heatmapData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);
  // Ensure that the state data is properly set
  useEffect(() => {
    console.log('Line Chart Data (State):', lineChartData);
    console.log('Heatmap Data (State):', heatmapData);
  }, [lineChartData, heatmapData]);

  useEffect(() => {
    if (heatmapData.length > 0 && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll('*').remove();

      const margin = { top: 50, right: 30, bottom: 50, left: 60 };
      const width = d3Container.current.clientWidth - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const epochs = heatmapData.map(d => d.epoch);
      const categories = ['Active Stake', 'Live Stake'];

      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(heatmapData, d => Math.max(d.activeStake, d.liveStake))]);

      const x = d3
        .scaleBand()
        .domain(epochs)
        .range([0, width])
        .padding(0.05);

      const y = d3
        .scaleBand()
        .domain(categories)
        .range([0, height])
        .padding(0.05);

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // X-axis without labels
      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickValues([])); // No tick labels

      // Heatmap cells
      const cells = g
        .selectAll('.cell')
        .data(
          heatmapData.flatMap(d => [
            { epoch: d.epoch, category: 'Active Stake', value: d.activeStake },
            { epoch: d.epoch, category: 'Live Stake', value: d.liveStake },
          ])
        )
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', d => x(d.epoch))
        .attr('y', d => y(d.category))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('fill', d => colorScale(d.value))
        .on('mouseover', function (event, d) {
          const tooltip = d3.select('body').append('div').attr('class', 'tooltip');
          tooltip
            .style('position', 'absolute')
            .style('background', '#333')
            .style('color', '#fff')
            .style('padding', '5px')
            .style('border-radius', '3px')
            .style('pointer-events', 'none')
            .style('top', `${event.pageY - 10}px`)
            .style('left', `${event.pageX + 10}px`)
            .html(
              `<strong>Epoch:</strong> ${d.epoch}<br/>
               <strong>Category:</strong> ${d.category}<br/>
               <strong>Value:</strong> ${d3.format('.2s')(d.value)}`
            );
        })
        .on('mouseout', () => {
          d3.select('.tooltip').remove();
        });

      // Legend at the bottom
      const legend = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top + height + 20})`);

      legend
        .selectAll('text')
        .data(categories)
        .enter()
        .append('text')
        .attr('x', (d, i) => i * 120)
        .attr('y', 0)
        .text(d => d)
        .attr('fill', '#fff')
        .style('font-size', '14px');
    }
  }, [heatmapData]);

  return (
    <div>
      <h3 className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
        Pool Data by Epoch
      </h3>
      {lineChartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineChartData} style={{ backgroundColor: '#3E4758', borderRadius: '8px' }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" tick={{ fill: '#82ca9d' }} />
              <YAxis tick={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalPools" stroke="#8884d8" name="Total Pools" />
              <Line type="monotone" dataKey="producerPools" stroke="#82ca9d" name="Producer Pools" />
              <Line type="monotone" dataKey="ratio" stroke="#ff7300" name="Producer Pools Ratio" />
            </LineChart>
          </ResponsiveContainer>

          <h3 className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
            Stake Distribution Heatmap
          </h3>
          <svg
            ref={d3Container}
            width="100%"
            height={450}
            style={{ backgroundColor: '#3E4758', border: '1px solid #ccc', overflowX: 'auto' }}
          />
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default PoolGraphByEpoch;
