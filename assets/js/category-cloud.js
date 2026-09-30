/* Draws a category word cloud with d3 + d3-cloud.
   Silently does nothing if the libraries failed to load or there is no data. */
(function () {
  'use strict';

  var CLOUD_HEIGHT = 300;
  var MIN_FONT = 14;
  var MAX_FONT = 52;
  var PADDING = 6;
  var PALETTE = ['#2563eb', '#dc2626', '#0d9488', '#d97706', '#7c3aed', '#db2777', '#059669', '#b45309']; // every colour ≥ 3:1 on both #fff and #1b1b1e

  function render() {
    var container = document.getElementById('category-cloud');
    var dataNode = document.getElementById('category-data');
    if (!container || !dataNode) return;
    if (typeof window.d3 === 'undefined' || typeof window.d3.layout === 'undefined' || !window.d3.layout.cloud) return;

    var words;
    try {
      words = JSON.parse(dataNode.textContent);
    } catch (err) {
      console.warn('[category-cloud] invalid data', err);
      return;
    }
    if (!Array.isArray(words) || words.length === 0) return;

    var width = container.clientWidth || 600;
    // d3-cloud measures glyphs on a canvas, so it needs a real font name, not 'inherit'
    var fontFamily = window.getComputedStyle(container).fontFamily || 'sans-serif';
    var sizes = words.map(function (w) { return w.size; });
    var fontScale = d3.scaleLog()
      .domain([Math.max(1, d3.min(sizes)), Math.max(2, d3.max(sizes))])
      .range([MIN_FONT, MAX_FONT]);

    container.innerHTML = '';

    d3.layout.cloud()
      .size([width, CLOUD_HEIGHT])
      .words(words.map(function (w) { return { text: w.text, size: fontScale(w.size), url: w.url }; }))
      .padding(PADDING)
      .rotate(0)
      .font(fontFamily)
      .fontSize(function (d) { return d.size; })
      .on('end', draw)
      .start();

    function draw(placed) {
      var svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', CLOUD_HEIGHT)
        .attr('role', 'img');

      svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + CLOUD_HEIGHT / 2 + ')')
        .selectAll('a')
        .data(placed)
        .enter()
        .append('a')
        .attr('href', function (d) { return d.url; })
        .append('text')
        .style('font-family', fontFamily)
        .style('font-size', function (d) { return d.size + 'px'; })
        .style('font-weight', 700)
        .style('fill', function (d, i) { return PALETTE[i % PALETTE.length]; })
        .attr('text-anchor', 'middle')
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')rotate(' + d.rotate + ')'; })
        .text(function (d) { return d.text; });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
