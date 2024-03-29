const createChart = require('./chart');

const getDetailsContentLayout = function(ymaps) {

  return ymaps.templateLayoutFactory.createClass(
      `<div class="details-info">
        {% if (properties.details) %}
            <div class="details-info">
                <div class="details-label">base station</div>
                <div class="details-title">{{properties.details.serialNumber}}</div>
                {% if (properties.details.isActive) %}
                <div class="details-state details-state_active">active</div>
                {% else %}
                <div class="details-state details-state_defective">defective</div>
                {% endif %}
                <div class="details-state details-state_connections">
                    connections: {{properties.details.connections}}
                </div>
            </div>
            <div class="details-info">
                <div class="details-label">connections</div>
                <canvas class="details-chart" width="270" height="100" />
            </div>
        {% else %}
            <div class="details-info">
                Идет загрузка данных...
            </div>
        {% endif %}
    `,
      {
          build() {
              this.constructor.superclass.build.call(this);

              const {details} = this.getData().object.properties;

              if (details) {
                  const container = this.getElement().querySelector('.details-chart');

                  this.connectionChart = createChart(
                      container,
                      details.chart,
                      details.isActive
                  );
              }
          },

          clear() {

              if (this.connectionChart) {
                  this.connectionChart.destroy();
              }

              this.constructor.superclass.clear.call(this);
          }
      }
  );
};

module.exports = getDetailsContentLayout;
