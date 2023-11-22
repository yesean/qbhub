module.exports = {
  apps: [
    {
      name: 'server',
      script: 'dist/index.js',
      max_memory_restart: '900M',
    },
  ],
};
