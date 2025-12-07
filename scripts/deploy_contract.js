// scripts/deploy_contract.js

require("dotenv").config({ path: "../.env" });
const fs = require("fs");
const { rpc, wallet, sc, tx, u } = require("@cityofzion/neon-js");

async function main() {
  const rpcUrl = process.env.NEO_RPC_URL;
  const wif = process.env.NEO_WIF;

  if (!rpcUrl || !wif) {
    throw new Error("NEO_RPC_URL and NEO_WIF must be set in .env");
  }

  console.log("RPC URL:", rpcUrl);
  console.log("Using WIF prefix:", wif.slice(0, 6) + "…");

  const client = new rpc.RPCClient(rpcUrl);

  // 1) Load deployer account
  const account = new wallet.Account(wif);
  console.log("Using address:", account.address);

  // 2) Read NEF + manifest from ./scripts
  const nefBuffer = fs.readFileSync("PredictionRegistry.nef"); // binary
  const manifestJson = fs.readFileSync(
    "PredictionRegistry.manifest.json",
    "utf8",
  );

  const nefHeaderHex = nefBuffer.subarray(0, 16).toString("hex");
  console.log("NEF header (first 16 bytes, hex):", nefHeaderHex); // "4e454633..." -> "NEF3"

  // Convert NEF bytes -> hex string
  const nefHex = nefBuffer.toString("hex");

  // Native ContractManagement script hash (N3 mainnet/testnet)
  const contractManagementHash =
    "0xfffdc93764dbaddd97c48f252a53ea4643faa3fd";

  // 3) Build deploy script: ContractManagement.deploy(nef, manifest, data)
  const deployScript = sc.createScript({
    scriptHash: contractManagementHash,
    operation: "deploy",
    args: [
      sc.ContractParam.byteArray(nefHex, "hex"), // NEF
      sc.ContractParam.string(manifestJson),     // manifest JSON
      sc.ContractParam.any(null),               // data -> _deploy, unused
    ],
  });

  // 4) Build transaction with manual fees
  const currentHeight = await client.getBlockCount();
  const version = await client.getVersion();
  const networkMagic = version.protocol.network;

  let transaction = new tx.Transaction({
    sender: account.scriptHash,
    signers: [
      {
        account: account.scriptHash,
        scopes: tx.WitnessScope.CalledByEntry,
      },
    ],
    validUntilBlock: currentHeight + 1000,
    // 🔴 BUMP FEES HERE
    systemFee: u.BigInteger.fromNumber(200_000_000), // 15 GAS
    networkFee: u.BigInteger.fromNumber(10_000_000),   // 0.1 GAS
    script: deployScript,
  });

  console.log(
    "Using systemFee:",
    transaction.systemFee.toString(),
    "networkFee:",
    transaction.networkFee.toString(),
  );

  // 5) Sign transaction
  const signed = transaction.sign(account, networkMagic);

  // 6) Serialize and send
  const rawTxHex = signed.serialize(true); // hex string
  console.log("Serialized tx length:", rawTxHex.length);

  const rawTxHexString = u.HexString.fromHex(rawTxHex);

  console.log("Sending tx...");
  const sendResult = await client.sendRawTransaction(rawTxHexString);

  console.log("sendRawTransaction result:", sendResult);

  if (sendResult) {
    const hashValue =
      typeof signed.hash === "function" ? signed.hash() : signed.hash;
    console.log("✅ Deployment transaction sent!");
    console.log("Tx hash:", hashValue);
    console.log(
      "Open in Dora (TestNet): https://dora.coz.io/transaction/neo3/testnet/" +
        hashValue,
    );
  } else {
    console.error("❌ Failed to send deployment transaction.");
  }
}

main().catch((err) => {
  console.error("Error deploying contract:", err);
});
