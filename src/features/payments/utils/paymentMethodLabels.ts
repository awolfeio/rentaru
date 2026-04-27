import { Payment, ManualPaymentMethod } from '../types';

export const getPaymentMethodLabel = (payment: Payment): string => {
  if (payment.origin === 'processor') {
    return `${payment.method.toUpperCase()} •••• ${payment.last4 || '****'}`;
  }

  const labels: Record<ManualPaymentMethod, string> = {
    cash: 'Cash',
    check: payment.manualRef ? `Check · ${payment.manualRef}` : 'Check',
    money_order: payment.manualRef ? `Money order · ${payment.manualRef}` : 'Money order',
    external_bank_transfer: payment.manualSourceLabel || 'External bank transfer',
    external_digital_wallet: payment.manualSourceLabel || 'External digital wallet',
    third_party: payment.payerName ? `Third-party · ${payment.payerName}` : 'Third-party payment',
  };

  return labels[payment.method as ManualPaymentMethod];
};
