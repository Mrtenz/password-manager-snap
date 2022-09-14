import { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  jsxRuntime: 'automatic',
  plugins: [
    {
      resolve: 'gatsby-plugin-react-redux',
      options: {
        pathToCreateStoreModule: './src/store.ts',
      },
    },
  ],
};

export default config;
