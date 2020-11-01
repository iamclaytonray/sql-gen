const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  scripts: {
    default: 'node index.js',
    build: {
      default: 'tsc',
      watch: 'tsc -w',
    },
    gen: {
      default: `node build/schemats schemats generate -c ${process.env.DB_URL}`,
    },
  },
};
