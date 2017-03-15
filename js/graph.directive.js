angular.module('app')
.directive('d3Bars', ['$window', '$timeout', 'd3Service',
  function($window, $timeout, d3Service) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {

          var renderTimeout;
          var margin = parseInt(attrs.margin) || 250,
              barHeight = parseInt(attrs.barHeight) || 100,
              barPadding = parseInt(attrs.barPadding) || 30;

          var svg = d3.select(ele[0])
            .append('svg')
            .style('width', '100%');

          $window.onresize = function() {
            scope.$apply();
          };

          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });

          scope.$watch('data', function(newData) {
            scope.render(newData);
          }, true);

          scope.render = function(data) {
            svg.selectAll('*').remove();

            if (!data) return;
            if (renderTimeout) clearTimeout(renderTimeout);

            renderTimeout = $timeout(function() {
              var width = d3.select(ele[0])[0][0].offsetWidth - margin,
                  height = scope.data.length * (barHeight + barPadding),
                  color = d3.scale.category20(),
                  xScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                      return d.count;
                    })])
                    .range([0, width]);

              svg.attr('height', height);

              //125,75

              svg.selectAll('rect')
                .data(data)
                .enter()
                  .append('rect')
                  .on('click', function(d,i) {
                    return scope.onClick({item: d});
                  })
                  .attr('height', 10)
                  .attr('width', 250)
                  .attr('x', Math.round(margin/2))
                  .attr('y', function(d,i) {
                    return i * (barHeight + barPadding) + 75;
                  })
                  .attr('fill', function(d) {
                    return "#0095dd";
                  })
                  .transition()
                    .duration(1000)
                    .attr('width', function(d) {
                      return xScale(d.count);
                    });
              svg.selectAll('text')
                .data(data)
                .enter()
                  .append('text')
                  .attr('fill', '#fff')
                  .attr('y', function(d,i) {
                    return i * (barHeight + barPadding) + 35;
                  })
                  .attr('x', 125)
                  .text(function(d) {
                    return d.name + " --- HOH WINS: " + d.hoh + " POV WINS: " +  d.pov;
                })
                .attr('y', 125)
                .text(function (d) {
                  return "HOH Wins: " + d.hoh + " POV wins: " + d.pov;
                })                
                  .append("tspan")
                    .attr('fill', '#fff')
                    .attr('y', function(d,i) {
                        return i * (barHeight + barPadding) + 60;
                    })
                    .attr('x', 125)
                    .text(function(d) {return "Picked " + d.count + " times";});
        //}

              // svg.selectAll('text')
              //   .data(data)
              //   .enter()
              //     .append('text')
              //     .attr('fill', '#fff')
              //     .attr('y', function(d,i) {
              //       return i * (barHeight + barPadding) + 10;
              //     })
              //     .attr('x', 50)
              //     .text(function(d) {
              //       return d.count;
              //     });

// <image xlink:href="firefox.jpg" x="0" y="0" height="50px" width="50px"/>


                        svg.selectAll("image")
                            .data(data)
                                .enter()
                                .append("svg:image")
                                .attr("xlink:href", function(d) {  return d.photo; })
                                .attr("x", "0")
                                  .attr('y', function(d,i) {
                                    return i * (barHeight + barPadding);
                                  })
                                .attr("width", "100")
                                .attr("height", barHeight);


            }, 200);
          };
        });
      }};
}]);