/**
 * Checks if the trigger event time overlaps with the worker's preferred work hours
 */
const isWorkingHourOverlap = (triggerEvent, preferredHours) => {
  if (!triggerEvent || !triggerEvent.startTime || !preferredHours || !preferredHours.start || !preferredHours.end) {
    return false; // Not enough info
  }
  
  // Format is "12:00" string
  const [prefStartHour, prefStartMinute] = preferredHours.start.split(':').map(Number);
  const [prefEndHour, prefEndMinute] = preferredHours.end.split(':').map(Number);

  const startMinutes = prefStartHour * 60 + prefStartMinute;
  let endMinutes = prefEndHour * 60 + prefEndMinute;
  
  // Handle cross-midnight shift very simply
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  const triggerTime = new Date(triggerEvent.startTime);
  const triggerMinutes = triggerTime.getHours() * 60 + triggerTime.getMinutes();

  // Simplistic overlap check for demo: is the trigger starting during work hours?
  let effectiveTriggerMinutes = triggerMinutes;
  if (triggerMinutes < startMinutes && endMinutes > 24*60 && (triggerMinutes + 24*60) <= endMinutes) {
      effectiveTriggerMinutes = triggerMinutes + 24*60;
  }

  return (effectiveTriggerMinutes >= startMinutes && effectiveTriggerMinutes <= endMinutes);
};

module.exports = { isWorkingHourOverlap };
