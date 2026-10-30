// Tự động sinh từ src/content/
import type { LessonContentFile, TopicContent } from '@/types/content';

import lesson_01_programmable_control from './01-programmable-control/_lesson';
import topic_01_programmable_control_control_system_basics from './01-programmable-control/control-system-basics';
import topic_01_programmable_control_defining_plc from './01-programmable-control/defining-plc';
import topic_01_programmable_control_hardwired_vs_programmable from './01-programmable-control/hardwired-vs-programmable';
import topic_01_programmable_control_languages_structure from './01-programmable-control/languages-structure';
import topic_01_programmable_control_loop_types from './01-programmable-control/loop-types';
import topic_01_programmable_control_memory_and_leds from './01-programmable-control/memory-and-leds';
import topic_01_programmable_control_plc_structure from './01-programmable-control/plc-structure';
import topic_01_programmable_control_scan_cycle from './01-programmable-control/scan-cycle';
import topic_01_programmable_control_why_plc from './01-programmable-control/why-plc';
import lesson_02_s7_1200_tia_portal from './02-s7-1200-tia-portal/_lesson';
import topic_02_s7_1200_tia_portal_comms_setup from './02-s7-1200-tia-portal/comms-setup';
import topic_02_s7_1200_tia_portal_field_wiring from './02-s7-1200-tia-portal/field-wiring';
import topic_02_s7_1200_tia_portal_install_tia from './02-s7-1200-tia-portal/install-tia';
import topic_02_s7_1200_tia_portal_program_processing from './02-s7-1200-tia-portal/program-processing';
import topic_02_s7_1200_tia_portal_s7_1200_device from './02-s7-1200-tia-portal/s7-1200-device';
import topic_02_s7_1200_tia_portal_using_tia from './02-s7-1200-tia-portal/using-tia';
import topic_02_s7_1200_tia_portal_verify_wiring from './02-s7-1200-tia-portal/verify-wiring';
import lesson_03_binary_operations from './03-binary-operations/_lesson';
import topic_03_binary_operations_binary_application from './03-binary-operations/binary-application';
import topic_03_binary_operations_counters from './03-binary-operations/counters';
import topic_03_binary_operations_logic_links from './03-binary-operations/logic-links';
import topic_03_binary_operations_set_reset from './03-binary-operations/set-reset';
import topic_03_binary_operations_timers from './03-binary-operations/timers';
import lesson_04_numeric_operations from './04-numeric-operations/_lesson';
import topic_04_numeric_operations_comparison from './04-numeric-operations/comparison';
import topic_04_numeric_operations_data_space from './04-numeric-operations/data-space';
import topic_04_numeric_operations_math_functions from './04-numeric-operations/math-functions';
import topic_04_numeric_operations_real_time_clock from './04-numeric-operations/real-time-clock';
import topic_04_numeric_operations_rotate_shift from './04-numeric-operations/rotate-shift';
import lesson_05_analog_signals from './05-analog-signals/_lesson';
import topic_05_analog_signals_analog_modules from './05-analog-signals/analog-modules';
import topic_05_analog_signals_analog_signals from './05-analog-signals/analog-signals';
import topic_05_analog_signals_analog_wiring from './05-analog-signals/analog-wiring';
import topic_05_analog_signals_norm_scale from './05-analog-signals/norm-scale';
import lesson_06_other_plc_brands from './06-other-plc-brands/_lesson';
import topic_06_other_plc_brands_common_instructions from './06-other-plc-brands/common-instructions';
import topic_06_other_plc_brands_io_circuits from './06-other-plc-brands/io-circuits';
import topic_06_other_plc_brands_ladder_diagram from './06-other-plc-brands/ladder-diagram';
import topic_06_other_plc_brands_omron_mitsubishi from './06-other-plc-brands/omron-mitsubishi';
import topic_06_other_plc_brands_programming_console from './06-other-plc-brands/programming-console';
import lesson_07_system_design from './07-system-design/_lesson';
import topic_07_system_design_analog_expansion from './07-system-design/analog-expansion';
import topic_07_system_design_design_program from './07-system-design/design-program';
import topic_07_system_design_device_selection from './07-system-design/device-selection';
import topic_07_system_design_digital_expansion from './07-system-design/digital-expansion';
import topic_07_system_design_fault_handling from './07-system-design/fault-handling';
import lesson_08_advanced_instructions from './08-advanced-instructions/_lesson';
import topic_08_advanced_instructions_interrupt_instructions from './08-advanced-instructions/interrupt-instructions';
import topic_08_advanced_instructions_string_instructions from './08-advanced-instructions/string-instructions';
import topic_08_advanced_instructions_time_instructions from './08-advanced-instructions/time-instructions';
import lesson_09_high_speed_counting from './09-high-speed-counting/_lesson';
import topic_09_high_speed_counting_analog_in_motion from './09-high-speed-counting/analog-in-motion';
import topic_09_high_speed_counting_encoder_basics from './09-high-speed-counting/encoder-basics';
import topic_09_high_speed_counting_high_speed_counter from './09-high-speed-counting/high-speed-counter';
import topic_09_high_speed_counting_motion_control from './09-high-speed-counting/motion-control';
import topic_09_high_speed_counting_pwm_output from './09-high-speed-counting/pwm-output';
import lesson_10_closed_loop_pid from './10-closed-loop-pid/_lesson';
import topic_10_closed_loop_pid_closed_loop_design from './10-closed-loop-pid/closed-loop-design';
import topic_10_closed_loop_pid_pid_compact from './10-closed-loop-pid/pid-compact';
import topic_10_closed_loop_pid_pid_tuning from './10-closed-loop-pid/pid-tuning';
import lesson_11_communication from './11-communication/_lesson';
import topic_11_communication_point_to_point from './11-communication/point-to-point';
import topic_11_communication_profinet_profibus from './11-communication/profinet-profibus';
import lesson_12_fault_diagnostics from './12-fault-diagnostics/_lesson';
import topic_12_fault_diagnostics_diagnostic_buffer from './12-fault-diagnostics/diagnostic-buffer';
import topic_12_fault_diagnostics_diagnostic_overview from './12-fault-diagnostics/diagnostic-overview';
import topic_12_fault_diagnostics_watch_force_tables from './12-fault-diagnostics/watch-force-tables';
import lesson_13_s7_300 from './13-s7-300/_lesson';
import topic_13_s7_300_s7_300_applications from './13-s7-300/s7-300-applications';
import topic_13_s7_300_s7_300_instructions from './13-s7-300/s7-300-instructions';
import topic_13_s7_300_s7_300_overview from './13-s7-300/s7-300-overview';
import lesson_14_system_upgrade from './14-system-upgrade/_lesson';
import topic_14_system_upgrade_migration_paths from './14-system-upgrade/migration-paths';
import topic_14_system_upgrade_project_conversion from './14-system-upgrade/project-conversion';
import topic_14_system_upgrade_upgrade_risks from './14-system-upgrade/upgrade-risks';
import topic_14_system_upgrade_why_upgrade from './14-system-upgrade/why-upgrade';
import lesson_15_system_integration from './15-system-integration/_lesson';
import topic_15_system_integration_automation_pyramid from './15-system-integration/automation-pyramid';
import topic_15_system_integration_integration_walkthrough from './15-system-integration/integration-walkthrough';
import topic_15_system_integration_real_world_case from './15-system-integration/real-world-case';

