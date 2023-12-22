module.exports = {
  apps: [
    {
      max_memory_restart: '900M',
      name: 'server-prod',
      script: 'dist/index.js',
    },
    {
      env: {
        NODE_ENV: 'development',
      },
      force: true,
      interpreter: 'node',
      name: 'server-dev',
      node_args: '--no-warnings=ExperimentalWarning --loader ts-node/esm',
      script: 'src/index.ts',
      watch: ['src'],
    },
  ],
};
