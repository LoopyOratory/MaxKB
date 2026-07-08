export enum SearchMode {
  embedding = 'views.application.dialog.vectorSearch',
  keywords = 'views.application.dialog.fullTextSearch',
  blend = 'views.application.dialog.hybridSearch',
}

export enum WorkflowType {
  Base = 'base-node',
  KnowledgeBase = 'knowledge-base-node',
  Start = 'start-node',
  AiChat = 'ai-chat-node',
  SearchKnowledge = 'search-knowledge-node',
  SearchDocument = 'search-document-node',
  Question = 'question-node',
  Condition = 'condition-node',
  Reply = 'reply-node',
  ToolLib = 'tool-lib-node',
  ToolWorkflowLib = 'tool-workflow-lib-node',
  ToolLibCustom = 'tool-node',
  RerankerNode = 'reranker-node',
  Application = 'application-node',
  DocumentExtractNode = 'document-extract-node',
  DocumentSplitNode = 'document-split-node',
  ImageUnderstandNode = 'image-understand-node',
  VariableAssignNode = 'variable-assign-node',
  FormNode = 'form-node',
  TextToSpeechNode = 'text-to-speech-node',
  SpeechToTextNode = 'speech-to-text-node',
  ImageGenerateNode = 'image-generate-node',
  McpNode = 'mcp-node',
  IntentNode = 'intent-node',
  TextToVideoGenerateNode = 'text-to-video-node',
  ImageToVideoGenerateNode = 'image-to-video-node',
  LoopNode = 'loop-node',
  LoopBodyNode = 'loop-body-node',
  LoopStartNode = 'loop-start-node',
  LoopContinueNode = 'loop-continue-node',
  LoopBreakNode = 'loop-break-node',
  VariableSplittingNode = 'variable-splitting-node',
  VariableAggregationNode = 'variable-aggregation-node',
  VideoUnderstandNode = 'video-understand-node',
  ParameterExtractionNode = 'parameter-extraction-node',
  DataSourceLocalNode = 'data-source-local-node',
  DataSourceWebNode = 'data-source-web-node',
  KnowledgeWriteNode = 'knowledge-write-node',
  ToolStartNode = 'tool-start-node',
  ToolBaseNode = 'tool-base-node',
}
export enum WorkflowKind {
  DataSource = 'data-source',
}
export enum WorkflowMode {
  // ApplicationWorkflow
  Application = 'application',
  // ApplicationWorkflowLoop
  ApplicationLoop = 'application-loop',
  // Knowledge base workflow
  Knowledge = 'knowledge',
  // Tool
  Tool = 'tool',
  // Tool loop body
  ToolLoop = 'tool-loop',
  // Knowledge base workflow loop body
  KnowledgeLoop = 'knowledge-loop',
}
