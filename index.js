
var Back = module.exports = function reconnect(callback, opts) {

  opts = opts || {};

  this.maxDelay = opts.maxDelay || Infinity;  // Maximum delay.
  this.minDelay = opts.minDelay || 500;       // Minimum delay.
  this.retries = opts.retries || 10;          // Amount of allowed retries.
  this.attempt = (+opts.attempt || 0) + 1;    // Current attempt.
  this.factor = opts.factor || 2;             // Back off factor.

  //
  // Bailout when we already have a backoff process running.
  //
  if (opts.backoff) return;

  // Bailout if we are about to make to much attempts. Please note that we use ...
  if (opts.attempt > opts.retries || opts.backoff) {
    return callback(new Error('Unable to retry'), opts);
  }

  // Prevent duplicate back off attempts.
  opts.backoff = true;

  //
  // Calculate the timeout, but make it randomly so we don't retry connections
  // at the same interval and defeat the purpose. This exponential back off is
  // based on the work of:
  //
  // http://dthain.blogspot.nl/2009/02/exponential-backoff-in-distributed.html
  //
  opts.timeout = opts.attempt !== 1
    ? Math.min(Math.round(
        (Math.random() + 1) * opts.minDelay * Math.pow(opts.factor, opts.attempt)
      ), opts.maxDelay)
    : opts.minDelay;

  setTimeout(function delay() {
    opts.backoff = false;
    callback(undefined, opts);
  }, opts.timeout);

};
