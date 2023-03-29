const {
  fetchReports,
  getProductReports,
} = require("../../../private/services/report.service");
const { jsPDF } = require("jspdf");
const FileSaver = require("file-saver");
const PdfPrinter = require("pdfmake");
const pdfMake = require("pdfmake");
const Invoice = require("../../../private/schemas/Invoice");
const router = require("express").Router();

router.post("", verify, async (req, res, next) => {
  // res.attachment("table.pdf");
  try {
    const shop_id = req.body.shop_id;
    // return res.status(201).json(await fetchReports({ req, res }));
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
        { text: `${new Date()}` },
        { text: "--------------------" },

        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"],
            body: results.map(
              (
                { invoice_number, customer_name, grand_total, createdAt },
                index
              ) => [
                index + 1,
                invoice_number,
                customer_name || "N/A",
                grand_total,
                createdAt,
              ]
            ),
          },
        },
      ],
    };

    const pdfDoc = new PdfPrinter(fonts);
    let pdfFiles = pdfDoc.createPdfKitDocument(docDefinition);
    pdfFiles.pipe(res.attachment("table.pdf"));
    pdfFiles.end();
  } catch (error) {
    next(error);
  }
});

router.post("/products-report", verify, async (req, res, next) => {
  const { shop_id } = req.body;
  try {
    return res.status(200).json(await getProductReports({ shop_id }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
