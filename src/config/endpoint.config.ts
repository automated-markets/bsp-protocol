import* as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const env = process.env.NODE_ENV || 'development';

const configs = {
  base: {
    env,
    host: process.env.APP_HOST || '127.0.0.1',
    port: process.env.APP_PORT || 8545
  },
  production: {
    web3_provider_host: process.env.PRODUCTION_WEB3_PROVIDER_HOST || 'http://127.0.0.1',
    web3_provider_port: process.env.PRODUCTION_WEB3_PROVIDER_PORT || 8545,
    factory_address: "0x0000000000000000000000000000000000000000"
  },
  development: {
    web3_provider_host: process.env.DEVELOPMENT_WEB3_PROVIDER_HOST || 'http://127.0.0.1',
    web3_provider_port: process.env.DEVELOPMENT_WEB3_PROVIDER_PORT || 8545,
    factory_address: "0xcfeb869f69431e42cdb54a4f4f105c19c080a601"
  },
  test: {}
}

export const config = Object.assign(configs.base, configs[env]);