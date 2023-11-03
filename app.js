const express = require('express')
const app = express()

//const { FileSystemWallet, Gateway } = require('fabric-network');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('../../test-application/javascript/AppUtil.js');
//const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

const memberAssetCollectionName = 'assetCollection';
const org1PrivateCollectionName = 'Org1MSPPrivateCollection';
const org2PrivateCollectionName = 'Org2MSPPrivateCollection';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const Org1UserId = 'appUser1';
const Org2UserId = 'appUser2';

const RED = '\x1b[31m\n';
const RESET = '\x1b[0m';

function prettyJSONString(inputString) {
              return JSON.stringify(JSON.parse(inputString), null, 2);
}

function doFail(msgString) {
    console.error(`${RED}\t${msgString}${RESET}`);
    process.exit(1);
}
// CORS Origin
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());

app.get('/init', async (req, res) => {
try {

    
              // build an in memory object with the network configuration (also known as a connection profile)
                             const ccp = buildCCPOrg1();

                             // build an instance of the fabric ca services client based on
                             // the information in the network configuration
                             const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

                             // setup the wallet to hold the credentials of the application user
                             const wallet = await buildWallet(Wallets, walletPath);

                             // in a real application this would be done on an administrative flow, and only once
                             await enrollAdmin(caClient, wallet, mspOrg1);

                             // in a real application this would be done only when a new user was required to be added
                             // and would be part of an administrative flow
                             await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

                             // Create a new gateway instance for interacting with the fabric network.
                             // In a real application this would be done as the backend server session is setup for
                             // a user that has been verified.
                             const gateway = new Gateway();

                             try {
                                           // setup the gateway instance
                                           // The user will now be able to create connections to the fabric network and be able to
                                           // submit transactions and query. All transactions submitted by this gateway will be
                                           // signed by this user using the credentials stored in the wallet.
                                           console.log("Try to set gateway instance")
                                           await gateway.connect(ccp, {
                                                          wallet,
                                                          identity: org1UserId,
                                                          discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                                           });
                                           console.log(channelName)
                                           // Build a network instance based on the channel where the smart contract is deployed
                                           const network = await gateway.getNetwork(channelName);
                                           console.log(network)
                                           // Get the contract from the network.
                                           const contract = network.getContract(chaincodeName);
                                           console.log(chaincodeName)
                                           // Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
                                           // This type of transaction would only be run once by an application the first time it was started after it
                                           // deployed the first time. Any updates to the chaincode deployed later would likely not need to run
                                           // an "init" type function.
                                           console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
                                           await contract.submitTransaction('InitLedger');
                                           console.log('*** Result: committed');

                                           // Let's try a query type operation (function).
                                           // This will be sent to just one peer and the results will be shown.
                                           console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                                           let result = await contract.evaluateTransaction('GetAllAssets');
                                           console.log(`*** Result: ${prettyJSONString(result.toString())}`);
                             }finally {
                                           // Disconnect from the gateway when the application is closing
                                           // This will close all connections to the network
                                           //gateway.disconnect();
                                           console.log("Connections are maintained")
                                           }
            res.json({status: true, message: 'Initialization done'})
              } 
   catch (err) {
    res.json({status: false, error: err});
  }
});


