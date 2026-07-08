import { type Dict } from '@/api/type/common'
interface TaskTypeInterface {
  // Vectorization
  EMBEDDING: number
  // GenerateQuestion
  GENERATE_PROBLEM: number
  // Sync
  SYNC: number
  // TokenizationIndex
  TOKENIZE: number
}
interface StateInterface {
  // Wait
  PENDING: '0'
  // Execute in 
  STARTED: '1'
  // Success
  SUCCESS: '2'
  // Failure
  FAILURE: '3'
  // CancelTask
  REVOKE: '4'
  // CancelSuccess
  REVOKED: '5'
  IGNORED: 'n'
}
const TaskType: TaskTypeInterface = {
  EMBEDDING: 1,
  GENERATE_PROBLEM: 2,
  SYNC: 3,
  TOKENIZE: 4,
}
const State: StateInterface = {
  // Wait
  PENDING: '0',
  // Execute in 
  STARTED: '1',
  // Success
  SUCCESS: '2',
  // Failure
  FAILURE: '3',
  // CancelTask
  REVOKE: '4',
  // CancelSuccess
  REVOKED: '5',
  IGNORED: 'n'
}
class Status {
  task_status: Dict<any>
  constructor(status?: string) {
    if (!status) {
      status = ''
    }
    status = status.split('').reverse().join('')
    this.task_status = {}
    for (const key in TaskType) {
      const value = TaskType[key as keyof TaskTypeInterface]
      const index = value - 1
      this.task_status[value] = status[index] ? status[index] : 'n'
    }
  }
  toString() {
    const r = []
    for (const key in TaskType) {
      const value = TaskType[key as keyof TaskTypeInterface]
      r.push(this.task_status[value])
    }
    return r.reverse().join('')
  }
}
export { Status, State, TaskType, type TaskTypeInterface, type StateInterface }
