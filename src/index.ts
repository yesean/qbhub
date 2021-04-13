import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('lets fucking go');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
