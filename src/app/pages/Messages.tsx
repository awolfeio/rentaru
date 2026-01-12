
import { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Paperclip,
  Send,
  Wrench,
  FileText,
  CreditCard, 
  Building2,
  MoreVertical,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type SenderType = 'tenant' | 'vendor' | 'staff' | 'system';
type EntityType = 'maintenance' | 'lease' | 'payment' | 'unit';

interface Message {
  id: string;
  senderType: SenderType;
  senderName: string;
  body: string;
  createdAt: string;
  attachments?: string[];
}

interface Thread {
  id: string;
  participants: string[];
  subject: string;
  primaryEntityType: EntityType;
  primaryEntityId: string;
  primaryEntityLabel: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

// --- Mock Data ---

const MOCK_THREADS: Thread[] = [
  {
    id: 't1',
    participants: ['Jane Smith', 'Property Manager'],
    subject: 'Leaking sink update',
    primaryEntityType: 'maintenance',
    primaryEntityId: 'm1',
    primaryEntityLabel: 'Maintenance #M1',
    lastMessageAt: '2h ago',
    unreadCount: 1,
    messages: [
       {
           id: 'm1-1',
           senderType: 'tenant',
           senderName: 'Jane Smith',
           body: 'Hi, just wanted to check when the plumber is coming? usage is getting tricky.',
           createdAt: 'Yesterday'
       },
       {
           id: 'm1-2',
           senderType: 'staff',
           senderName: 'You',
           body: 'Hi Jane, I have scheduled Rapid Plumbers for tomorrow between 10am-12pm. Does that work?',
           createdAt: 'Yesterday'
       },
       {
           id: 'm1-3',
           senderType: 'tenant',
           senderName: 'Jane Smith',
           body: 'Yes that works perfectly, thank you!',
           createdAt: '2h ago'
       }
    ]
  },
  {
    id: 't2',
    participants: ['Rapid Plumbers Co.', 'Property Manager'],
    subject: 'Invoice #4492 Question',
    primaryEntityType: 'payment',
    primaryEntityId: 'inv-4492',
    primaryEntityLabel: 'Invoice #4492',
    lastMessageAt: '1d ago',
    unreadCount: 0,
    messages: [
        {
            id: 'm2-1',
            senderType: 'vendor',
            senderName: 'Rapid Plumbers Admin',
            body: 'Hello, regarding the invoice sent last week, was the parts breakdown clear?',
            createdAt: '2d ago'
        },
        {
            id: 'm2-2',
            senderType: 'staff',
            senderName: 'You',
            body: 'Yes, looking at it now. Processing payment this afternoon.',
            createdAt: '1d ago'
        }
    ]
  },
  {
    id: 't3',
    participants: ['System', 'Property Manager'],
    subject: 'Lease Renewal Alert: Unit 102',
    primaryEntityType: 'lease',
    primaryEntityId: 'l-102',
    primaryEntityLabel: 'Lease #L-102',
    lastMessageAt: '3d ago',
    unreadCount: 0,
    messages: [
        {
            id: 'm3-1',
            senderType: 'system',
            senderName: 'System',
            body: 'The lease for Unit 102 (Michael Chen) is expiring in 60 days. Auto-generated renewal offer has been drafted.',
            createdAt: '3d ago'
        }
    ]
  }
];

// --- Components ---

const EntityIcon = ({ type }: { type: EntityType }) => {
    switch (type) {
        case 'maintenance': return <Wrench size={14} className="text-amber-600" />;
        case 'lease': return <FileText size={14} className="text-blue-600" />;
        case 'payment': return <CreditCard size={14} className="text-emerald-600" />;
        case 'unit': return <Building2 size={14} className="text-slate-600" />;
    }
};

const ThreadListItem = ({ thread, active, onClick }: { thread: Thread, active: boolean, onClick: () => void }) => {
    return (
        <div 
            onClick={onClick}
            className={cn(
                "p-4 border-b cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                active ? "bg-slate-100 dark:bg-slate-800 border-l-4 border-l-primary" : "border-l-4 border-l-transparent",
                thread.unreadCount > 0 ? "bg-white dark:bg-card" : "bg-slate-50/30 dark:bg-slate-900/10 text-muted-foreground"
            )}
        >
            <div className="flex justify-between items-start mb-1">
                <div className="font-semibold text-sm truncate pr-2 flex items-center gap-2">
                    {thread.unreadCount > 0 && <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />}
                    {thread.participants[0]}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{thread.lastMessageAt}</div>
            </div>
            
            <div className="flex items-center gap-1.5 mb-2">
                 <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-700/30 text-[10px] uppercase font-bold tracking-wide text-muted-foreground">
                    <EntityIcon type={thread.primaryEntityType} />
                    <span>{thread.primaryEntityType}</span>
                 </div>
                 <div className="text-xs font-medium truncate">{thread.subject}</div>
            </div>

            <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {thread.messages[thread.messages.length - 1].body}
            </div>
        </div>
    );
};

const MessageBubble = ({ message }: { message: Message }) => {
    const isMe = message.senderType === 'staff';
    
    return (
        <div className={cn("flex flex-col gap-1 max-w-[85%]", isMe ? "self-end items-end" : "self-start items-start")}>
            <div className="text-[10px] text-muted-foreground px-1">
                {isMe ? 'You' : message.senderName} • {message.createdAt}
            </div>
            <div className={cn(
                "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                isMe 
                    ? "bg-primary text-primary-foreground rounded-br-none" 
                    : "bg-slate-100 dark:bg-slate-800 text-foreground rounded-bl-none border border-border/50"
            )}>
                {message.body}
            </div>
        </div>
    );
};

export default function MessagesPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(MOCK_THREADS[0].id);
  const selectedThread = MOCK_THREADS.find(t => t.id === selectedThreadId);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-0 md:gap-6 max-w-6xl mx-auto overflow-hidden">
      
      {/* --- Left Column: Thread List --- */}
      <div className="w-full md:w-1/3 flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm h-full">
         
         {/* List Header */}
         <div className="p-4 border-b flex flex-col gap-3">
             <div className="flex items-center justify-between">
                 <h2 className="font-semibold text-lg">Inbox</h2>
                 <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                     <Plus size={20} className="text-primary" />
                 </button>
             </div>
             <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={14} />
                 <input 
                    type="text" 
                    placeholder="Search messages..." 
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                 />
             </div>
             <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                 <button className="px-3 py-1 bg-slate-900 text-white text-xs rounded-full font-medium whitespace-nowrap">Unread (1)</button>
                 <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-muted-foreground text-xs rounded-full font-medium whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Maintenance</button>
                 <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-muted-foreground text-xs rounded-full font-medium whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Leases</button>
             </div>
         </div>

         {/* Threads */}
         <div className="flex-1 overflow-y-auto">
             {MOCK_THREADS.map(thread => (
                 <ThreadListItem 
                    key={thread.id} 
                    thread={thread} 
                    active={selectedThreadId === thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                 />
             ))}
         </div>
      </div>

      {/* --- Right Column: Conversation Viewer --- */}
      <div className="hidden md:flex flex-1 flex-col bg-card border rounded-xl overflow-hidden shadow-sm h-full">
         {selectedThread ? (
             <>
                {/* Viewer Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-card z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                             <h3 className="font-semibold text-foreground">{selectedThread.participants.filter(p => p !== 'You' && p !== 'Property Manager').join(', ')}</h3>
                             {selectedThread.primaryEntityType === 'maintenance' && (
                                 <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">High Priority</span>
                             )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{selectedThread.subject}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                                <EntityIcon type={selectedThread.primaryEntityType} />
                                {selectedThread.primaryEntityLabel}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                            <CheckCheck size={18} />
                        </button>
                        <button className="p-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/10">
                    <div className="flex justify-center">
                        <span className="text-[10px] font-medium text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                            Thread Started {selectedThread.messages[0].createdAt}
                        </span>
                    </div>
                    {selectedThread.messages.map(msg => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                </div>

                {/* Reply Composer */}
                <div className="p-4 border-t bg-white dark:bg-card">
                    <div className="flex gap-2">
                        <button className="p-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors h-fit self-end">
                            <Paperclip size={20} />
                        </button>
                        <div className="flex-1 bg-slate-50 dark:bg-slate-900 border rounded-2xl p-3 focus-within:ring-1 focus-within:ring-primary transition-all">
                             <textarea 
                                placeholder="Type a message..." 
                                className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none outline-none max-h-32 min-h-[1.5rem]"
                                rows={1}
                             />
                        </div>
                        <button className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-sm h-fit self-end">
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="mt-2 text-[10px] text-muted-foreground flex justify-end gap-3 px-2">
                        <span>Press Enter to send</span>
                    </div>
                </div>
             </>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <MessageSquare size={32} className="opacity-50" />
                 </div>
                 <h3 className="font-medium text-foreground">No Conversation Selected</h3>
                 <p className="text-sm mt-1 max-w-xs">Select a conversation from the list to view details and reply.</p>
             </div>
         )}
      </div>

    </div>
  );
}
