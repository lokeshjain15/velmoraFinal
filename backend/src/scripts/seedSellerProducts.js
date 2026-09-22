import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/database.js";
import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import catalog from "../data/catalog.js";

async function main() {
  console.log("\n========================================================");
  console.log(" 🏺 Velmora — Direct Seller Product Seeder");
  console.log("========================================================\n");

  try {
    await connectDB();

    const args = process.argv.slice(2);
    const emailArg = args.find((arg) => !arg.startsWith("--") && isNaN(Number(arg)));
    const countArg = args.find((arg) => !isNaN(Number(arg)));
    const count = countArg ? Math.min(Math.max(1, parseInt(countArg)), catalog.length) : 15;

    let targetSeller = null;

    if (emailArg) {
      targetSeller = await userModel.findOne({
        email: new RegExp(`^${emailArg.trim()}$`, "i"),
      });

      if (!targetSeller) {
        console.error(`❌ Error: No user found with email "${emailArg}".`);
        const allUsers = await userModel.find({}).select("email role fullName").limit(10);
        console.log("\nExisting users in database:");
        allUsers.forEach((u) => console.log(` - ${u.email} [role: ${u.role}] (${u.fullName || "No name"})`));
        console.log("\nUsage: node src/scripts/seedSellerProducts.js <user-email> [count]");
        process.exit(1);
      }

      // Ensure user has seller role so they can see/manage products
      if (targetSeller.role !== "seller") {
        targetSeller.role = "seller";
        await targetSeller.save();
        console.log(`ℹ️ Updated user "${targetSeller.email}" role to "seller".`);
      }
    } else {
      // Find the most recent non-catalog seller
      targetSeller = await userModel.findOne({
        role: "seller",
        email: { $ne: "catalog@velmora.local" },
      }).sort({ createdAt: -1 });

      if (!targetSeller) {
        // Look for any registered user
        const anyUser = await userModel.findOne({
          email: { $ne: "catalog@velmora.local" },
        }).sort({ createdAt: -1 });

        if (anyUser) {
          anyUser.role = "seller";
          await anyUser.save();
          targetSeller = anyUser;
          console.log(`ℹ️ Auto-selected user "${targetSeller.email}" and promoted to "seller".`);
        } else {
          // Create default demo seller
          targetSeller = await userModel.create({
            email: "seller@velmora.com",
            fullName: "Velmora Demo Seller",
            role: "seller",
          });
          console.log(`ℹ️ Created demo seller account: seller@velmora.com`);
        }
      }
    }

    console.log(`👤 Target Seller : ${targetSeller.email} (${targetSeller.fullName || "Seller"})`);
    console.log(`📦 Products Count : ${count} items from catalog`);
    console.log("--------------------------------------------------------");

    const selectedCatalog = catalog.slice(0, count);

    const operations = selectedCatalog.map((product) => {
      // Omit catalogId so there are no duplicate key conflicts with global catalog
      const { catalogId, ...productData } = product;

      return {
        updateOne: {
          filter: {
            title: product.title,
            seller: targetSeller._id,
          },
          update: {
            $set: {
              ...productData,
              seller: targetSeller._id,
            },
          },
          upsert: true,
        },
      };
    });

    const result = await productModel.bulkWrite(operations);

    console.log(`✅ Success! Seeded products into MongoDB:`);
    console.log(`   - Inserted / Upserted: ${result.upsertedCount + result.modifiedCount} items`);
    console.log(`   - Matched existing   : ${result.matchedCount} items`);
    console.log("--------------------------------------------------------");

    selectedCatalog.forEach((p, idx) => {
      console.log(` [${idx + 1}] ${p.title} | ${p.categoryLabel} | ₹${p.price.amount} | Image: ${p.images[0].url}`);
    });

    console.log("\n========================================================");
    console.log(`🎉 Done! All ${count} products are ready for ${targetSeller.email}.`);
    console.log(`👉 Open http://localhost:5173/seller to view them in your dashboard!`);
    console.log("========================================================\n");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
