'use client';

import React, { useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Modal } from 'antd';
import ReactDiffViewer from 'react-diff-viewer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend,
} from 'chart.js';
import './ChartChangeLogReview.scss';

// Đăng ký các components cần thiết
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartJSTooltip, Legend);

export default function ChartChangeLogReview(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataPopup, setDataPopup] = useState([]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const labels = () => {
    return [];
  };

  return (
    <>
      <div className="popup-change-log">
        <Modal width={1000} title="Data change log" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          {dataPopup ? (
            <div className="content-popup-change-log">
              {dataPopup.type == 'content' && dataPopup.data ? (
                <ReactDiffViewer
                  oldValue={dataPopup.data.before ? dataPopup.data.before : ''}
                  newValue={dataPopup.data.after ? dataPopup.data.after : ''}
                  splitView={true}
                />
              ) : (
                ''
              )}
              {dataPopup.type == 'is_deleted' && dataPopup.data ? (
                <ReactDiffViewer
                  oldValue={dataPopup.data.before ? dataPopup.data.before : ''}
                  newValue={dataPopup.data.after ? dataPopup.data.after : ''}
                  splitView={true}
                />
              ) : (
                ''
              )}
              {dataPopup.type == 'star' && dataPopup.data ? (
                <ReactDiffViewer
                  oldValue={dataPopup.data.before ? dataPopup.data.before : ''}
                  newValue={dataPopup.data.after ? dataPopup.data.after : ''}
                  splitView={true}
                />
              ) : (
                ''
              )}
              {dataPopup.type == 'relevance_position' && dataPopup.data ? (
                <ReactDiffViewer
                  oldValue={dataPopup.data.before ? dataPopup.data.before : ''}
                  newValue={dataPopup.data.after ? dataPopup.data.after : ''}
                  splitView={true}
                />
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
        </Modal>
      </div>
      <div className="block-header">Change Log Tracking</div>
      <div className="chart" id="chart-log_tracking">
        <Scatter
          data={props.value}
          height={430}
          options={{
            responsive: true,
            interaction: {
              mode: 'point',
            },
            aspectRatio: false,
            devicePixelRatio: 5,
            scales: {
              y: {
                ticks: {
                  // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                  callback: function (value, index, values) {
                    switch (value) {
                      case 1:
                        return 'Is deleted';
                      case 2:
                        return 'Content';
                      case 3:
                        return 'Star';
                      case 4:
                        return 'Relevance position';
                    }
                  },
                },
              },
              x: {
                type: 'category',
                labels: labels,
                display: true,
                grid: {
                  drawOnChartArea: false, // Add this line to hide the vertical grid lines
                },
                title: {
                  display: true,
                },
              },
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  generateLabels: function (chart) {
                    // Add this function to customize the shape of the legend labels
                    const datasets = chart.data.datasets;
                    const labels = datasets.map((dataset, i) => {
                      return {
                        datasetIndex: i,
                        text: dataset.label,
                        fillStyle: dataset.backgroundColor,
                        strokeStyle: dataset.borderColor,
                        lineWidth: dataset.borderWidth,
                        hidden: !chart.isDatasetVisible(i),
                        // Add these properties to make the legend labels square with rounded corners
                        borderRadius: 3,
                        width: 10,
                        height: 10,
                      };
                    });
                    return labels;
                  },
                },
              },
              tooltip: {
                // Disable the on-canvas tooltip
                enabled: false,
                intersect: true,
                callbacks: {
                  label: function (context) {
                    return "<div id='tooltip-change-log'><a style={color: 'red'}>Click for details</a></div>";
                  },
                },
                external: function (context) {
                  // Tooltip Element
                  var tooltipEl = document.getElementById('chartjs-tooltip');

                  // Create element on first render
                  if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = '<table></table>';
                    var parent = document.getElementById('chart-log-weekly');
                    if (parent && context.tooltip.dataPoints) {
                      parent.appendChild(tooltipEl);
                    }
                  }

                  // Hide if no tooltip
                  var tooltipModel = context.tooltip;
                  if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = 1;
                    return;
                  }

                  // Set caret Position
                  tooltipEl.classList.remove('above', 'below', 'no-transform');
                  if (tooltipModel.yAlign) {
                    tooltipEl.classList.add(tooltipModel.yAlign);
                  } else {
                    tooltipEl.classList.add('no-transform');
                  }

                  function getBody(bodyItem) {
                    return bodyItem.lines;
                  }

                  // Set Text
                  if (tooltipModel.body) {
                    var titleLines = tooltipModel.title || [];
                    var bodyLines = tooltipModel.body.map(getBody);

                    var innerHtml = '<thead>';

                    titleLines.forEach(function (title) {
                      innerHtml += '<tr><th>' + title + '</th></tr>';
                    });
                    innerHtml += '</thead><tbody>';

                    bodyLines.forEach(function (body, i) {
                      var colors = tooltipModel.labelColors[i];
                      var style = 'background:' + colors.backgroundColor;
                      style += '; border-color:' + colors.borderColor;
                      style += '; cursor :pointer';
                      style += '; border-width: 2px';
                      var span = '<span style="' + style + '"></span>';
                      innerHtml += '<tr><td>' + span + body + '</td></tr>';
                    });
                    innerHtml += '</tbody>';

                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                    document.getElementById('chartjs-tooltip').addEventListener('click', openButton);

                    function openButton() {
                      setIsModalVisible(true);
                      setDataPopup(context.tooltip.dataPoints[0].raw);
                      tooltipEl.style.opacity = 0;
                    }
                  }
                  var position = context.chart.canvas.getBoundingClientRect();

                  // Display, position, and set styles for font
                  tooltipEl.style.opacity = 1;
                  tooltipEl.style.position = 'absolute';
                  tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                  tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                  tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                },
              },
            },
          }}
        />
      </div>
    </>
  );
}
