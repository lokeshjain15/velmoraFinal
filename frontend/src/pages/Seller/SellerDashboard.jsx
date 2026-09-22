import { useEffect, useState } from "react";
import {
  api,
  createProduct,
  getApiError,
} from "../../features/auth/services/auth.api";

const emptyForm = {
  title: "",
  description: "",
  amount: "",
  stock: "",
  category: "decor",
  material: "",
};

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      const { data } = await api.get("/products/seller");
      setProducts(data.products || []);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImages([]);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const body = new FormData();
      body.append("title", form.title);
      body.append("description", form.description);
      body.append(
        "price",
        JSON.stringify({ amount: Number(form.amount), currency: "INR" }),
      );
      body.append("stock", form.stock);
      body.append("category", form.category);
      body.append("material", form.material);
      for (const image of images) body.append("images", image);

      if (editingId) {
        await api.patch(`/products/${editingId}`, body);
        setMessage("Product updated successfully.");
      } else {
        await createProduct(body);
        setMessage("Product listed successfully.");
      }
      resetForm();
      await loadProducts();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save product."));
    } finally {
      setSaving(false);
    }
  };

  const edit = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      description: product.description,
      amount: product.price?.amount || "",
      stock: product.stock ?? "",
      category: product.category || "decor",
      material: product.material || "",
    });
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete ${product.title}?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((current) =>
        current.filter((item) => item._id !== product._id),
      );
      setMessage("Product deleted.");
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete product."));
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7ef] px-5 py-14 text-[#332b24] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9b8772]">
            Seller workspace
          </p>
          <h1 className="mt-3 font-serif text-5xl">Product Dashboard</h1>
        </div>

        <form
          onSubmit={submit}
          className="mt-10 grid gap-5 border border-[#ded5c9] bg-[#fffdf9] p-6 sm:grid-cols-2 sm:p-8"
        >
          <div className="sm:col-span-2">
            <h2 className="font-serif text-3xl">
              {editingId ? "Edit product" : "List a product"}
            </h2>
          </div>
          {error && (
            <p className="border border-red-300 bg-red-50 p-3 text-red-700 sm:col-span-2">
              {error}
            </p>
          )}
          {message && (
            <p className="border border-green-300 bg-green-50 p-3 text-green-700 sm:col-span-2">
              {message}
            </p>
          )}
          <SellerField
            label="Title"
            name="title"
            value={form.title}
            onChange={onChange}
            required
          />
          <SellerField
            label="Material"
            name="material"
            value={form.material}
            onChange={onChange}
            placeholder="Wood, ceramic, linen..."
          />
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              required
              minLength={10}
              rows={4}
              className="w-full border border-[#d9cfc2] bg-[#faf7ef] p-3"
            />
          </div>
          <SellerField
            label="Price (USD)"
            name="amount"
            type="number"
            min="1"
            value={form.amount}
            onChange={onChange}
            required
          />
          <SellerField
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={onChange}
            required
          />
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="h-12 w-full border border-[#d9cfc2] bg-[#faf7ef] px-3"
            >
              <option value="furniture">Furniture</option>
              <option value="lighting">Lighting</option>
              <option value="decor">Decor</option>
              <option value="textiles">Textiles</option>
              <option value="rugs">Rugs</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest">
              Images (up to 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages([...e.target.files].slice(0, 5))}
              className="w-full text-sm"
            />
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <button
              disabled={saving}
              className="bg-[#332b24] px-7 py-3 text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update product"
                  : "List product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-[#bcae9d] px-7 py-3"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="mt-12">
          <h2 className="font-serif text-3xl">
            My products ({products.length})
          </h2>
          {loading ? (
            <p className="mt-5">Loading...</p>
          ) : products.length === 0 ? (
            <p className="mt-5 text-[#766b60]">No products listed yet.</p>
          ) : (
            <div className="mt-6 overflow-x-auto border border-[#ded5c9] bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#f3eee6] uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t border-[#eee3d6]">
                      <td className="p-4 font-medium">{product.title}</td>
                      <td className="p-4">
                        ₹
                        {Number(product.price?.amount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4 capitalize">
                        {product.category || "—"}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => edit(product)}
                          className="mr-4 font-semibold text-[#715f4e]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(product)}
                          className="font-semibold text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SellerField({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest">
        {label}
      </label>
      <input
        {...props}
        className="h-12 w-full border border-[#d9cfc2] bg-[#faf7ef] px-3"
      />
    </div>
  );
}
