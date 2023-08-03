import { prefixPluginTranslations } from '@strapi/helper-plugin';

import PluginIcon from './components/icon';

export default {
  register(app) {
    app.customFields.register({
      name: "deals",
      pluginId: "deals-picker",
      type: "json",
      intlLabel: {
        id: "deals-picker.deals.label",
        defaultMessage: "Add Deals",
      },
      intlDescription: {
        id: "deals-picker.deals.description",
        defaultMessage: "Add Deals",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import(/* webpackChunkName: "deals-component" */ "./components/Input"),
      }
    })
  },

  bootstrap(app) { },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, "deals-picker"),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
