'use strict';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "deals",
    plugin: "deals-picker",
    type: "json"
  });
};
