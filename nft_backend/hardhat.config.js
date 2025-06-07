require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Memuat variabel dari file .env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL || "", // Mengambil URL dari .env
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [], // Mengambil private key dari .env
    },
  },
};