import pgPromise from "pg-promise";

const pgp = pgPromise();
const db = pgp("postgresql://dba:dba@paybank-db:5432/UserDB");

export const obterCodigo2FA = async () => {
  const query = `
    SELECT code
	    FROM public."TwoFactorCode"
	    ORDER BY id DESC
	    LIMIT 1
  `;

  const result = await db.oneOrNone(query);

  return result.code;
};
