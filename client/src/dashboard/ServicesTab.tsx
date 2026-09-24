import { useState, useMemo } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { Service } from "@/lib/salon-data";
import { RetailProduct } from "@/lib/shop-data";
import { formatCurrency } from "./dashboardUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Scissors,
  ShoppingBag,
  Plus,
  Minus,
  Edit,
  Trash2,
  Sparkles,
  ShieldCheck,
  Droplets,
  Clock,
  Search,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

export default function ServicesTab() {
  const {
    services,
    updateService,
    addService,
    deleteService,
    retailProducts,
    updateRetailProduct,
    updateProductStock,
    addRetailProduct,
    deleteRetailProduct,
  } = useStudio();

  const [activeSubTab, setActiveSubTab] = useState<"services" | "retail">("services");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Edit Service State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [isNewService, setIsNewService] = useState(false);

  // Form Fields: Service
  const [sName, setSName] = useState("");
  const [sCategory, setSCategory] = useState<Service["category"]>("Cut");
  const [sPrice, setSPrice] = useState(95);
  const [sDuration, setSDuration] = useState(60);
  const [sDescription, setSDescription] = useState("");
  const [sChemical, setSChemical] = useState(false);
  const [sDepositPercent, setSDepositPercent] = useState(0);

  // Edit Retail State
  const [editingProduct, setEditingProduct] = useState<RetailProduct | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Form Fields: Retail
  const [pName, setPName] = useState("");
  const [pTag, setPTag] = useState("Care");
  const [pPrice, setPPrice] = useState(38);
  const [pSize, setPSize] = useState("200 ml");
  const [pDetail, setPDetail] = useState("");
  const [pRitual, setPRitual] = useState("");
  const [pStock, setPStock] = useState(12);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (categoryFilter !== "All" && s.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [services, categoryFilter, searchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return retailProducts.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return p.name.toLowerCase().includes(q) || p.detail.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
      }
      return true;
    });
  }, [retailProducts, searchQuery]);

  // Open Edit Service
  const handleOpenEditService = (s: Service) => {
    setEditingService(s);
    setIsNewService(false);
    setSName(s.name);
    setSCategory(s.category);
    setSPrice(s.price);
    setSDuration(s.duration);
    setSDescription(s.description);
    setSChemical(s.chemical);
    setSDepositPercent(s.depositPercent);
    setServiceModalOpen(true);
  };

  // Open New Service
  const handleOpenNewService = () => {
    setEditingService(null);
    setIsNewService(true);
    setSName("");
    setSCategory("Cut");
    setSPrice(90);
    setSDuration(60);
    setSDescription("");
    setSChemical(false);
    setSDepositPercent(0);
    setServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName.trim()) {
      toast.error("Please provide a service title.");
      return;
    }

    if (isNewService) {
      const id = sName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      addService({
        id,
        name: sName.trim(),
        category: sCategory,
        price: Number(sPrice),
        duration: Number(sDuration),
        description: sDescription.trim(),
        chemical: sChemical,
        depositPercent: Number(sDepositPercent),
      });
    } else if (editingService) {
      updateService(editingService.id, {
        name: sName.trim(),
        category: sCategory,
        price: Number(sPrice),
        duration: Number(sDuration),
        description: sDescription.trim(),
        chemical: sChemical,
        depositPercent: Number(sDepositPercent),
      });
    }

    setServiceModalOpen(false);
  };

  // Open Edit Retail
  const handleOpenEditProduct = (p: RetailProduct) => {
    setEditingProduct(p);
    setIsNewProduct(false);
    setPName(p.name);
    setPTag(p.tag);
    setPPrice(p.price);
    setPSize(p.size);
    setPDetail(p.detail);
    setPRitual(p.ritual);
    setPStock((p as any).stock ?? 12);
    setProductModalOpen(true);
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setIsNewProduct(true);
    setPName("");
    setPTag("Care");
    setPPrice(42);
    setPSize("200 ml");
    setPDetail("");
    setPRitual("Daily morning ritual");
    setPStock(12);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) {
      toast.error("Please provide a product title.");
      return;
    }

    if (isNewProduct) {
      const id = pName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      addRetailProduct({
        id,
        name: pName.trim(),
        tag: pTag,
        price: Number(pPrice),
        size: pSize.trim(),
        detail: pDetail.trim(),
        ritual: pRitual.trim(),
        ...( { stock: Number(pStock) } as any),
      });
    } else if (editingProduct) {
      updateRetailProduct(editingProduct.id, {
        name: pName.trim(),
        tag: pTag,
        price: Number(pPrice),
        size: pSize.trim(),
        detail: pDetail.trim(),
        ritual: pRitual.trim(),
        ...( { stock: Number(pStock) } as any),
      });
    }

    setProductModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs: Services vs Retail Shelf */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE7DF] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("services")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === "services"
                ? "bg-[#147A45] text-white shadow-xs"
                : "bg-white border border-[#DDE7DF] text-[#0A1F14] hover:bg-slate-50"
            }`}
          >
            <Scissors size={14} /> Service Menu Catalog ({services.length})
          </button>
          <button
            onClick={() => setActiveSubTab("retail")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === "retail"
                ? "bg-[#147A45] text-white shadow-xs"
                : "bg-white border border-[#DDE7DF] text-[#0A1F14] hover:bg-slate-50"
            }`}
          >
            <ShoppingBag size={14} /> Take-Home Retail Shelf ({retailProducts.length})
          </button>
        </div>

        {activeSubTab === "services" ? (
          <button
            onClick={handleOpenNewService}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#147A45] text-white text-xs font-medium hover:bg-[#0D5932] transition-colors shadow-2xs self-start sm:self-auto"
          >
            <Plus size={14} /> Add Service Item
          </button>
        ) : (
          <button
            onClick={handleOpenNewProduct}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#147A45] text-white text-xs font-medium hover:bg-[#0D5932] transition-colors shadow-2xs self-start sm:self-auto"
          >
            <Plus size={14} /> Add Retail Product
          </button>
        )}
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-3 text-[#66756A]" />
          <input
            type="text"
            placeholder={
              activeSubTab === "services"
                ? "Search services by title or description..."
                : "Search retail items by name or ritual..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DDE7DF] bg-white text-xs text-[#0A1F14] focus:outline-none focus:border-[#147A45]"
          />
        </div>

        {activeSubTab === "services" && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {["All", "Cut", "Color", "Care", "Grooming"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  categoryFilter === cat
                    ? "border-[#147A45] bg-[#147A45] text-white shadow-2xs"
                    : "border-[#DDE7DF] bg-white text-[#0A1F14] hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SERVICES GRID VIEW */}
      {activeSubTab === "services" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="p-5 rounded-2xl border border-[#DDE7DF] bg-white hover:border-[#147A45] transition-all space-y-3.5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#147A45] bg-[#E6EFE9] px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#66756A] font-mono">{service.duration} min</span>
                    <b className="text-base text-[#0A1F14] font-display font-semibold">
                      ${service.price}
                    </b>
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-[#0A1F14] mt-1">
                  {service.name}
                </h3>
                <p className="text-xs text-[#4E5B51] mt-1 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {service.chemical && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      <Sparkles size={11} /> Chemical Consult Gate
                    </span>
                  )}
                  {service.depositPercent > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {service.depositPercent}% Deposit Req.
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#DDE7DF]/70 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#66756A] font-mono">
                  id: {service.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditService(service)}
                    className="p-1.5 rounded-lg border border-[#DDE7DF] text-slate-700 hover:bg-slate-50 transition-colors"
                    title="Edit Service"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${service.name} from catalog?`)) {
                        deleteService(service.id);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* RETAIL SHELF GRID VIEW */}
      {activeSubTab === "retail" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const stock = (p as any).stock ?? 12;
            const isLowStock = stock <= 3;

            return (
              <article
                key={p.id}
                className="p-5 rounded-2xl border border-[#DDE7DF] bg-white hover:border-[#147A45] transition-all space-y-3.5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase">
                      {p.tag}
                    </span>
                    <b className="text-base text-[#0A1F14] font-display font-semibold">${p.price}</b>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#0A1F14] mt-1">{p.name}</h3>
                  <p className="text-xs text-[#4E5B51] mt-1 leading-relaxed">{p.detail}</p>
                  <span className="text-[11px] text-[#66756A] block mt-1">
                    Size: {p.size} · Ritual: {p.ritual}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#DDE7DF]/70 space-y-3">
                  {/* Stock Stepper */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#4E5B51] flex items-center gap-1 font-medium">
                      Shelf Inventory:
                      {isLowStock && (
                        <span className="text-rose-600 font-bold flex items-center gap-0.5 text-[10px]">
                          <AlertTriangle size={11} /> Low Stock
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateProductStock(p.id, -1)}
                        className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                        title="Decrease stock"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-bold font-mono text-xs">{stock}</span>
                      <button
                        onClick={() => updateProductStock(p.id, 1)}
                        className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                        title="Increase stock"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-[#66756A] font-mono">id: {p.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 rounded-lg border border-[#DDE7DF] text-slate-700 hover:bg-slate-50 transition-colors"
                        title="Edit Details"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${p.name} from shelf?`)) {
                            deleteRetailProduct(p.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* EDIT / CREATE SERVICE MODAL */}
      <Dialog open={serviceModalOpen} onOpenChange={setServiceModalOpen}>
        <DialogContent className="max-w-md p-0 rounded-2xl bg-white border border-[#DDE7DF] overflow-hidden">
          <DialogHeader className="p-5 pb-3 border-b border-[#DDE7DF] bg-[#F5F8F4]">
            <DialogTitle className="font-display text-lg text-[#0A1F14]">
              {isNewService ? "Create New Service Menu Item" : `Edit Service: ${editingService?.name}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4E5B51]">
              Changes apply instantly to the public booking calendar and services menu.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveService} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Service Title
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Dimensional Gloss Refresh"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Category
                </label>
                <select
                  value={sCategory}
                  onChange={(e) => setSCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                >
                  <option value="Cut">Cut</option>
                  <option value="Color">Color</option>
                  <option value="Care">Care</option>
                  <option value="Grooming">Grooming</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Price ($)
                </label>
                <input
                  type="number"
                  min={10}
                  max={900}
                  value={sPrice}
                  onChange={(e) => setSPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  step={15}
                  min={15}
                  max={360}
                  value={sDuration}
                  onChange={(e) => setSDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Deposit (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={sDepositPercent}
                  onChange={(e) => setSDepositPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Editorial service notes, routine fit, and finish..."
                value={sDescription}
                onChange={(e) => setSDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
              <div>
                <b className="text-slate-900 block text-xs">Chemical Consultation Required</b>
                <span className="text-[11px] text-slate-500">Requires 15m consultation for first-time clients.</span>
              </div>
              <input
                type="checkbox"
                checked={sChemical}
                onChange={(e) => setSChemical(e.target.checked)}
                className="w-4 h-4 text-[#147A45]"
              />
            </label>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setServiceModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#147A45] text-white font-medium hover:bg-[#0D5932]"
              >
                Save Service
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT / CREATE PRODUCT MODAL */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="max-w-md p-0 rounded-2xl bg-white border border-[#DDE7DF] overflow-hidden">
          <DialogHeader className="p-5 pb-3 border-b border-[#DDE7DF] bg-[#F5F8F4]">
            <DialogTitle className="font-display text-lg text-[#0A1F14]">
              {isNewProduct ? "Add Product to Retail Shelf" : `Edit Product: ${editingProduct?.name}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4E5B51]">
              Manage retail inventory for desk sales and storefront bag checkout.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Product Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Mineral Moisture Balm"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Category / Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Finish, Texture, Scalp"
                  value={pTag}
                  onChange={(e) => setPTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={pPrice}
                  onChange={(e) => setPPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Bottle / Jar Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. 150 ml"
                  value={pSize}
                  onChange={(e) => setPSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  value={pStock}
                  onChange={(e) => setPStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Product Benefit Detail
              </label>
              <textarea
                rows={2}
                placeholder="Hydrating leave-in cream for dry ends..."
                value={pDetail}
                onChange={(e) => setPDetail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Recommended Ritual
              </label>
              <input
                type="text"
                placeholder="e.g. Post-wash damp hair application"
                value={pRitual}
                onChange={(e) => setPRitual(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#147A45] text-white font-medium hover:bg-[#0D5932]"
              >
                Save Product
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
