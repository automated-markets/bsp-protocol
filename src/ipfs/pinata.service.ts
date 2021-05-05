import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const baseUrl = process.env.PINATA_BASE_URL;
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_API_SECRET;

const pinJSONToIPFS = (body, options) => {
    validateApiKeys(pinataApiKey, pinataSecretApiKey);

    let requestBody = body;

    if (typeof body !== 'object') {
        throw new Error('body must be a valid JSON object');
    }

    if (options) {
        requestBody = {
            pinataContent: body
        };
        if (options.pinataMetadata) {
            validateMetadata(options.pinataMetadata);
            requestBody.pinataMetadata = options.pinataMetadata;
        }
        if (options.pinataOptions) {
            validatePinataOptions(options.pinataOptions);
            requestBody.pinataOptions = options.pinataOptions;
        }
    }

    const endpoint = `${baseUrl}/pinning/pinJSONToIPFS`;

    return new Promise((resolve, reject) => {
        axios.post(
            endpoint,
            requestBody,
            {
                withCredentials: true,
                headers: {
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey
                }
            }).then(function (result) {
            if (result.status !== 200) {
                reject(new Error(`unknown server response while pinning JSON to IPFS: ${result}`));
            }
            resolve(result.data);
        }).catch(function (error) {
            //  handle error here
            if (error && error.response && error.response && error.response.data && error.response.data.error) {
                reject(new Error(error.response.data.error));
            } else {
                reject(error);
            }
        });
    });
}

const validateApiKeys = (pinataApiKey, pinataSecretApiKey) => {
    if (!pinataApiKey || pinataApiKey === '') {
        throw new Error('No pinataApiKey provided! Please provide your pinata api key as an argument when you start this script');
    }
    if (!pinataSecretApiKey || pinataSecretApiKey === '') {
        throw new Error('No pinataSecretApiKey provided! Please provide your pinata secret api key as an argument when you start this script');
    }
}

const validateMetadata = (metadata) => {
    if (metadata.name) {
        if (!(typeof metadata.name === 'string' || metadata.name instanceof String)) {
            throw new Error('metadata name must be of type string');
        }
    }

    if (metadata.keyvalues) {
        if (!(typeof metadata.keyvalues === 'object')) {
            throw new Error('metatadata keyvalues must be an object');
        }

        let i = 0;

        Object.entries(metadata.keyvalues).forEach(function (keyValue) {
            if (i > 9) {
                throw new Error('No more than 10 keyvalues can be provided for metadata entries');
            }
            //  we want to make sure that the input is a string, a boolean, or a number, so we don't get an object passed in by accident

            if (!(typeof keyValue[1] === 'string' || typeof keyValue[1] === 'boolean' || !Number.isNaN(Number(keyValue[1])))) {
                throw new Error('Metadata keyvalue values must be strings, booleans, or numbers');
            }
            i++;
        });
    }
}

const validatePinPolicyStructure = (pinPolicy) => {
    //this function takes in a pin policy and checks the JSON structure to make sure it's valid
    if (!pinPolicy) {
        throw new Error('No pin policy provided');
    }

    if (!pinPolicy.regions) {
        throw new Error('No regions provided in pin policy');
    }
    if (pinPolicy.regions.length) {
        pinPolicy.regions.forEach((region) => {
            if (!region.id || !(Object.prototype.toString.call(region.id) === '[object String]')) {
                throw new Error('region id must be a string');
            }

            if (!(region.desiredReplicationCount || region.desiredReplicationCount === 0) || !Number.isInteger(region.desiredReplicationCount)) {
                throw new Error('desiredReplicationCount must be an integer');
            }
        });
    }
}

const validatePinataOptions = (options) => {
    if (typeof options !== 'object') {
        throw new Error('options must be an object');
    }

    if (options.cidVersion) {
        // eslint-disable-next-line eqeqeq
        if (options.cidVersion != 0 && options.cidVersion != 1) {
            throw new Error('unsupported or invalid cidVersion');
        }
    }
    if (options.wrapWithDirectory) {
        // eslint-disable-next-line eqeqeq
        if (options.wrapWithDirectory !== true && options.wrapWithDirectory !== false) {
            throw new Error('wrapWithDirectory must be a boolean value of true or false');
        }
    }

    if (options.customPinPolicy) {
        validatePinPolicyStructure(options.customPinPolicy);
    }
}

export default pinJSONToIPFS;