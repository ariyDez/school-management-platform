// backend/src/modules/certificates/certificates-repository.js
/**
 * Creates a record of an issued certificate in the database within a transaction.
 * @param {object} certRecord - The certificate record to save.
 * @param {object} client - The database client from the connection pool.
 */
async function createCertificateRecord(certRecord, client) {
  const { student_id, token_id, ipfs_uri, transaction_hash } = certRecord;

  const query = {
    text: `
      INSERT INTO certificates (student_id, token_id, ipfs_uri, transaction_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    values: [student_id, token_id, ipfs_uri, transaction_hash],
  };

  const result = await client.query(query);
  console.log(`Certificate record created in DB with ID: ${result.rows[0].id}`);
  return result.rows[0];
}

module.exports = { createCertificateRecord };