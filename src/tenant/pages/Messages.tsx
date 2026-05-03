
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

// --- Types ---

type SenderType = 'tenant' | 'manager' | 'system';
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
        participants: ['Sarah Chen', 'You'],
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
                senderName: 'You',
                body: "Hi Sarah, just wanted to check — when is the plumber coming? The leak under the sink is getting worse.",
                createdAt: 'Yesterday',
            },
            {
                id: 'm1-2',
                senderType: 'manager',
                senderName: 'Sarah Chen',
                body: "Hi! I've scheduled Rapid Plumbers for tomorrow between 10am–12pm. Does that work for you?",
                createdAt: 'Yesterday',
            },
            {
                id: 'm1-3',
                senderType: 'tenant',
                senderName: 'You',
                body: 'Yes that works perfectly, thank you!',
                createdAt: '2h ago',
            },
        ],
    },
    {
        id: 't2',
        participants: ['Sarah Chen', 'You'],
        subject: 'Lease Renewal Offer — Unit 3B',
        primaryEntityType: 'lease',
        primaryEntityId: 'l-3b',
        primaryEntityLabel: 'Lease #L-3B',
        lastMessageAt: '1d ago',
        unreadCount: 0,
        messages: [
            {
                id: 'm2-1',
                senderType: 'manager',
                senderName: 'Sarah Chen',
                body: "Hi John! Your lease is coming up for renewal in 60 days. We'd love to have you stay — I've sent over a renewal offer for your review. Let me know if you have any questions.",
                createdAt: '2d ago',
            },
            {
                id: 'm2-2',
                senderType: 'tenant',
                senderName: 'You',
                body: "Thanks Sarah, I'll take a look this week and get back to you.",
                createdAt: '1d ago',
            },
        ],
    },
    {
        id: 't3',
        participants: ['System', 'You'],
        subject: 'Rent Receipt — December 2023',
        primaryEntityType: 'payment',
        primaryEntityId: 'pay-dec-2023',
        primaryEntityLabel: 'Payment #P-2023-12',
        lastMessageAt: 'Dec 1',
        unreadCount: 0,
        messages: [
            {
                id: 'm3-1',
                senderType: 'system',
                senderName: 'System',
                body: 'Your rent payment of $1,450.00 for December 2023 was received successfully via Auto-Pay (Visa ...4242). Thank you!',
                createdAt: 'Dec 1',
            },
        ],
    },
    {
        id: 't4',
        participants: ['Sarah Chen', 'You'],
        subject: 'Parking Structure Cleaning — Jan 18',
        primaryEntityType: 'unit',
        primaryEntityId: 'u-3b',
        primaryEntityLabel: 'Unit 3B',
        lastMessageAt: 'Yesterday',
        unreadCount: 1,
        messages: [
            {
                id: 'm4-1',
                senderType: 'manager',
                senderName: 'Sarah Chen',
                body: 'Hi residents! Please move any vehicles from the covered parking structure by 8am on January 18th. Pressure washing will take place 8am–2pm. Thank you for your cooperation!',
                createdAt: 'Yesterday',
            },
        ],
    },
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

const ThreadListItem = ({ thread, active, onClick }: { thread: Thread; active: boolean; onClick: () => void }) => (
    <div
        onClick={onClick}
        className={cn(
            'p-4 border-b cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50',
            active ? 'bg-slate-100 dark:bg-slate-800 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent',
            thread.unreadCount > 0 ? 'bg-white dark:bg-card' : 'bg-slate-50/30 dark:bg-slate-900/10 text-muted-foreground',
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

const MessageBubble = ({ message }: { message: Message }) => {
    const isMe = message.senderType === 'tenant';
    const isSystem = message.senderType === 'system';

    if (isSystem) {
        return (
            <div className="flex justify-center">
                <div className="bg-slate-100 dark:bg-slate-800 border border-border/50 text-muted-foreground text-xs px-4 py-2.5 rounded-xl max-w-[85%] text-center leading-relaxed">
                    {message.body}
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col gap-1 max-w-[85%]', isMe ? 'self-end items-end' : 'self-start items-start')}>
            <div className="text-[10px] text-muted-foreground px-1">
                {isMe ? 'You' : message.senderName} · {message.createdAt}
            </div>
            <div
                className={cn(
                    'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                    isMe
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-foreground rounded-bl-none border border-border/50',
                )}
            >
                {message.body}
            </div>
        </div>
    );
};

// --- Page ---

export default function TenantMessages() {
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(MOCK_THREADS[0].id);
    const selectedThread = MOCK_THREADS.find(t => t.id === selectedThreadId);
    const totalUnread = MOCK_THREADS.reduce((sum, t) => sum + t.unreadCount, 0);

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-0 md:gap-6 max-w-6xl mx-auto overflow-hidden">

            {/* Left: Thread List */}
            <div className="w-full md:w-1/3 flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm h-full">

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
                        {totalUnread > 0 && (
                            <button className="px-3 py-1 bg-slate-900 text-white text-xs rounded-full font-medium whitespace-nowrap">
                                Unread ({totalUnread})
                            </button>
                        )}
                        <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-muted-foreground text-xs rounded-full font-medium whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Maintenance
                        </button>
                        <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-muted-foreground text-xs rounded-full font-medium whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Leases
                        </button>
                    </div>
                </div>

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

            {/* Right: Conversation Viewer */}
            <div className="hidden md:flex flex-1 flex-col bg-card border rounded-xl overflow-hidden shadow-sm h-full">
                {selectedThread ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-card z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="font-semibold text-foreground">
                                        {selectedThread.participants.filter(p => p !== 'You').join(', ')}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{selectedThread.subject}</span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span className="flex items-center gap-1">
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

                        {/* Messages */}
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

                        {/* Composer */}
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
