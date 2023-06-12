module.exports = {
  apps: [
    {
      name: 'server',
      script: 'dist/index.js',
      interpreter_args: '-r dotenv/config',
    },
  ],
};
