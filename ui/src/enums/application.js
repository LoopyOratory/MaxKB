export var SearchMode;
(function (SearchMode) {
    SearchMode["embedding"] = "views.application.dialog.vectorSearch";
    SearchMode["keywords"] = "views.application.dialog.fullTextSearch";
    SearchMode["blend"] = "views.application.dialog.hybridSearch";
})(SearchMode || (SearchMode = {}));
export var WorkflowType;
(function (WorkflowType) {
    WorkflowType["Base"] = "base-node";
    WorkflowType["KnowledgeBase"] = "knowledge-base-node";
    WorkflowType["Start"] = "start-node";
    WorkflowType["AiChat"] = "ai-chat-node";
    WorkflowType["SearchKnowledge"] = "search-knowledge-node";
    WorkflowType["SearchDocument"] = "search-document-node";
    WorkflowType["Question"] = "question-node";
    WorkflowType["Condition"] = "condition-node";
    WorkflowType["Reply"] = "reply-node";
    WorkflowType["ToolLib"] = "tool-lib-node";
    WorkflowType["ToolWorkflowLib"] = "tool-workflow-lib-node";
    WorkflowType["ToolLibCustom"] = "tool-node";
    WorkflowType["RerankerNode"] = "reranker-node";
    WorkflowType["Application"] = "application-node";
    WorkflowType["DocumentExtractNode"] = "document-extract-node";
    WorkflowType["DocumentSplitNode"] = "document-split-node";
    WorkflowType["ImageUnderstandNode"] = "image-understand-node";
    WorkflowType["VariableAssignNode"] = "variable-assign-node";
    WorkflowType["FormNode"] = "form-node";
    WorkflowType["TextToSpeechNode"] = "text-to-speech-node";
    WorkflowType["SpeechToTextNode"] = "speech-to-text-node";
    WorkflowType["ImageGenerateNode"] = "image-generate-node";
    WorkflowType["McpNode"] = "mcp-node";
    WorkflowType["IntentNode"] = "intent-node";
    WorkflowType["TextToVideoGenerateNode"] = "text-to-video-node";
    WorkflowType["ImageToVideoGenerateNode"] = "image-to-video-node";
    WorkflowType["LoopNode"] = "loop-node";
    WorkflowType["LoopBodyNode"] = "loop-body-node";
    WorkflowType["LoopStartNode"] = "loop-start-node";
    WorkflowType["LoopContinueNode"] = "loop-continue-node";
    WorkflowType["LoopBreakNode"] = "loop-break-node";
    WorkflowType["VariableSplittingNode"] = "variable-splitting-node";
    WorkflowType["VariableAggregationNode"] = "variable-aggregation-node";
    WorkflowType["VideoUnderstandNode"] = "video-understand-node";
    WorkflowType["ParameterExtractionNode"] = "parameter-extraction-node";
    WorkflowType["DataSourceLocalNode"] = "data-source-local-node";
    WorkflowType["DataSourceWebNode"] = "data-source-web-node";
    WorkflowType["KnowledgeWriteNode"] = "knowledge-write-node";
    WorkflowType["ToolStartNode"] = "tool-start-node";
    WorkflowType["ToolBaseNode"] = "tool-base-node";
})(WorkflowType || (WorkflowType = {}));
export var WorkflowKind;
(function (WorkflowKind) {
    WorkflowKind["DataSource"] = "data-source";
})(WorkflowKind || (WorkflowKind = {}));
export var WorkflowMode;
(function (WorkflowMode) {
    // ApplicationWorkflow
    WorkflowMode["Application"] = "application";
    // ApplicationWorkflowLoop
    WorkflowMode["ApplicationLoop"] = "application-loop";
    // Knowledge base workflow
    WorkflowMode["Knowledge"] = "knowledge";
    // Tool
    WorkflowMode["Tool"] = "tool";
    // Tool loop body
    WorkflowMode["ToolLoop"] = "tool-loop";
    // Knowledge base workflow loop body
    WorkflowMode["KnowledgeLoop"] = "knowledge-loop";
})(WorkflowMode || (WorkflowMode = {}));