app.get('/listAll', async (req, res) => {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg1();
    
            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
    
            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);
    
            // in a real application this would be done on an administrative flow, and only once
            await enrollAdmin(caClient, wallet, mspOrg1);
    
            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
    
            // Create a new gateway instance for interacting with the fabric network.
            // In a real application this would be done as the backend server session is setup for
            // a user that has been verified.
            const gateway = new Gateway();
    
            try {
                // setup the gateway instance
                // The user will now be able to create connections to the fabric network and be able to
                // submit transactions and query. All transactions submitted by this gateway will be
                // signed by this user using the credentials stored in the wallet.
                console.log("Try to set gateway instance")
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });
                console.log(channelName)
                // Build a network instance based on the channel where the smart contract is deployed
                const network = await gateway.getNetwork(channelName);
                console.log(network)
                // Get the contract from the network.
                const contract = network.getContract(chaincodeName);
                console.log(chaincodeName)
                    
                // Let's try a query type operation (function).
                // This will be sent to just one peer and the results will be shown.
                console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                let result = await contract.evaluateTransaction('GetAllAssets');
                console.log(`*** Result: ${prettyJSONString(result.toString())}`);
                res.json({status: true, cars: JSON.parse(result.toString())})
            }finally {
                // Disconnect from the gateway when the application is closing
                // This will close all connections to the network
                //gateway.disconnect();
            }
            
        } 
       catch (err) {
        res.json({status: false, error: err});
      }
    });

    app.get('/getDetailsByID/:key', async (req, res) => {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
                const ccp = buildCCPOrg1();
       
                // build an instance of the fabric ca services client based on
                // the information in the network configuration
                //const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
        
                // setup the wallet to hold the credentials of the application user
                const wallet = await buildWallet(Wallets, walletPath);
        
                // in a real application this would be done on an administrative flow, and only once
                //await enrollAdmin(caClient, wallet, mspOrg1);
        
                // in a real application this would be done only when a new user was required to be added
                // and would be part of an administrative flow
                //await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
        
                // Create a new gateway instance for interacting with the fabric network.
                // In a real application this would be done as the backend server session is setup for
                // a user that has been verified.
                const gateway = new Gateway();
        
                try {
                    // setup the gateway instance
                    // The user will now be able to create connections to the fabric network and be able to
                    // submit transactions and query. All transactions submitted by this gateway will be
                    // signed by this user using the credentials stored in the wallet.
                    console.log("Try to set gateway instance")
                    await gateway.connect(ccp, {
                        wallet,
                        identity: org1UserId,
                        discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                    });
                    // Build a network instance based on the channel where the smart contract is deployed
                    const network = await gateway.getNetwork(channelName);
                    // Get the contract from the network.
                    const contract = network.getContract(chaincodeName);

                        
                    // Let's try a query type operation (function).
                    // This will be sent to just one peer and the results will be shown.
                    console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
                    console.log(req.params.key);
                                                   result = await contract.evaluateTransaction('ReadAsset', req.params.key);
                                                   console.log(`*** Result: ${prettyJSONString(result.toString())}`);
                    res.json({status: true, cars: JSON.parse(result.toString())})
                }finally {
                    // Disconnect from the gateway when the application is closing
                    // This will close all connections to the network
                    //gateway.disconnect();
                }
                
            } 
           catch (err) {
            res.json({status: false, error: err});
          }
        });
    

app.post('/createBatch', async (req, res) => {
  if ((typeof req.body.batchid === 'undefined' || req.body.batchid === '') ||
      (typeof req.body.batchname === 'undefined' || req.body.batchname === '') ||
      (typeof req.body.description === 'undefined' || req.body.description === '') ||
      (typeof req.body.createdDate === 'undefined' || req.body.createdDate === '') ||
      (typeof req.body.status === 'undefined' || req.body.status === '')) {
    res.json({status: false, error: {message: 'Missing body.'}});
    return;
  }
   const ccp = buildCCPOrg1();
   // setup the wallet to hold the credentials of the application user
   const wallet = await buildWallet(Wallets, walletPath);
  try { 
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
    });
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    await contract.submitTransaction('CreateBatch', req.body.batchid, req.body.batchname, req.body.description, req.body.createdDate, req.body.status);
    res.json({status: true, message: 'Transaction (create batch) has been submitted.'})
  } catch (err) {
    res.json({status: false, error: err});
  }
});

app.put('/cars', async (req, res) => {
  if ((typeof req.body.key === 'undefined' || req.body.key === '') ||
      (typeof req.body.owner === 'undefined' || req.body.owner === '')) {
    res.json({status: false, error: {message: 'Missing body.'}});
    return;
  }

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      res.json({status: false, error: {message: 'User not exist in the wallet'}});
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');
    await contract.submitTransaction('changeCarOwner', req.body.key, req.body.owner);
    res.json({status: true, message: 'Transaction (change car owner) has been submitted.'})
  } catch (err) {
    res.json({status: false, error: err});
  }
});

