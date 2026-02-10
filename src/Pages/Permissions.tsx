import React, { useState, useEffect } from "react";
import { CheckCircle2, ChevronDown, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface RoleData { _id: string; role_name: string; }
interface PermissionRow { moduleId: string; moduleName: string; view: boolean; create: boolean; edit: boolean; delete: boolean; }

const ERP_MODULES = [
  { id: "m1", name: "User Management" }, { id: "m2", name: "Human Resource" },
  { id: "m3", name: "Sales & Marketing" }, { id: "m4", name: "Inventory & Stock" },
  { id: "m5", name: "Finance & Accounts" }, { id: "m6", name: "Purchase Management" },
  { id: "m7", name: "Client Management" },
];

const PermissionManager = () => {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPermissions(ERP_MODULES.map(mod => ({ moduleId: mod.id, moduleName: mod.name, view: false, create: false, edit: false, delete: false })));
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedAuth = localStorage.getItem("userInfo");
      const userInfo = storedAuth ? JSON.parse(storedAuth) : null;
      const token = userInfo?.token;

      if (!token) {
        setError("Session expired. Please login again.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/roles/get", {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setRoles(result.data);
        if (result.data.length > 0) setSelectedRoleId(result.data[0]._id);
      } else {
        setError(result.message || "Failed to load roles.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (moduleId: string, field: keyof Omit<PermissionRow, "moduleId" | "moduleName">) => {
    setPermissions(prev => prev.map(row => row.moduleId === moduleId ? { ...row, [field]: !row[field] } : row));
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    try {
      setSaving(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;

      const response = await fetch("http://localhost:3000/api/permissions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ roleId: selectedRoleId, access: permissions }),
      });

      const result = await response.json();
      if (result.success) alert("Permissions saved!");
      else alert(result.message || "Save failed.");
    } catch (error) {
      alert("Error saving permissions.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border overflow-hidden">
        <div className="p-8 border-b flex justify-between items-center bg-white">
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <ShieldCheck className="text-indigo-600 w-9 h-9" /> Role Access
          </h2>
          <div className="relative min-w-[280px]">
            <select value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)} className="w-full border-2 rounded-2xl px-6 py-4 bg-slate-50 font-bold outline-none focus:border-indigo-500 appearance-none">
              {roles.length > 0 ? roles.map(r => <option key={r._id} value={r._id}>{r.role_name}</option>) : <option>No roles found</option>}
            </select>
            <ChevronDown className="absolute right-5 top-5 w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 text-indigo-600"><Loader2 className="animate-spin w-12 h-12 mb-4" /><p className="font-bold">Loading roles...</p></div>
          ) : error ? (
            <div className="flex flex-col items-center py-20 text-red-500 font-bold"><AlertCircle className="w-12 h-12 mb-4" />{error}</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                  <th className="px-10 py-6">Module Name</th>
                  {["View", "Create", "Edit", "Delete"].map(h => <th key={h} className="px-6 py-6 text-center">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissions.map(row => (
                  <tr key={row.moduleId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6 font-bold text-slate-700">{row.moduleName}</td>
                    {(["view", "create", "edit", "delete"] as const).map(action => (
                      <td key={action} className="px-6 py-6 text-center">
                        <button onClick={() => togglePermission(row.moduleId, action)}>
                          <CheckCircle2 className={`w-7 h-7 mx-auto ${row[action] ? "text-emerald-500" : "text-slate-200"}`} />
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-8 border-t bg-slate-50/30 flex justify-between items-center">
          <p className="font-bold text-slate-500">Selected Role: <span className="text-indigo-600">{roles.find(r => r._id === selectedRoleId)?.role_name || "N/A"}</span></p>
          <button onClick={handleSave} disabled={saving || loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black shadow-lg flex items-center gap-3 transition-all active:scale-95">
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;