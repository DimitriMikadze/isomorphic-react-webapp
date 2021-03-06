import express from 'express';
import cors from 'cors';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';

import { routes } from './src/shared/routes';

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/static/views");

app.use(express.static("static"));
app.use(express.static("dist"));
app.use(express.static("static/views/lessons"));
app.use(cors());

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.render('sitemap');
});

app.get('*', (req, res) => {
  match({routes, location: req.url}, (err, redirectLocation, props) => {
    if (req.headers.host.match(/^www/) !== null) {
      res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
    } else if (req.headers.host.toLowerCase() === 'geegle.io') {
      res.render('geegle');
    } else if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (props) {
      const content = renderToString(<RoutingContext {...props} />);
      res.render('index', {content})
    } else {
      res.sendStatus(404);
    }
  });
});

let port = process.env.PORT || '3000';

const server = app.listen(port, ()  => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("app listening on " + host + " " + port);
});