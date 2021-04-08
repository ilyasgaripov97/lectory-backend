const express = require('express');
const app = express();
const cors = require('cors');

// temporary
const pool = require('./db/db').pool;

const authRoutes = require('./api/auth/routes');
const homepageRoutes = require('./api/homepage/routes')

const PORT = 8000;
const TOKEN_SECRET = 'e4193e393dd4735fa17c18de1c5069b82ec7593541f53cb4e08122d95a8d6f68dc607c54dc44834b78a5a1057fca384c1837a8c392e4c1a'


// Middlewares
app.use(cors())
app.use(express.urlencoded())
app.use(express.json())
app.use(authRoutes)
app.use(homepageRoutes)

// Routes


app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});