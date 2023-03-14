import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body style={{ backgroundImage: "linear-gradient(90deg, #3B4B51 0%, #28313A 100%)", margin: 0, padding: 0}}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;