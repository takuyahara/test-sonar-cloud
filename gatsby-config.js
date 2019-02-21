module.exports = {
  siteMetadata: {
    title: `Axl Metronome`,
    description: `A metronome that increases/decreases tempo automatically. Stable tempo as usual is also supported of course.`,
    author: `Takuya HARA`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `sounds`,
        path: `${__dirname}/src/sounds`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Axl Metronome`,
        short_name: `AxlMetronome`,
        start_url: `/`,
        background_color: `#000`,
        theme_color: `orange`,
        display: `fullscreen`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`,
  ],
};
