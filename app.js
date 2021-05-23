const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const barangRouter = require('./routes/barang');
const authRouter = require('./routes/auth');

dotenv.config();

const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(methodOverride('_method'));

app.use('/barang', barangRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT || port, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
})