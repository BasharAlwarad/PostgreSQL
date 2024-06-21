import sql from '../../DB/db.js'


export const login = async (req, res) => {
    try {
      const users = await sql`select * from users`;
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }