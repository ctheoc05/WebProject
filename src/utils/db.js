// utils/db.js
import sql from 'mssql';

const config = {
    user: 'atheocharidi',
    password: 'Selenagomez2003!',
    server: '10.103.77.39',
    database: 'Anthia_DB',
  options: {
    trustedconnection: true,
    trustServerCertificate: true,
    encrypt:false,
    sslaccept:{accept_invalid_certs}
  },
};

export async function executeQuery(query) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(query);
    return result.recordsets;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}
