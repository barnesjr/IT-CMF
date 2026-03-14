import type { AssessmentData, AssessmentItem } from './types';

export interface ValidationMessage {
  level: 'error' | 'warning' | 'info';
  message: string;
  path: string;
}

export function validateAssessment(data: AssessmentData): ValidationMessage[] {
  const messages: ValidationMessage[] = [];

  if (!data.client_info.name) {
    messages.push({ level: 'warning', message: 'Client name is not set', path: '/' });
  }
  if (!data.client_info.assessor) {
    messages.push({ level: 'warning', message: 'Assessor name is not set', path: '/' });
  }

  for (const mc of data.macro_capabilities) {
    for (const cc of mc.critical_capabilities) {
      for (const ca of cc.capability_areas) {
        for (const item of ca.items) {
          checkItem(item, `/critical-capabilities/${cc.id}/${ca.id}`, messages);
        }
      }
    }
  }

  return messages;
}

function checkItem(item: AssessmentItem, path: string, messages: ValidationMessage[]): void {
  if (item.na && !item.na_justification) {
    messages.push({
      level: 'warning',
      message: `${item.id}: N/A marked without justification`,
      path,
    });
  }
}

export function getItemValidation(item: AssessmentItem): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  if (item.na && !item.na_justification) {
    messages.push({ level: 'warning', message: 'N/A justification required', path: '' });
  }
  if (item.score !== null && !item.confidence) {
    messages.push({ level: 'info', message: 'Consider adding confidence level', path: '' });
  }
  return messages;
}
