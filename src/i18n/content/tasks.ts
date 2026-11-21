/**
 * Render-time copy for an example's task.
 *
 * The 24 tasks in src/content/exampleTasks.ts keep their English goal, step
 * texts and learned line: the engine steps through `when`, `holdMs`,
 * `action`, `ring` and `field`, and the walkthrough test plays the English
 * steps move for move. What TaskCard shows goes through here: in Chinese,
 * the step text is replaced wholesale from zh/tasks.ts (it has to be a
 * replacement and not a lookup, because the built-in "Raise the load to N"
 * text varies with its number), the figure labels follow the step's own
 * order, and every field the engine reads passes through untouched. TaskCard
 * therefore renders the copy and keeps evaluating `when` on the same
 * objects, while the field-row comparison still runs on the English field
 * name passed through `t()`.
 *
 * In the en locale the task comes back as the same object, so nothing changes
 * for the English reader and no render churn is added.
 */

import { getLocale } from '../index';
import { zhTasks } from '../zh/tasks';
import type { ExampleTask, Fig, TaskStep } from '../../learn/exampleTask';

/** The task's goal, steps and learned line as they should show right now. */
export function taskCopy(task: ExampleTask): ExampleTask {
  if (getLocale() !== 'zh') return task;
  const zh = zhTasks[task.presetId];
  if (!zh) return task;
  const steps: TaskStep[] = task.steps.map((step, i) => {
    const figs = step.figs
      ? step.figs.map((f, j): Fig => ({ ...f, label: zh.figs?.[i]?.[j] ?? f.label }))
      : undefined;
    return {
      ...step,
      text: zh.steps[i] ?? step.text,
      ...(figs ? { figs } : {}),
    };
  });
  return {
    presetId: task.presetId,
    goal: zh.goal,
    steps,
    learned: zh.learned,
  };
}
