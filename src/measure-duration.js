async function measureDuration(fn) {
  let hrStart = process.hrtime();

  if ('then' in fn) {
    await fn();
  } else {
    fn();
  }

  let [seconds, nanoseconds] = process.hrtime(hrStart);
  let milliseconds = nanoseconds / 1000000;

  console.info('Done in', seconds + 's', milliseconds + 'ms');
}

module.exports = {
  measureDuration
};
