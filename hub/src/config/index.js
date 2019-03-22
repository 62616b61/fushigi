const {
  RUNTIME,
} = process.env;

const runsInKubernetes = RUNTIME === 'kubernetes';

module.exports = {
  runsInKubernetes,
};