export const allLessons: LessonContentFile[] = [
  lesson_01_programmable_control,
  lesson_02_s7_1200_tia_portal,
  lesson_03_binary_operations,
  lesson_04_numeric_operations,
  lesson_05_analog_signals,
  lesson_06_other_plc_brands,
  lesson_07_system_design,
  lesson_08_advanced_instructions,
  lesson_09_high_speed_counting,
  lesson_10_closed_loop_pid,
  lesson_11_communication,
  lesson_12_fault_diagnostics,
  lesson_13_s7_300,
  lesson_14_system_upgrade,
  lesson_15_system_integration
].sort((a, b) => a.id - b.id);

export const allTopics: Record<string, TopicContent> = {
  '01-programmable-control/control-system-basics': topic_01_programmable_control_control_system_basics,
  '01-programmable-control/defining-plc': topic_01_programmable_control_defining_plc,
  '01-programmable-control/hardwired-vs-programmable': topic_01_programmable_control_hardwired_vs_programmable,
  '01-programmable-control/languages-structure': topic_01_programmable_control_languages_structure,
  '01-programmable-control/loop-types': topic_01_programmable_control_loop_types,
  '01-programmable-control/memory-and-leds': topic_01_programmable_control_memory_and_leds,
  '01-programmable-control/plc-structure': topic_01_programmable_control_plc_structure,
  '01-programmable-control/scan-cycle': topic_01_programmable_control_scan_cycle,
  '01-programmable-control/why-plc': topic_01_programmable_control_why_plc,
  '02-s7-1200-tia-portal/comms-setup': topic_02_s7_1200_tia_portal_comms_setup,
  '02-s7-1200-tia-portal/field-wiring': topic_02_s7_1200_tia_portal_field_wiring,
  '02-s7-1200-tia-portal/install-tia': topic_02_s7_1200_tia_portal_install_tia,
  '02-s7-1200-tia-portal/program-processing': topic_02_s7_1200_tia_portal_program_processing,
  '02-s7-1200-tia-portal/s7-1200-device': topic_02_s7_1200_tia_portal_s7_1200_device,
  '02-s7-1200-tia-portal/using-tia': topic_02_s7_1200_tia_portal_using_tia,
  '02-s7-1200-tia-portal/verify-wiring': topic_02_s7_1200_tia_portal_verify_wiring,
  '03-binary-operations/binary-application': topic_03_binary_operations_binary_application,
  '03-binary-operations/counters': topic_03_binary_operations_counters,
  '03-binary-operations/logic-links': topic_03_binary_operations_logic_links,
  '03-binary-operations/set-reset': topic_03_binary_operations_set_reset,
  '03-binary-operations/timers': topic_03_binary_operations_timers,
  '04-numeric-operations/comparison': topic_04_numeric_operations_comparison,
  '04-numeric-operations/data-space': topic_04_numeric_operations_data_space,
  '04-numeric-operations/math-functions': topic_04_numeric_operations_math_functions,
  '04-numeric-operations/real-time-clock': topic_04_numeric_operations_real_time_clock,
  '04-numeric-operations/rotate-shift': topic_04_numeric_operations_rotate_shift,
  '05-analog-signals/analog-modules': topic_05_analog_signals_analog_modules,
  '05-analog-signals/analog-signals': topic_05_analog_signals_analog_signals,
  '05-analog-signals/analog-wiring': topic_05_analog_signals_analog_wiring,
  '05-analog-signals/norm-scale': topic_05_analog_signals_norm_scale,
  '06-other-plc-brands/common-instructions': topic_06_other_plc_brands_common_instructions,
  '06-other-plc-brands/io-circuits': topic_06_other_plc_brands_io_circuits,
  '06-other-plc-brands/ladder-diagram': topic_06_other_plc_brands_ladder_diagram,
  '06-other-plc-brands/omron-mitsubishi': topic_06_other_plc_brands_omron_mitsubishi,
  '06-other-plc-brands/programming-console': topic_06_other_plc_brands_programming_console,
  '07-system-design/analog-expansion': topic_07_system_design_analog_expansion,
  '07-system-design/design-program': topic_07_system_design_design_program,
  '07-system-design/device-selection': topic_07_system_design_device_selection,
  '07-system-design/digital-expansion': topic_07_system_design_digital_expansion,
  '07-system-design/fault-handling': topic_07_system_design_fault_handling,
  '08-advanced-instructions/interrupt-instructions': topic_08_advanced_instructions_interrupt_instructions,
  '08-advanced-instructions/string-instructions': topic_08_advanced_instructions_string_instructions,
  '08-advanced-instructions/time-instructions': topic_08_advanced_instructions_time_instructions,
  '09-high-speed-counting/analog-in-motion': topic_09_high_speed_counting_analog_in_motion,
  '09-high-speed-counting/encoder-basics': topic_09_high_speed_counting_encoder_basics,
  '09-high-speed-counting/high-speed-counter': topic_09_high_speed_counting_high_speed_counter,
  '09-high-speed-counting/motion-control': topic_09_high_speed_counting_motion_control,
  '09-high-speed-counting/pwm-output': topic_09_high_speed_counting_pwm_output,
  '10-closed-loop-pid/closed-loop-design': topic_10_closed_loop_pid_closed_loop_design,
  '10-closed-loop-pid/pid-compact': topic_10_closed_loop_pid_pid_compact,
  '10-closed-loop-pid/pid-tuning': topic_10_closed_loop_pid_pid_tuning,
  '11-communication/point-to-point': topic_11_communication_point_to_point,
  '11-communication/profinet-profibus': topic_11_communication_profinet_profibus,
  '12-fault-diagnostics/diagnostic-buffer': topic_12_fault_diagnostics_diagnostic_buffer,
  '12-fault-diagnostics/diagnostic-overview': topic_12_fault_diagnostics_diagnostic_overview,
  '12-fault-diagnostics/watch-force-tables': topic_12_fault_diagnostics_watch_force_tables,
  '13-s7-300/s7-300-applications': topic_13_s7_300_s7_300_applications,
  '13-s7-300/s7-300-instructions': topic_13_s7_300_s7_300_instructions,
  '13-s7-300/s7-300-overview': topic_13_s7_300_s7_300_overview,
  '14-system-upgrade/migration-paths': topic_14_system_upgrade_migration_paths,
  '14-system-upgrade/project-conversion': topic_14_system_upgrade_project_conversion,
  '14-system-upgrade/upgrade-risks': topic_14_system_upgrade_upgrade_risks,
  '14-system-upgrade/why-upgrade': topic_14_system_upgrade_why_upgrade,
  '15-system-integration/automation-pyramid': topic_15_system_integration_automation_pyramid,
  '15-system-integration/integration-walkthrough': topic_15_system_integration_integration_walkthrough,
  '15-system-integration/real-world-case': topic_15_system_integration_real_world_case,
};

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Lấy thông tin bài học theo slug.
 * Lọc bỏ topic draft trong topicOrder khi chạy production build.
 */
