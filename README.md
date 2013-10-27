# back

[![build
status](https://secure.travis-ci.org/jcrugzz/back.png)](http://travis-ci.org/jcrugzz/back)

[![NPM](https://nodei.co/npm/back.png)](https://nodei.co/npm/back/)

A simple module to be used for creating exponentially weighted backoff attempts.
Used in [Primus][Primus]

## Example

```js
var http = require('http');
var back = require('back');
//
// Options to use for backoff
//
// Remark: This object is modified so it should be cloned if you are dealing
// with independent backoff attempts and want to use these values as a base.
//
var backoff = {
  retries: 3,
  minDelay: 1000, // Defaults to 500ms
  maxDelay: 10000, // Defaults to infinity
  // The following option is shown with its default value but you will most
  // likely never define it as it creates the exponential curve.
  factor: 2,
};

function retry(err) {
  return back(function (fail) {
    if (fail) {
      // Oh noez we never reconnect :(
      console.error('Retry failed with ' + err.message);
      process.exit(1);
    }
    //
    // Remark: .attempt and .timeout are added to this object internally
    //
    console.log('Retry attempt # ' + backoff.attempt +
                ' being made after ' + backoff.timeout + 'ms');
  request();
  }, backoff);
}

function request() {
  http.get('http://localhost:9000', function (res) {
    console.log('Successful Response that will not happen!');
  }).on('error', retry);
}

request();
```

## API

`back(callback, backoffOpts);`

The `back` function returns you a function that simply executes the `callback`
after a `setTimeout`. The timeout is what is based on an [exponential
backoff](http://dthain.blogspot.nl/2009/02/exponential-backoff-in-distributed.html) of course!

### Note:

I am considering switching the `backoffOpts` and `callback` as I understand it
is an irregular api if enough people want it.

[Primus]: https://github.com/3rd-Eden/primus

