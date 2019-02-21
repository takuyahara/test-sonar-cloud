import React from 'react';

interface IProps {
  htmlAttributes: object;
  headComponents: [];
  bodyAttributes: object;
  preBodyComponents: [];
  body: string;
  postBodyComponents: [];
}

export default function HTML(props: IProps): React.ReactNode {
  return (
    <html lang="en" {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div
          key={`body`}
          id="___gatsby"
        />
        {props.postBodyComponents}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.getElementById("___gatsby").addEventListener("touchstart", function(e) {
                e.preventDefault();
              });
            `,
          }}
        />
      </body>
    </html>
  );
}