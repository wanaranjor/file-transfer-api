module.exports = {
  apps: [{
    name: 'file-transfer-api',
    script: 'node -r source-map-support/register .',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }],
  env_production: {
    NODE_ENV: 'production',
  },
};
