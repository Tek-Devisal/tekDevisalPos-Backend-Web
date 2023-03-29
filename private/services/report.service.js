const PdfPrinter = require("pdfmake");
const pdfMake = require("pdfmake");
const fs = require("fs");
const Invoice = require("../schemas/Invoice");
const { jsPDF } = require("jspdf");
const FileSaver = require("file-saver");
const pdf = require("html-pdf");
const pdfTemplate = require("../docs/index");

async function fetchReports({ req, res }) {
  const { shop_id } = req.body;
  const results = await Invoice.find({ shop_id });

  let pdfFile = null;
  const fonts = {
    Roboto: {
      normal: "fonts/Poppins-Regular.ttf",
      bold: "fonts/Poppins-Bold.ttf",
    },
  };
  // return { message: "success", data: results };

  const docDefinition = {
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
    content: [
      { text: "Tables", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*", "*"],
          body: [
            ["#", "INVOICE NO.", "NAME", "TOTAL", "DATE"],
            ["Row 1", "Row 1", "Row 1", "Row 1", "Row 1"],
            ["Row 2", "Row 2", "Row 2", "Row 2", "Row 2"],
          ],
        },
      },
    ],
  };

  const pdfDoc = new PdfPrinter(fonts);
  let pdfFiles = pdfDoc.createPdfKitDocument(docDefinition);
  pdfFiles.pipe(res.attachment("table.pdf"));
  pdfFiles.end();

  // const blob = new Blob(["Hello, world!"], {
  //   type: "text/plain;charset=utf-8",
  // });
  // FileSaver.saveAs(blob, "hello world.txt");

  return { message: "success", data: pdfFiles };
}

async function getProductReports({ shop_id }) {
  const result = await Invoice.find({ shop_id }, { products_summary: 1 }).sort({
    createdAt: -1,
  });
  let products = [];
  let data = {};

  const newData = result.map(({ products_summary }) =>
    products_summary.map(({ name, quantity, selling_price, image }) => ({
      name,
      quantity,
      selling_price,
      image,
    }))
  );

  const groupedData = newData
    .flat()
    .reduce((acc, { name, quantity, selling_price, image }) => {
      data[name] = data[name] || { quantity: 0, totalValue: 0 };
      data[name].quantity += quantity;
      data[name].selling_price = selling_price;
      data[name].image = image;
      data[name].name = name;
      data[name].totalValue += quantity * selling_price;
      return acc;
    }, {});

  const results = Object.values(data);

  return { message: "success", data: results };
}

module.exports = { fetchReports, getProductReports };

// async function fetchReports({ req, res }) {
//   pdf.create(pdfTemplate(req.body), {}).toFile("result.pdf", (err) => {
//     if (err) {
//       res.send(Promise.reject());
//     }

//     res.send(Promise.resolve());
//   });
// }

// module.exports = { fetchReports };
