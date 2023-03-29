const Product = require("../schemas/Product");
const { uploadFile } = require("./Firebase/imageUpload.service");

async function addProduct({ req }) {
  try {
    const image_url = await uploadFile(
      req.file,
      `product/${req.body.store_id}`
    );

    const result = await Product.create({
      ...req.body,
      image: image_url,
    });

    if (result) {
      return { message: "success", data: result };
    }

    return { message: "failed to add product, please try again" };
  } catch (error) {
    return { message: "an error occurred, please try again", error };
  }
}

async function updateProduct({ req }) {
  // try {
  //   const image_url = await uploadFile(
  //     req.file,
  //     `product/${req.body.product_id}`
  //   );

  //   const id = req.body._id;
  //   result = await Product.updateOne(
  //     {
  //       _id: req.body._id,
  //     },
  //     {
  //       ...req.body,
  //       image: image_url,
  //     },
  //     req.body
  //   );

  //   if (result) {
  //     return { message: "success", data: result };
  //   }

  //   return { message: "failed to edit product, please try again" };
  // } catch (error) {
  //   return { message: "an error occurred, please try again", error };
  // }

  try {
    let image_url, result;

    if (req.file) {
      image_url = await uploadFile(req.file, `product/${req.body._id}`);

      result = await Product.updateOne(
        {
          _id: req.body._id,
        },
        {
          ...req.body,
          image: image_url,
        }
      );
    } else {
      result = await Product.updateOne(
        {
          _id: req.body._id,
        },
        {
          ...req.body,
        }
      );
    }

    if (result.matchedCount > 0) {
      return { message: "success" };
    }
    return { message: "failed to update drug" };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

async function deleteProduct({ req }) {
  try {
    result = await Product.findByIdAndRemove({
      _id: req.body._id,
    });

    if (result) {
      return { message: "success", data: result };
    }

    return { message: "failed to delete product, please try again" };
  } catch (error) {
    return { message: "an error occurred, please try again", error };
  }
}

async function fetchProducts({ req }) {
  const { store_id } = req.body;
  try {
    const result = await Product.find({ store_id }).sort({ createdAt: -1 });
    return { message: "success", data: result };
  } catch (error) {
    return { message: "an error occurred, please try again" };
  }
}

module.exports = { addProduct, updateProduct, deleteProduct, fetchProducts };
