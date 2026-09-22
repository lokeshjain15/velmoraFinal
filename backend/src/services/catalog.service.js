import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import catalog from "../data/catalog.js";

export async function seedCatalog() {
  const seller = await userModel.findOneAndUpdate(
    { email: "catalog@velmora.local" },
    {
      $setOnInsert: {
        email: "catalog@velmora.local",
        googleId: "velmora-system-catalog",
        fullName: "Velmora Catalog",
        role: "seller",
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  await productModel.bulkWrite(
    catalog.map((product) => ({
      updateOne: {
        filter: { catalogId: product.catalogId },
        update: { $set: { ...product, seller: seller._id } },
        upsert: true,
      },
    })),
  );
}
