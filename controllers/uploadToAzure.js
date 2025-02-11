// uploadToAzure.js
const { BlobServiceClient } = require('@azure/storage-blob')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
)
const containerClient =
  blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME)

const uploadToAzure = async (file) => {
  const blobName = `${uuidv4()}-${file.originalname}`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype }
  })

  return blockBlobClient.url
}

module.exports = { uploadToAzure }
