import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  Loader2,
  ShieldCheck,
} from "lucide-react";

// Fixed ERP Modules List
const ERP_MODULES = [
  { id: "m1", name: "User Management" },
  { id: "m2", name: "Human Resource" },
  { id: "m3", name: "Sales & Marketing" },
  { id: "m4", name: "Inventory & Stock" },
  { id: "m5", name: "Finance & Accounts" },
  { id: "m6", name: "Purchase Management" },
  { id: "m7", name: "Client Management" },
];

interface PermissionRow {
  moduleId: string;
  moduleName: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

// Role interface with ID for reference
interface RoleData {
  _id: string;
  roleName: string;
}

const PermissionManager = () => {
  // 1. roleName-ന് പകരം selectedRoleId സ്റ്റോർ ചെയ്യുന്നു
  const [selectedRoleId, setSelectedRoleId] = useState<string>("r1");
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. Roles with unique IDs (Reference Data)
  const roles: RoleData[] = [
    { _id: "r1", roleName: "Admin" },
    { _id: "r2", roleName: "Project Manager" },
    { _id: "r3", roleName: "Accountant" },
    { _id: "r4", roleName: "Sales Executive" },
  ];

  useEffect(() => {
    const loadRolePermissions = async () => {
      setLoading(true);

      // ഇവിടേയ്ക്ക് ബാക്കെൻഡിൽ നിന്ന് ഈ പ്രത്യേക roleId-യുടെ ഡാറ്റ എടുക്കാം
      // Example: const res = await fetch(`/api/permissions/${selectedRoleId}`);

      const defaultData: PermissionRow[] = ERP_MODULES.map((mod) => ({
        moduleId: mod.id,
        moduleName: mod.name,
        // Admin (r1) ആണെങ്കിൽ മാത്രം default view true നൽകുന്നു
        view: selectedRoleId === "r1",
        create: false,
        edit: false,
        delete: false,
      }));

      setTimeout(() => {
        setPermissions(defaultData);
        setLoading(false);
      }, 500);
    };

    loadRolePermissions();
  }, [selectedRoleId]); // selectedRoleId മാറുമ്പോൾ മാത്രം ഫെച്ച് ചെയ്യും

  const togglePermission = (
    moduleId: string,
    field: keyof Omit<PermissionRow, "moduleId" | "moduleName">,
  ) => {
    setPermissions((prev) =>
      prev.map((row) =>
        row.moduleId === moduleId ? { ...row, [field]: !row[field] } : row,
      ),
    );
  };

  const handleSave = async () => {
    // 3. സേവ് ചെയ്യുമ്പോൾ Role-ന്റെ പേരിന് പകരം ID (Ref) അയക്കുന്നു
    const payload = {
      roleRef: selectedRoleId,
      access: permissions,
    };
    console.log("Saving ERP Access Data for Role ID:", payload);

    const currentRoleName = roles.find(
      (r) => r._id === selectedRoleId,
    )?.roleName;
    alert(
      `Permissions for ${currentRoleName} updated using ID: ${selectedRoleId}`,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 flex justify-center font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> ERP Access Control
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage module-wise permissions with Role Reference
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="font-semibold text-gray-600">Select Role:</label>
            <div className="relative">
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="appearance-none border-2 border-gray-100 rounded-xl px-5 py-2.5 pr-12 bg-gray-50 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700 cursor-pointer"
              >
                {/* 4. Display roleName, but value is roleId (_id) */}
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
            <p className="text-gray-400 font-medium">Loading Access Map...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-8 py-5 font-bold">Module Model</th>
                  <th className="px-6 py-5 text-center font-bold">View</th>
                  <th className="px-6 py-5 text-center font-bold">Create</th>
                  <th className="px-6 py-5 text-center font-bold">Edit</th>
                  <th className="px-6 py-5 text-center font-bold">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {permissions.map((row) => (
                  <tr
                    key={row.moduleId}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <span className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                        {row.moduleName}
                      </span>
                    </td>

                    {(["view", "create", "edit", "delete"] as const).map(
                      (action) => (
                        <td key={action} className="px-6 py-5 text-center">
                          <button
                            onClick={() =>
                              togglePermission(row.moduleId, action)
                            }
                            className="transform active:scale-90 transition-transform"
                          >
                            {row[action] ? (
                              <CheckCircle2
                                className="text-green-500 w-6 h-6 mx-auto"
                                strokeWidth={2.5}
                              />
                            ) : (
                              <XCircle
                                className="text-gray-200 group-hover:text-red-200 w-6 h-6 mx-auto"
                                strokeWidth={2.5}
                              />
                            )}
                          </button>
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-8 bg-gray-50/50 flex justify-end border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Update Role Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;
