export async function deleteAllDataBalanceSfa(tableName, pool) {
  try {
    const request = pool.request();
    const result = await request.query(`DELETE FROM ${tableName}`);
    console.log(`Deleted ${result.rowsAffected} rows from ${tableName}`);
  } catch (error) {
    console.error(`Error deleting data: ${error.message}`);
    throw error;
  }
}
