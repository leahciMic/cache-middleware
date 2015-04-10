# Cache middleware in Redis

Note: This package is no longer actively maintained. At this time it's being
downloaded around ~60 times per month. This will probably be the last version
I release.

This middleware caches server responses in Redis. If you are using RedisToGo on
Heroku this will automatically default to that, otherwise it will try and
connect to a local Redis instance.

## Install

```sh
npm install --save cache-middleware
```

## Usage

```js

var express = require('express'),
	cache = require('cache-middleware'),
	otherMiddlewareThatTakesForever = require('other-middleware'),
	app = express();

app.use(cache('otherMiddleware', otherMiddlewareThatTakesForever, 86400));
```