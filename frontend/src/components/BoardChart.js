import React from 'react'
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";
import 'primeicons/primeicons.css';
import {Chart} from 'primereact/chart';
import {useState, useEffect, useContext, useRef} from 'react';

function BoardChart(props) {
  const [chartData] = useState({
    labels  : ['19/Aug/17', '20/Aug/17', '21/Aug/17', '22/Aug/17', '23/Aug/17', '24/Aug/17', '25/Aug/17'],
    datasets: [{
      type       : 'line',
      label      : 'Dataset 1',
      borderColor: '#42A5F5',
      borderWidth: 2,
      fill       : false,
      tension    : .4,
      data       : [
        50,
        25,
        12,
        48,
        56,
        76,
        42
      ]
    }, {
      type       : 'bubble',
      label      : 'Issue',
      labels     : [
        'test 1',
        'test 2',
        'test 3',
        'test 4',
        'test 5',
        'test 6',
        'test 7',
      ],
      borderColor: '#66BB6A',
      borderWidth: 2,
      fill       : false,
      data       : [
        41,
        52,
        24,
        74,
        23,
        21,
        32
      ]
    }]
  });

  const [lightOptions] = useState({
    maintainAspectRatio: false,
    aspectRatio        : .6,
    plugins            : {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales             : {
      x: {
        ticks: {
          color: '#495057'
        },
        grid : {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid : {
          color: '#ebedef'
        }
      }
    }
  });
  return (
    <Chart type="line" data={chartData} options={lightOptions}/>
  )
}

export default BoardChart
