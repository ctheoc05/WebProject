import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { username, password } = req.body;

  try {
    const user = await prisma.Users.findUnique({
      where: {
        Username:Users.Username,
        Password:Users.Password
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username " });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Login successful, return a token or session ID
    return res.json({ token: "some-token" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error logging in" });
  }
}