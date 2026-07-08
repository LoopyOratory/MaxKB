import { Result } from '@/request/Result'
import { get, post, del, put } from '@/request/index'
import type { pageRequest } from '@/api/type/common'
import type { Ref } from 'vue'
import useStore from '@/stores'
const prefix: any = { _value: '/workspace/' }
Object.defineProperty(prefix, 'value', {
  get: function () {
    const { user } = useStore()
    return this._value + user.getWorkspaceId() + '/knowledge'
  },
})

/**
 * CreationParagraph
 * @param Parameters
 * knowledge_id, document_id
 * {
      "content": "string",
      "title": "string",
      "is_active": true,
      "problem_list": [
        {
          "content": "string"
        }
      ]
    }
 */
const postParagraph: (
  knowledge_id: string,
  document_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, document_id, data, loading) => {
  return post(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph`,
    data,
    undefined,
    loading,
  )
}

/**
 * ParagraphPaginationList
 * @param Parameters knowledge_id document_id
 * param {
          "title": "string",
          "content": "string",
        }
 */
const getParagraphPage: (
  knowledge_id: string,
  document_id: string,
  page: pageRequest,
  param: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, document_id, page, param, loading) => {
  return get(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/${page.current_page}/${page.page_size}`,
    param,
    loading,
  )
}

/**
 * ModificationParagraph
 * @param Parameters
 * knowledge_id, document_id, paragraph_id
 * {
    "content": "string",
    "title": "string",
    "is_active": true,
      "problem_list": [
        {
          "content": "string"
        }
      ]
  }
 */
const putParagraph: (
  knowledge_id: string,
  document_id: string,
  paragraph_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, document_id, paragraph_id, data, loading) => {
  return put(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/${paragraph_id}`,
    data,
    undefined,
    loading,
  )
}

/**
 * DeletionParagraph
 * @param Parameters knowledge_id, document_id, paragraph_id
 */
const delParagraph: (
  knowledge_id: string,
  document_id: string,
  paragraph_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (knowledge_id, document_id, paragraph_id, loading) => {
  return del(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/${paragraph_id}`,
    undefined,
    {},
    loading,
  )
}

/**
 * Paragraph question list
 * @param Parameters knowledge_id，document_id，paragraph_id
 */
const getParagraphProblem: (
  knowledge_id: string,
  document_id: string,
  paragraph_id: string,
) => Promise<Result<any>> = (knowledge_id, document_id, paragraph_id: string) => {
  return get(`${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/${paragraph_id}/problem`)
}

/**
 * To aParagraphCreationQuestion
 * @param Parameters
 * knowledge_id, document_id, paragraph_id
 * {
      content": "string"
    }
 */
const postParagraphProblem: (
  knowledge_id: string,
  document_id: string,
  paragraph_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, document_id, paragraph_id, data: any, loading) => {
  return post(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/${paragraph_id}/problem`,
    data,
    {},
    loading,
  )
}


/**
 * ParagraphReorder
 * @param knowledge_id Datasetid
 * @param document_id Documentid
 * @param loading Loader
 * @query data {
 *              paragraph_id Paragraphid  new_position New order
 *             }
 */
const putAdjustPosition: (
  knowledge_id: string,
  document_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, document_id, data, loading) => {
  return put(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/adjust_position`,
    {},
    data,
    loading,
  )
}

/**
 * Add paragraph association question
 * @param knowledge_id Datasetid
 * @param document_id Documentid
 * @param loading Loader
 * @query data {
 *              paragraph_id Paragraphid  problem_id Questionid
 *             }
 */
const putAssociationProblem: (
  knowledge_id: string,
  document_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, document_id, data, loading) => {
  return put(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/association`,
    {},
    data,
    loading,
  )
}

/**
 * BatchDeletionParagraph
 * @param Parameters knowledge_id, document_id
 */
const putMulParagraph: (
  knowledge_id: string,
  document_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (knowledge_id, document_id, data, loading) => {
  return put(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/batch_delete`,
    { id_list: data },
    undefined,
    loading,
  )
}

/**
 * BatchAssociationQuestion
 * @param Parameters knowledge_id, document_id
 * {
      "paragraph_id_list": [
        "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      ],
      "model_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "prompt": "string",
      "document_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
 */
const putBatchGenerateRelated: (
  knowledge_id: string,
  document_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (knowledge_id, document_id, data, loading) => {
  return put(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/batch_generate_related`,
    data,
    undefined,
    loading,
  )
}

/**
 * BatchMigrationParagraph
 * @param Parameters knowledge_id,target_knowledge_id,
 * {
      "id_list": [
        "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      ]
    }
 */
const putMigrateMulParagraph: (
  knowledge_id: string,
  document_id: string,
  target_knowledge_id: string,
  target_document_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (
  knowledge_id,
  document_id,
  target_knowledge_id,
  target_document_id,
  data,
  loading,
) => {
  return put(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/migrate/knowledge/${target_knowledge_id}/document/${target_document_id}`,
    data,
    undefined,
    loading,
  )
}

/**
 * Remove from aParagraphAssociationQuestion
 * @param Parameters knowledge_id, document_id,
 * @query data {
 *            paragraph_id Paragraphid  problem_id Questionid
 *         }
 */
const putDisassociationProblem: (
  knowledge_id: string,
  document_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (knowledge_id, document_id, data, loading) => {
  return put(
    `${prefix.value}/${knowledge_id}/document/${document_id}/paragraph/unassociation`,
    {},
    data,
    loading,
  )
}

export default {
  postParagraph,
  getParagraphPage,
  putParagraph,
  delParagraph,
  getParagraphProblem,
  postParagraphProblem,
  putAssociationProblem,
  putMulParagraph,
  putBatchGenerateRelated,
  putMigrateMulParagraph,
  putDisassociationProblem,
  putAdjustPosition
}