app.put('/batch', async (req, res) => {
    if ((typeof req.body.batchid === 'undefined' || req.body.batchid === '') ||
      (typeof req.body.batchname === 'undefined' || req.body.batchname === '') ||
      (typeof req.body.description === 'undefined' || req.body.description === '') ||
      (typeof req.body.createdDate === 'undefined' || req.body.createdDate === '') ||
      (typeof req.body.status === 'undefined' || req.body.status === '')) {
    res.json({status: false, error: {message: 'Missing body.'}});
    return;
  }
   const ccp = buildCCPOrg1();
   // setup the wallet to hold the credentials of the application user
   const wallet = await buildWallet(Wallets, walletPath);
   const gateway = new Gateway();
  try { 
  // console.log(gateway)
    await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
    });
    console.log(gateway)
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
      await contract.submitTransaction('UpdateBatch', req.body.batchid, req.body.batchname, req.body.description, req.body.createdDate, req.body.status);
      res.json({status: true, message: 'Transaction  has been updated.'})
    } catch (err) {
      res.json({status: false, error: err});
    }
  });

 

  app.get('/trace', (req, res) => {
    // Hardcoded data for tracing (you can replace this with your actual data)
    const sampleTraceData = {
      "status": true,
      "cars": [
          {
              "Key": "\u0000batch~name\u0000MerinoBatch_01\u0000Rumtsey\u0000RumtseyMerinoBatch_01\u0000",
              "Record": {
                  "AdditionalInfo": {
                      "VaccinatedDate": "2023-09-30 08:30:30",
                      "VaccinatedPlace": "RUMTSEYLOC",
                      "VaccinationType": "VT"
                  },
                  "AnimalType": "Merino Sheep",
                  "Grade": "A",
                  "Quantity": "100kg",
                  "ReceiverID": "CCID4",
                  "SenderID": "RumtseyFarmer",
                  "batchid": "RumtseyMerinoBatch_01",
                  "createdDate": "2023-10-29 08:35:30",
                  "currentowner": "RumtseyFarmer",
                  "department": "department1",
                  "docType": "product",
                  "location": "Rumtsey",
                  "masterid": "MerinoBatch_01",
                  "org": "Org1",
                  "parentbatchid": null,
                  "status": "Dispatched"
              }
          },
          {
              "Key": "\u0000batch~name\u0000MerinoBatch_01\u0000Gia\u0000GiaMerinoBatch_01\u0000",
              "Record": {
                  "AdditionalInfo": {
                      "VaccinatedDate": "2023-09-30 08:30:30",
                      "VaccinatedPlace": "GIALOC",
                      "VaccinationType": "VT"
                  },
                  "AnimalType": "Merino Sheep",
                  "Grade": "A",
                  "Quantity": "700kg",
                  "ReceiverID": "CCID1",
                  "SenderID": "GiaFarmer",
                  "batchid": "GiaMerinoBatch_01",
                  "createdDate": "2023-10-30 08:30:30",
                  "currentowner": "GiaFarmer",
                  "department": "department1",
                  "docType": "product",
                  "location": "Gia",
                  "masterid": "MerinoBatch_01",
                  "org": "Org1",
                  "parentbatchid": null,
                  "status": "Dispatched"
              }
          },
          {
              "Key": "\u0000batch~name\u0000MerinoBatch_01\u0000Meero\u0000MeeroMerinoBatch_01\u0000",
              "Record": {
                  "AdditionalInfo": {
                      "VaccinatedDate": "2023-09-30 08:30:30",
                      "VaccinatedPlace": "MEEROLOC",
                      "VaccinationType": "VT"
                  },
                  "AnimalType": "Merino Sheep",
                  "Grade": "A",
                  "Quantity": "100kg",
                  "ReceiverID": "CCID2",
                  "SenderID": "MeeroFarmer",
                  "batchid": "MeeroMerinoBatch_01",
                  "createdDate": "2023-10-30 08:35:30",
                  "currentowner": "MeeroFarmer",
                  "department": "department1",
                  "docType": "product",
                  "location": "Meero",
                  "masterid": "MerinoBatch_01",
                  "org": "Org1",
                  "parentbatchid": null,
                  "status": "Dispatched"
              }
          },
          {
              "Key": "\u0000batch~name\u0000MerinoBatch_01\u0000Sasoma\u0000SasomaMerinoBatch_01\u0000",
              "Record": {
                  "AdditionalInfo": {
                      "VaccinatedDate": "2023-09-30 08:30:30",
                      "VaccinatedPlace": "SASOLOC",
                      "VaccinationType": "VT"
                  },
                  "AnimalType": "Merino Sheep",
                  "Grade": "A",
                  "Quantity": "100kg",
                  "ReceiverID": "CCID3",
                  "SenderID": "SasomaFarmer",
                  "batchid": "SasomaMerinoBatch_01",
                  "createdDate": "2023-10-30 08:35:30",
                  "currentowner": "SasomaFarmer",
                  "department": "department1",
                  "docType": "product",
                  "location": "Sasoma",
                  "masterid": "MerinoBatch_01",
                  "org": "Org1",
                  "parentbatchid": null,
                  "status": "Dispatched"
              }
          },
          {
              "Key": "\u0000batch~name\u0000MerinoBatch_01\u0000CCID2Location\u0000MeeroMerinoBatch_01\u0000",
              "Record": {
                  "AnimalType": "Merino Sheep",
                  "Grade": "A",
                  "Quantity": "100kg",
                  "ReceiverID": "FPO",
                  "SenderID": "CCID2",
                  "batchid": "MeeroMerinoBatch_01",
                  "createdDate": "2023-10-30 09:35:30",
                  "currentowner": "CCID2",
                  "department": "CCID",
                  "docType": "product",
                  "location": "CCID2Location",
                  "masterid": "MerinoBatch_01",
                  "org": "Org1",
                  "parentbatchid": null,
                  "status": "Dispatched"
              }
          },
          {
              "Key": "\u0000batch~name\u0000MerinoBatch_01\u0000CCID3Location\u0000SasomaMerinoBatch_01\u0000",
              "Record": {
                  "AnimalType": "Merino Sheep",
                  "Grade": "A",
                  "Quantity": "100kg",
                  "ReceiverID": "FPO",
                  "SenderID": "CCID3",
                  "batchid": "SasomaMerinoBatch_01",
                  "createdDate": "2023-10-31 07:30:30",
                  "currentowner": "CCID3",
                  "department": "CCID",
                  "docType": "product",
                  "location": "CCID3Location",
                  "masterid": "MerinoBatch_01",
                  "org": "Org1",
                  "parentbatchid": null,
                  "status": "Dispatched"
              }
          },
          {
              "Key": "\u0000batch~name\u0000MerinoBatch_01\u0000CCID1Location\u0000GiaMerinoBatch_01\u0000",
              "Record": {
                  "AnimalType": "Merino Sheep",
                  "Grade": "A",
                  "Quantity": "700kg",
                  "ReceiverID": "FPO",
                  "SenderID": "CCID1",
                  "batchid": "GiaMerinoBatch_01",
                  "createdDate": "2023-10-31 09:30:30",
                  "currentowner": "CCID1",
                  "department": "CCID",
                  "docType": "product",
                  "location": "CCID1Location",
                  "masterid": "MerinoBatch_01",
                  "org": "Org1",
                  "parentbatchid": null,
                  "status": "Dispatched"
              }
          },
          {
              "Key": "\u0000batch~name\u0000MerinoBatch_01\u0000CCID4Location\u0000RumtseyMerinoBatch_01\u0000",
              "Record": {
                  "AnimalType": "Merino Sheep",
                  "Grade": "A",
                  "Quantity": "90kg",
                  "ReceiverID": "FPO",
                  "SenderID": "CCID4",
                  "batchid": "RumtseyMerinoBatch_01",
                  "createdDate": "2023-10-31 17:30:30",
                  "currentowner": "CCID4",
                  "department": "CCID",
                  "docType": "product",
                  "location": "CCID4Location",
                  "masterid": "MerinoBatch_01",
                  "org": "Org1",
                  "parentbatchid": null,
                  "status": "Dispatched"
              }
          },
      {
              "Key": "\u0000batch~name\u0000MerinoBatch_01\u0000CCID4Location\u0000RumtseyMerinoBatch_01\u0000",
              "Record": {
                  "AnimalType": "Merino Sheep",
                  "Grade": "A",
                  "Quantity": "90kg",
                  "ReceiverID": "FPO",
                  "SenderID": "CCID4",
                  "batchid": "RumtseyMerinoBatch_01",
                  "createdDate": "2023-10-31 17:30:30",
                  "currentowner": "FPO",
                  "department": "FPO",
                  "docType": "product",
                  "location": "FPO",
                  "masterid": "MerinoBatch_01",
                  "org": "Org1",
                  "parentbatchid": null,
                  "status": "ReceiverID"
              }
          }
      ]
  };
  
    res.json(sampleTraceData);
  });

  app.get('/getCaCertificate', (req, res) => {
    try {
      const certificate = {
        
          "status": true,
          "Response": "Certificate:\n    Data:\n        Version: 3 (0x2)\n        Serial Number:\n            0d:35:5e:5c:63:89:53:e3:e4:ba:fe:39:88:64:68:2e:ba:0b:1e:3b\n        Signature Algorithm: ecdsa-with-SHA256\n        Issuer: C = US, ST = North Carolina, L = Durham, O = org1.example.com, CN = ca.org1.example.com\n        Validity\n            Not Before: Oct 26 04:26:00 2023 GMT\n            Not After : Oct 22 04:26:00 2038 GMT\n        Subject: C = US, ST = North Carolina, L = Durham, O = org1.example.com, CN = ca.org1.example.com\n        Subject Public Key Info:\n            Public Key Algorithm: id-ecPublicKey\n                Public-Key: (256 bit)\n                pub:\n                    04:aa:67:a9:ee:3f:20:92:f9:73:d6:b2:9c:a2:e5:\n                    80:e8:f0:79:6a:70:41:5f:9a:ae:bc:a9:44:1e:6d:\n                    61:ad:b6:a5:15:82:24:f6:2f:c8:bc:b6:ab:c3:68:\n                    38:c5:9a:86:72:b3:28:67:16:6a:33:5c:f6:2b:0b:\n                    d8:57:fe:cd:21\n                ASN1 OID: prime256v1\n                NIST CURVE: P-256\n        X509v3 extensions:\n            X509v3 Key Usage: critical\n                Certificate Sign, CRL Sign\n            X509v3 Basic Constraints: critical\n                CA:TRUE, pathlen:1\n            X509v3 Subject Key Identifier: \n                39:A0:BA:0B:EF:4B:6B:E0:5D:FF:18:82:6A:7B:E0:11:13:CE:B6:EE\n    Signature Algorithm: ecdsa-with-SHA256\n    Signature Value:\n        30:44:02:20:7c:43:31:c2:91:8e:5a:3c:0a:74:87:5f:65:b1:\n        41:62:fc:3e:28:ad:f6:a8:d8:95:e5:2a:8d:82:15:32:f4:85:\n        02:20:15:67:2a:35:d2:18:5b:ec:b7:ae:ee:50:e3:ea:54:72:\n        4a:4a:ad:48:ca:e8:d5:da:2a:fb:63:c8:38:ae:f9:83\n-----BEGIN CERTIFICATE-----\nMIICJjCCAc2gAwIBAgIUDTVeXGOJU+Pkuv45iGRoLroLHjswCgYIKoZIzj0EAwIw\ncDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMQ8wDQYDVQQH\nEwZEdXJoYW0xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh\nLm9yZzEuZXhhbXBsZS5jb20wHhcNMjMxMDI2MDQyNjAwWhcNMzgxMDIyMDQyNjAw\nWjBwMQswCQYDVQQGEwJVUzEXMBUGA1UECBMOTm9ydGggQ2Fyb2xpbmExDzANBgNV\nBAcTBkR1cmhhbTEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMT\nY2Eub3JnMS5leGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABKpn\nqe4/IJL5c9aynKLlgOjweWpwQV+arrypRB5tYa22pRWCJPYvyLy2q8NoOMWahnKz\nKGcWajNc9isL2Ff+zSGjRTBDMA4GA1UdDwEB/wQEAwIBBjASBgNVHRMBAf8ECDAG\nAQH/AgEBMB0GA1UdDgQWBBQ5oLoL70tr4F3/GIJqe+ARE8627jAKBggqhkjOPQQD\nAgNHADBEAiB8QzHCkY5aPAp0h19lsUFi/D4orfao2JXlKo2CFTL0hQIgFWcqNdIY\nW+y3ru5Q4+pUckpKrUjK6NXaKvtjyDiu+YM=\n-----END CERTIFICATE-----\n"
      
         }
    ;
  
      res.setHeader('Content-Type', 'application/x-pem-file');
      res.send(certificate.Response);
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });

    

app.listen(3000, () => {
  console.log('REST Server listening on port 3000');

  
});
