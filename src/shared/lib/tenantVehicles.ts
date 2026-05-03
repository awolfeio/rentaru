import type { ParkingAssignment, VehiclePowertrain } from '@/shared/types/tenant';

export const PARKING_ASSIGNMENT_LABELS: Record<ParkingAssignment, string> = {
  unassigned_open_lot_parking: 'Unassigned open lot parking',
  covered_carport: 'Covered carport',
  parking_garage: 'Parking garage',
  tandem_parking: 'Tandem Parking',
  oversized_vehicle: 'Oversized vehicle',
  motorcycle: 'Motorcycle',
};

export const PARKING_ASSIGNMENT_OPTIONS = Object.entries(PARKING_ASSIGNMENT_LABELS).map(
  ([value, label]) => ({ value: value as ParkingAssignment, label })
);

export const VEHICLE_POWERTRAIN_LABELS: Record<VehiclePowertrain, string> = {
  electric: 'Electric',
  non_electric: 'Non Electric',
};

export function getParkingAssignmentLabel(parkingAssignment: ParkingAssignment) {
  return PARKING_ASSIGNMENT_LABELS[parkingAssignment];
}

export function getVehiclePowertrainLabel(powertrain: VehiclePowertrain) {
  return VEHICLE_POWERTRAIN_LABELS[powertrain];
}
