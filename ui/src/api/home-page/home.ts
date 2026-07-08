import { Result } from '@/request/Result'
import { get, post, del, put, exportFile } from '@/request/index'
import { type Ref } from 'vue'
import type { pageRequest } from '@/api/type/common'

import useStore from '@/stores'
const prefix: any = { _value: '/workspace/' }
Object.defineProperty(prefix, 'value', {
  get: function () {
    const { user } = useStore()
    return this._value + user.getWorkspaceId() + '/homepage'
  },
})

/**
 * ApplicationAggregation
 * @params
 */
const getApplicationAggregation: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get(`${prefix.value}/application/aggregation`, undefined, loading)
}
/**
 * Knowledge baseAggregation
 * @params
 */
const getKnowledgeAggregation: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get(`${prefix.value}/knowledge/aggregation`, undefined, loading)
}
/**
 * ToolAggregation
 * @params
 */
const getToolAggregation: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get(`${prefix.value}/tool/aggregation`, undefined, loading)
}
/**
 * ModelAggregation
 * @params
 */
const getModelAggregation: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get(`${prefix.value}/model/aggregation`, undefined, loading)
}

/**
 * Tokens Consumption
 * @params {end_time,start_time}
 */
const getTokensRanking: (
  page: pageRequest,
  params: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (page, params, loading) => {
  return get(
    `${prefix.value}/application/tokens_ranking/${page.current_page}/${page.page_size}`,
    params,
    loading,
  )
}
/**
 * AskCount
 * @params {end_time,start_time}
 */
const getQuestionsRanking: (
  page: pageRequest,
  params: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (page, params, loading) => {
  return get(
    `${prefix.value}/application/question_ranking/${page.current_page}/${page.page_size}`,
    params,
    loading,
  )
}
/**
 * UserConsumptiontoken
 * @params {end_time,start_time}
 */
const getUserTokensRanking: (
  page: pageRequest,
  params: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (page, params, loading) => {
  return get(
    `${prefix.value}/application/user_tokens_ranking/${page.current_page}/${page.page_size}`,
    params,
    loading,
  )
}

/**
 * Conversation-related statistics trend
 * @params  {application_id, end_time, start_time}
 */
const getMonitorAggregation: (params: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  params,
  loading,
) => {
  return get(`${prefix.value}/monitoring/aggregation`, params, loading)
}

/**
 * ConversationTotal
 * @params  {end_time, start_time}
 */
const getChatRecordAggregation: (params: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  params,
  loading,
) => {
  return get(`${prefix.value}/chat_record/aggregation`, params, loading)
}
/**
 * TokenTotal
 * @params  {end_time, start_time}
 */
const getTokensAggregation: (params: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  params,
  loading,
) => {
  return get(`${prefix.value}/tokens/aggregation`, params, loading)
}

/**
 * Export
 * @params  {name, end_time, start_time}
 */
const exportTokensRankings: (params: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  params,
  loading,
) => {
  return exportFile('tokens_ranking', `${prefix.value}/tokens_ranking/export`, params, loading)
}
const exportQuestionsRankings: (params: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  params,
  loading,
) => {
  return exportFile(
    'questions_rankings',
    `${prefix.value}/question_ranking/export`,
    params,
    loading,
  )
}
const exportUserTokensRankings: (params: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  params,
  loading,
) => {
  return exportFile(
    'user_tokens_rankings',
    `${prefix.value}/user_tokens_ranking/export`,
    params,
    loading,
  )
}

export default {
  getApplicationAggregation,
  getKnowledgeAggregation,
  getToolAggregation,
  getModelAggregation,
  getTokensRanking,
  getQuestionsRanking,
  getUserTokensRanking,
  getMonitorAggregation,
  getChatRecordAggregation,
  getTokensAggregation,
  exportTokensRankings,
  exportQuestionsRankings,
  exportUserTokensRankings,
}
