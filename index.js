const cors = require("cors");
const express = require("express"),
  app = express(),
  puppeteer = require("puppeteer");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
/* app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
}); */
async function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
app.get("/pdf", async (req, response) => {
  let d = Math.random() * 10;
  let n = Math.floor(d);
  let url = req.query.url;
  const landscape = req.query.landscape;
  const size = req.query.size;
  const mt = req.query.mt;
  const mb = req.query.mb;
  const ml = req.query.ml;
  const mr = req.query.mr;
  let fullFileName = "pdf" + "-" + url + ".pdf";
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const webPage = await browser.newPage();

    await webPage.goto(url, {
      waitUntil: "networkidle0",
    });

    const pdf = await webPage.pdf({
      printBackground: true,
      path: "public/pdfs/" + fullFileName,
      format: size !== undefined ? size : "A4",
      landscape: landscape == "true" ? true : false,
      margin: {
        top: mt !== undefined ? mt : "0px",
        bottom: mb !== undefined ? mb : "0px",
        left: ml !== undefined ? ml : "0px",
        right: mr !== undefined ? mr : "0px",
      },
    });

    await browser.close();

    response.set("Content-Type", "application/json");
    response.json({ pdfurl: "http://localhost:3000/pdfs/" + fullFileName });
  } catch (error) {
    response.status(500).send("Something went Wrong!");
  }
});

var listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