export function getLesson(slug: string): LessonContentFile | undefined {
  const lesson = allLessons.find(l => l.slug === slug);
  if (!lesson) return undefined;
  if (isProduction) {
    return {
      ...lesson,
      topicOrder: lesson.topicOrder.filter(topicSlug => {
        const topic = allTopics[`${slug}/${topicSlug}`];
        return topic && topic.status !== 'draft';
      })
    };
  }
  return lesson;
}

/**
 * Lấy danh sách tất cả các bài học.
 */
export function getLessons(): LessonContentFile[] {
  if (isProduction) {
    return allLessons.map(lesson => ({
      ...lesson,
      topicOrder: lesson.topicOrder.filter(topicSlug => {
        const topic = allTopics[`${lesson.slug}/${topicSlug}`];
        return topic && topic.status !== 'draft';
      })
    }));
  }
  return allLessons;
}

/**
 * Lấy nội dung chi tiết của một topic theo lessonSlug và topicSlug.
 * Ẩn topic có status === 'draft' khi chạy production build.
 */
export function getTopic(lessonSlug: string, topicSlug: string): TopicContent | undefined {
  const topic = allTopics[`${lessonSlug}/${topicSlug}`];
  if (!topic) return undefined;
  if (isProduction && topic.status === 'draft') return undefined;
  return topic;
}

/**
 * Tính số hiển thị của topic trên web, ví dụ "1.1", "2.1", "2.2"...
 * Công thức: lesson.id + '.' + (vị trí trong topicOrder + 1)
 */
export function topicNumber(lessonSlugOrLesson: string | LessonContentFile, topicSlug: string): string {
  const lesson = typeof lessonSlugOrLesson === 'string' ? getLesson(lessonSlugOrLesson) : lessonSlugOrLesson;
  if (!lesson) return '';
  const idx = lesson.topicOrder.indexOf(topicSlug);
  if (idx === -1) return '';
  return `${lesson.id}.${idx + 1}`;
}
