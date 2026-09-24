import { useState, useMemo } from "react";
import { useStudio } from "@/contexts/StudioStore";
import { SalonClient } from "@/lib/defaultStudioData";
import { formatCurrency } from "./dashboardUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  AlertTriangle,
  History,
  Edit,
  DollarSign,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export default function ClientsTab() {
  const { clients, addClient, updateClient, addClientFormula } = useStudio();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<SalonClient | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // New Client Modal state
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [nName, setNName] = useState("");
  const [nEmail, setNEmail] = useState("");
  const [nPhone, setNPhone] = useState("");
  const [nHairProfile, setNHairProfile] = useState("");
  const [nSensitivities, setNSensitivities] = useState("");
  const [nPreferredStylist, setNPreferredStylist] = useState("mara");

  // New Formula entry state
  const [showFormulaInput, setShowFormulaInput] = useState(false);
  const [formulaText, setFormulaText] = useState("");
  const [formulaStylist, setFormulaStylist] = useState("Mara Chen");

  // Filtered Clients
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.hairProfile.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  const handleOpenClient = (client: SalonClient) => {
    setSelectedClient(client);
    setShowFormulaInput(false);
    setFormulaText("");
    setDetailModalOpen(true);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nName.trim()) {
      toast.error("Please enter a client name.");
      return;
    }

    const created = addClient({
      name: nName.trim(),
      email: nEmail.trim() || `${nName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: nPhone.trim() || "(206) 555-0100",
      accent: "#d8e1ff",
      preferredStylistId: nPreferredStylist,
      hairProfile: nHairProfile.trim() || "Consultation intake",
      sensitivities: nSensitivities.trim() || undefined,
    });

    setNewClientModalOpen(false);
    setNName("");
    setNEmail("");
    setNPhone("");
    setNHairProfile("");
    setNSensitivities("");
  };

  const handleAddFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !formulaText.trim()) return;

    addClientFormula(selectedClient.id, formulaText.trim(), formulaStylist);
    setShowFormulaInput(false);
    setFormulaText("");

    // Refresh selected client view
    setSelectedClient((prev) =>
      prev
        ? {
            ...prev,
            formulas: [
              { date: new Date().toISOString().slice(0, 10), formula: formulaText.trim(), stylist: formulaStylist },
              ...prev.formulas,
            ],
          }
        : null
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Search & New Client */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-b border-[#DDE7DF] pb-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-3 text-[#66756A]" />
          <input
            type="text"
            placeholder="Search clientele by name, email, phone, or hair profile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DDE7DF] bg-white text-xs text-[#0A1F14] focus:outline-none focus:border-[#147A45]"
          />
        </div>

        <button
          onClick={() => setNewClientModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#147A45] text-white text-xs font-medium hover:bg-[#0D5932] transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus size={14} /> Add Client Profile
        </button>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <article
            key={client.id}
            onClick={() => handleOpenClient(client)}
            className="p-5 rounded-2xl border border-[#DDE7DF] bg-white hover:border-[#147A45] hover:shadow-xs transition-all cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-slate-900 shadow-2xs"
                    style={{ backgroundColor: client.accent }}
                  >
                    {client.initials}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0A1F14]">
                      {client.name}
                    </h3>
                    <p className="text-[11px] text-[#66756A]">{client.phone}</p>
                  </div>
                </div>

                {client.membershipPlan ? (
                  <span className="text-[10px] font-bold text-[#147A45] bg-[#E6EFE9] border border-[#C5D9CB] px-2 py-0.5 rounded-full uppercase">
                    {client.membershipPlan}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#66756A] bg-slate-100 px-2 py-0.5 rounded font-mono">
                    {client.totalVisits} visits
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5F8F4] border border-[#DDE7DF]/80 text-xs text-[#4E5B51] line-clamp-2 leading-relaxed">
                <b>Hair:</b> {client.hairProfile}
              </div>

              {client.sensitivities && (
                <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5">
                  <AlertTriangle size={12} className="shrink-0" />
                  <span className="truncate">{client.sensitivities}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#DDE7DF]/70 flex items-center justify-between text-xs text-[#66756A]">
              <span>Lifetime: <b>{formatCurrency(client.totalSpend)}</b></span>
              <span className="text-[#147A45] font-semibold flex items-center gap-1 hover:underline">
                Formulas ({client.formulas.length}) <ChevronRight size={12} />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Client Detail & Formula History Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-white border border-[#DDE7DF]">
          {selectedClient && (
            <>
              <div className="p-6 border-b border-[#DDE7DF] bg-[#F5F8F4] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-slate-900 shadow-xs"
                    style={{ backgroundColor: selectedClient.accent }}
                  >
                    {selectedClient.initials}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-display text-[#0A1F14]">
                      {selectedClient.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#4E5B51] mt-0.5">
                      {selectedClient.email} · {selectedClient.phone}
                    </DialogDescription>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#66756A] uppercase font-bold block">Lifetime Spend</span>
                  <b className="text-base text-[#147A45] font-display">{formatCurrency(selectedClient.totalSpend)}</b>
                </div>
              </div>

              <div className="p-6 space-y-5 text-xs">
                {/* Hair Profile Card */}
                <div className="p-4 rounded-xl border border-[#DDE7DF] bg-[#F5F8F4] space-y-2">
                  <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                    Hair Diagnostic Profile
                  </h4>
                  <p className="text-xs text-[#0A1F14] leading-relaxed">{selectedClient.hairProfile}</p>
                  {selectedClient.sensitivities && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2">
                      <AlertTriangle size={13} className="text-amber-700" />
                      <span><b>Sensitivities:</b> {selectedClient.sensitivities}</span>
                    </div>
                  )}
                  {selectedClient.internalNotes && (
                    <p className="text-slate-500 italic text-[11px]">
                      <b>Chair preferences:</b> {selectedClient.internalNotes}
                    </p>
                  )}
                </div>

                {/* Color Formula Ledger */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DDE7DF] pb-2">
                    <div className="flex items-center gap-2">
                      <History size={15} className="text-[#147A45]" />
                      <h4 className="font-display font-semibold text-sm text-[#0A1F14]">
                        Technical Color Formula Ledger
                      </h4>
                    </div>
                    {!showFormulaInput && (
                      <button
                        onClick={() => setShowFormulaInput(true)}
                        className="text-xs text-[#147A45] font-semibold hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Log Formula
                      </button>
                    )}
                  </div>

                  {showFormulaInput && (
                    <form onSubmit={handleAddFormula} className="p-4 rounded-xl border border-[#147A45] bg-[#E6EFE9]/40 space-y-3">
                      <span className="font-semibold text-[#0A1F14] text-xs block">Log New Formula</span>
                      <textarea
                        required
                        rows={2}
                        placeholder="e.g. Root: 6N + 20vol. Tone: 9V Shades EQ 15m..."
                        value={formulaText}
                        onChange={(e) => setFormulaText(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#C5D9CB] bg-white text-xs text-[#0A1F14]"
                      />
                      <div className="flex items-center justify-between">
                        <select
                          value={formulaStylist}
                          onChange={(e) => setFormulaStylist(e.target.value)}
                          className="p-1.5 rounded-lg border border-[#C5D9CB] bg-white text-xs text-[#0A1F14]"
                        >
                          <option value="Mara Chen">Mara Chen</option>
                          <option value="Noa Williams">Noa Williams</option>
                          <option value="Sofia Reyes">Sofia Reyes</option>
                          <option value="Eli Brooks">Eli Brooks</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowFormulaInput(false)}
                            className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3.5 py-1 rounded-lg bg-[#147A45] text-white font-medium hover:bg-[#0D5932]"
                          >
                            Save Formula
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {selectedClient.formulas.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedClient.formulas.map((f, i) => (
                        <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <b>{f.date}</b>
                            <span>Specialist: <b>{f.stylist}</b></span>
                          </div>
                          <p className="font-mono text-xs text-slate-800 leading-relaxed font-semibold">
                            {f.formula}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-3 text-center">
                      No past color formulas logged for this client.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create New Client Modal */}
      <Dialog open={newClientModalOpen} onOpenChange={setNewClientModalOpen}>
        <DialogContent className="max-w-md p-0 rounded-2xl bg-white border border-[#DDE7DF] overflow-hidden">
          <DialogHeader className="p-5 pb-3 border-b border-[#DDE7DF] bg-[#F5F8F4]">
            <DialogTitle className="font-display text-lg text-[#0A1F14]">
              New Client Profile Intake
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4E5B51]">
              Record client hair texture, sensitivities, and preferred chair specialist.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Siobhan Roy"
                value={nName}
                onChange={(e) => setNName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="siobhan@example.com"
                  value={nEmail}
                  onChange={(e) => setNEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="(206) 555-0182"
                  value={nPhone}
                  onChange={(e) => setNPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Hair Diagnostic & Texture
              </label>
              <input
                type="text"
                placeholder="e.g. Straight medium bob, level 7 blonde, natural wave..."
                value={nHairProfile}
                onChange={(e) => setNHairProfile(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                Sensitivities / Scalp Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Sulfate sensitivity, cool water only..."
                value={nSensitivities}
                onChange={(e) => setNSensitivities(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs mt-1"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewClientModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#147A45] text-white font-medium hover:bg-[#0D5932]"
              >
                Create Profile
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
