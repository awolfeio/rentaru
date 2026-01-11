
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Plus, 
  Search, 
  Filter,
  Building,
  CheckCircle2,
  Clock,
  Ban,
  Wrench,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserWithRole, UserStatus } from '@/types/auth';
import { STANDARD_ROLES, getMockUsersWithRoles } from '@/mockData/auth';
import { UserActionMenu } from '@/components/users/UserActionMenu';

// --- Badge Components ---

const StatusBadge = ({ status }: { status: UserStatus }) => {
  const styles = {
    active: 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
    invited: 'bg-indigo-100/50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20',
    suspended: 'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20'
  };

  const icons = {
    active: CheckCircle2,
    invited: Clock,
    suspended: Ban
  };

  const Icon = icons[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide", styles[status])}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const RoleBadge = ({ roleName }: { roleName: string }) => {
  let Icon = Shield;
  
  switch (roleName) {
    case 'Maintenance':
      Icon = Wrench;
      break;
    case 'Property Manager':
      Icon = Briefcase;
      break;
    default:
      Icon = Shield;
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      <Icon size={10} className="mr-1 opacity-70" />
      {roleName}
    </span>
  );
};

// --- Main Page Component ---

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithRole[]>(getMockUsersWithRoles());
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // --- Invite Modal Form State ---
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState(STANDARD_ROLES[0].id);
  const [inviteScope, setInviteScope] = useState('all'); // Simplified for MVP

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newUser: UserWithRole = {
      user: {
        id: `user_${Date.now()}`,
        name: inviteEmail.split('@')[0], // Placeholder name
        email: inviteEmail,
        status: 'invited',
        invitedAt: new Date().toISOString(),
      },
      membership: {
        userId: `user_${Date.now()}`,
        organizationId: 'org_1',
        roles: [inviteRole],
        propertyScope: inviteScope === 'all' ? 'all' : [], // Logic to be expanded
        unitScope: []
      }
    };

    setUsers([...users, newUser]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteRole(STANDARD_ROLES[0].id);
  };

  const getRoleName = (roleId: string) => {
    return STANDARD_ROLES.find(r => r.id === roleId)?.name || 'Unknown';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Users</h1>
          <p className="text-muted-foreground">Manage your team, assign roles, and control access permissions.</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus size={16} />
          Invite User
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm max-w-2xl">
        <Search className="text-muted-foreground ml-2" size={18} />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none text-foreground"
        />
        <div className="w-px h-6 bg-border mx-2" />
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Filter size={14} />
          Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Access Scope</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((item) => (
                <tr key={item.user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border border-border">
                        {item.user.avatarUrl ? (
                          <img src={item.user.avatarUrl} alt={item.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon size={16} className="text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{item.user.name}</span>
                        <span className="text-xs text-muted-foreground">{item.user.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={item.user.status} />
                  </td>

                  {/* Roles */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.membership.roles.map(roleId => (
                        <RoleBadge key={roleId} roleName={getRoleName(roleId)} />
                      ))}
                    </div>
                  </td>

                  {/* Scope */}
                  <td className="px-6 py-4 text-muted-foreground">
                    {item.membership.propertyScope === 'all' ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Building size={14} /> All Properties
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 opacity-80">
                        <Building size={14} /> {item.membership.propertyScope.length} Properties
                      </span>
                    )}
                  </td>

                  {/* Last Active */}
                  <td className="px-6 py-4 text-muted-foreground">
                    {item.user.lastActive ? new Date(item.user.lastActive).toLocaleDateString() : '—'}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <UserActionMenu 
                      userWithRole={item} 
                      onUpdateUser={(updated) => {
                         if (updated) {
                           setUsers(current => current.map(u => u.user.id === updated.user.id ? updated : u));
                         } else {
                           setUsers(current => current.filter(u => u.user.id !== item.user.id));
                         }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No users found matching your search.
          </div>
        )}
      </div>

      {/* Invite Modal Overlay */}
      {isInviteModalOpen && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-h-screen">
          <div className="bg-card w-full max-w-md rounded-xl border shadow-xl p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold mb-4">Invite New User</h2>
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                  <input 
                    type="email" 
                    required
                    placeholder="colleague@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Role</label>
                <div className="grid gap-2">
                  {STANDARD_ROLES.filter(r => r.id !== 'role_tenant').map(role => (
                    <label 
                      key={role.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900",
                        inviteRole === role.id ? "border-primary ring-1 ring-primary/20 bg-primary/5 dark:bg-primary/5" : "border-border"
                      )}
                    >
                      <input 
                        type="radio" 
                        name="role" 
                        value={role.id} 
                        checked={inviteRole === role.id} 
                        onChange={() => setInviteRole(role.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-sm text-foreground">{role.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{role.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Access Scope</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                  value={inviteScope}
                  onChange={(e) => setInviteScope(e.target.value)}
                >
                  <option value="all">All Properties</option>
                  <option value="limited" disabled>Selected Properties (Coming Soon)</option>
                </select>
                <p className="text-[10px] text-muted-foreground">Admin roles typically require 'All Properties' access.</p>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
                >
                    Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
