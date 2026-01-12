import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  MoreVertical, 
  User, 
  Shield, 
  Activity, 
  Ban, 
  RotateCcw, 
  Trash2, 
  Key, 
  Mail, 
  FileEdit,
  Wrench,
  Building
} from 'lucide-react';
import { UserWithRole } from '@/shared/types/auth';
import { useToast } from '@/shared/components/ui/Toast';

interface UserActionMenuProps {
  userWithRole: UserWithRole;
  onUpdateUser: (updatedUser: UserWithRole | null) => void; // null if deleted
}

export function UserActionMenu({ userWithRole, onUpdateUser }: UserActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, membership } = userWithRole;

  const [menuPosition, setMenuPosition] = useState<{ top: number, right: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close (checking both button ref and portal ref)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    // Close on scroll or resize to prevent floating menu in wrong place
    function handleScrollOrResize() {
       setIsOpen(false);
    }

    if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);
    }
    
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, menuRef, dropdownRef]);

  const toggleMenu = () => {
      if (!isOpen) {
          // Calculate position
          const rect = menuRef.current?.getBoundingClientRect();
          if (rect) {
              setMenuPosition({
                  top: rect.bottom + 4,
                  right: window.innerWidth - rect.right 
              });
              setIsOpen(true);
          }
      } else {
          setIsOpen(false);
      }
  };

  const handleAction = (action: string) => {
    setIsOpen(false);
    
    // Mock Action Implementations
    switch (action) {
      case 'suspend':
        onUpdateUser({
          ...userWithRole,
          user: { ...user, status: 'suspended' }
        });
        toast({ title: 'User Suspended', message: `${user.name} has been suspended.`, type: 'warning' });
        console.log(`[AUDIT] user.suspended: Actor=current_user Target=${user.id}`);
        break;
        
      case 'reactivate':
        onUpdateUser({
          ...userWithRole,
          user: { ...user, status: 'active' }
        });
        toast({ title: 'User Reactivated', message: `${user.name} access restored.`, type: 'success' });
        console.log(`[AUDIT] user.reactivated: Actor=current_user Target=${user.id}`);
        break;

      case 'resend_invite':
        toast({ title: 'Invite Resent', message: `Invitation sent to ${user.email}`, type: 'success' });
        console.log(`[AUDIT] user.invite_resent: Actor=current_user Target=${user.id}`);
        break;

      case 'cancel_invite':
        if (confirm('Are you sure you want to cancel this invite?')) {
          onUpdateUser(null); // Remove
          toast({ title: 'Invite Canceled', message: `Invitation for ${user.email} canceled.`, type: 'info' });
          console.log(`[AUDIT] user.invite_canceled: Actor=current_user Target=${user.id}`);
        }
        break;
        
      case 'remove_org':
        if (confirm(`Are you sure you want to remove ${user.name} from the organization? This action is logged.`)) {
          onUpdateUser(null); // Remove
          toast({ title: 'User Removed', message: `${user.name} removed from organization.`, type: 'error' });
          console.log(`[AUDIT] user.removed: Actor=current_user Target=${user.id}`);
        }
        break;

      case 'reset_password':
        toast({ title: 'Password Reset', message: `Reset email sent to ${user.email}`, type: 'info' });
        console.log(`[AUDIT] user.password_reset_sent: Actor=current_user Target=${user.id}`);
        break;

      default:
        console.log(`Action ${action} clicked for ${user.id}`);
        toast({ title: 'Action Triggered', message: `Triggered: ${action}`, type: 'info' });
    }
  };

  // --- Render Logic Based on Status & Role ---

  const renderMenuItems = () => {
    const isMaintenance = membership.roles.includes('role_maintenance');
    const isOwner = membership.roles.includes('role_owner');
    // const isAdmin = membership.roles.includes('role_admin');

    // Groups
    const actions = [];

    // Group 1: Common View/Edit
    if (user.status !== 'invited') {
      actions.push(
        <MenuItem key="profile" icon={User} label="View Profile" onClick={() => handleAction('view_profile')} />,
        <MenuItem key="roles" icon={Shield} label="Edit Roles & Access" onClick={() => handleAction('edit_roles')} />,
      );
      
      if (user.status === 'active') {
        actions.push(
          <MenuItem key="activity" icon={Activity} label="View Activity" onClick={() => handleAction('view_activity')} />
        );
      }
    } else {
      // Invited
      actions.push(
        <MenuItem key="edit_invite" icon={FileEdit} label="Edit Invite" onClick={() => handleAction('edit_invite')} />,
        <MenuItem key="resend_invite" icon={Mail} label="Resend Invite" onClick={() => handleAction('resend_invite')} />
      );
    }

    // Interactive / Role Specific Actions
    if (user.status === 'active') {
       if (isMaintenance) {
         actions.push(<div key="sep1" className="h-px bg-border my-1" />);
         actions.push(<MenuItem key="tickets" icon={Wrench} label="View Assigned Tickets" onClick={() => handleAction('view_tickets')} />);
       }
       if (isOwner) {
         actions.push(<div key="sep1" className="h-px bg-border my-1" />);
         actions.push(<MenuItem key="portfolio" icon={Building} label="View Portfolio Access" onClick={() => handleAction('view_portfolio')} />);
       }
    }

    // Authentication Actions (Suspend/Reset)
    if (user.status === 'active') {
      actions.push(<div key="sep2" className="h-px bg-border my-1" />);
      actions.push(<MenuItem key="reset_pass" icon={Key} label="Reset Password" onClick={() => handleAction('reset_password')} />);
      actions.push(<MenuItem key="suspend" icon={Ban} label="Suspend User" onClick={() => handleAction('suspend')} className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20" />);
    } else if (user.status === 'suspended') {
      actions.push(<div key="sep2" className="h-px bg-border my-1" />);
      actions.push(<MenuItem key="reactivate" icon={RotateCcw} label="Reactivate User" onClick={() => handleAction('reactivate')} className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" />);
    }

    // Destructive Actions
    actions.push(<div key="sep_dest" className="h-px bg-border my-1" />);
    
    if (user.status === 'invited') {
      actions.push(<MenuItem key="cancel" icon={Trash2} label="Cancel Invite" onClick={() => handleAction('cancel_invite')} className="text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20" />);
    } else {
      actions.push(<MenuItem key="remove" icon={Trash2} label="Remove From Organization" onClick={() => handleAction('remove_org')} className="text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20" />);
    }

    return actions;
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button 
          onClick={toggleMenu}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-primary/20"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {isOpen && menuPosition && createPortal(
        <div 
            ref={dropdownRef}
            style={{ 
                position: 'fixed', 
                top: menuPosition.top, 
                right: menuPosition.right,
                zIndex: 9999
            }}
            className="w-56 bg-popover rounded-xl border shadow-lg shadow-black/5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right"
        >
           <div className="p-1">
             {renderMenuItems()}
           </div>
        </div>,
        document.body
      )}
    </>
  );
}

function MenuItem({ icon: Icon, label, onClick, className }: { icon: any, label: string, onClick: () => void, className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${className || 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}
    >
      <Icon size={14} className="opacity-70" />
      {label}
    </button>
  );
}
