import type { INodeProperties } from 'n8n-workflow';

const showSpan = {
	resource: ['span'],
};

export const spanDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showSpan,
		},
		options: [
			{
				name: 'Log Span',
				value: 'log',
				action: 'Log a span',
				description: 'Record a detailed span within a trace',
					routing: {
						request: {
							method: 'POST',
							url: '/v1/private/spans',
							body: {
								id: '={{$parameter.spanResolvedId}}',
								start_time: '={{$parameter.options?.startTime || $now.toISO()}}',
								end_time: '={{$parameter.options?.endTime || $now.toISO()}}',
								project_name: '={{$parameter.projectName}}',
								name: '={{$parameter.spanName || undefined}}',
								type: '={{$parameter.options?.spanType || undefined}}',
								parent_span_id: '={{$parameter.options?.parentSpanId || undefined}}',
								model: '={{$parameter.options?.model || undefined}}',
								provider: '={{$parameter.options?.provider || undefined}}',
								tags: '={{$parameter.options?.tags || undefined}}',
								total_estimated_cost: '={{$parameter.options?.totalEstimatedCost || undefined}}',
								total_estimated_cost_version:
									'={{$parameter.options?.totalEstimatedCostVersion || undefined}}',
							},
						},
					output: {
						postReceive: [
							{
								type: 'setKeyValue',
								properties: {
									spanId: '={{$parameter.spanResolvedId}}',
								},
							},
						],
					},
				},
				},
		],
		default: 'log',
	},
	{
		displayName: 'Trace ID',
		name: 'spanTraceId',
		type: 'string',
		required: true,
		default: '',
		description: 'Identifier of the trace the span belongs to',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'trace_id',
			},
		},
	},
	{
		displayName: 'Resolved Span ID',
		name: 'spanResolvedId',
		type: 'hidden',
		default:
			"={{$parameter.options?.spanId || (function(){const template='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';return template.replace(/[xy]/g,function(c){const r=(Math.random()*16)|0;const v=c==='x'?r:(r&0x3)|0x8;return v.toString(16);});})()}}",
		displayOptions: {
			show: showSpan,
		},
	},
	{
		displayName: 'Span Name',
		name: 'spanName',
		type: 'string',
		default: '',
		description: 'Human-friendly name to identify the span',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'Input Entries',
		name: 'spanInputAssignments',
		type: 'assignmentCollection',
		placeholder: 'Add input entry',
		default: {},
		displayOptions: {
			show: showSpan,
		},
	},
	{
		displayName: 'Resolved Input',
		name: 'spanInput',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'input',
				value:
					'={{(() => { const assignments = $parameter.spanInputAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Output Key/Value Pairs',
		name: 'spanOutputAssignments',
		type: 'assignmentCollection',
		placeholder: 'Add output entry',
		default: {},
		displayOptions: {
			show: showSpan,
		},
	},
	{
		displayName: 'Resolved Output',
		name: 'spanOutput',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'output',
				value:
					'={{(() => { const assignments = $parameter.spanOutputAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Metadata Entries',
		name: 'spanMetadataAssignments',
		type: 'assignmentCollection',
		placeholder: 'Add metadata entry',
		default: {},
		displayOptions: {
			show: showSpan,
		},
	},
	{
		displayName: 'Resolved Metadata',
		name: 'spanMetadata',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'metadata',
				value:
					'={{(() => { const assignments = $parameter.spanMetadataAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Resolved Usage',
		name: 'spanUsage',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'usage',
				value:
					'={{(() => { const assignments = $parameter.options?.spanUsageAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { const numericValue = Number(assignment.value); obj[assignment.name] = Number.isNaN(numericValue) ? assignment.value : numericValue; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Resolved Error Info',
		name: 'spanErrorInfo',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'error_info',
				value:
					'={{(() => { const opts = $parameter.options || {}; const result = {}; if (opts.errorMessage) result.message = opts.errorMessage; if (opts.errorType) result.type = opts.errorType; if (opts.errorCode) result.code = opts.errorCode; return Object.keys(result).length ? result : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: showSpan,
		},
		options: [
			{ displayName: 'Cost Version', name: 'totalEstimatedCostVersion', type: 'string', default: '' },
			{
				displayName: 'Custom End Time',
				name: 'endTime',
				type: 'dateTime',
				default: '',
				description: 'Override the default end time (defaults to now)',
			},
			{
				displayName: 'Custom Start Time',
				name: 'startTime',
				type: 'dateTime',
				default: '',
				description: 'Override the default start time (defaults to now)',
			},
			{ displayName: 'Error Code', name: 'errorCode', type: 'string', default: '' },
			{ displayName: 'Error Message', name: 'errorMessage', type: 'string', default: '' },
			{ displayName: 'Error Type', name: 'errorType', type: 'string', default: '' },
			{ displayName: 'Model', name: 'model', type: 'string', default: '' },
			{
				displayName: 'Parent Span ID',
				name: 'parentSpanId',
				type: 'string',
				default: '',
				description: 'Attach to a parent span to build a hierarchy',
			},
			{ displayName: 'Provider', name: 'provider', type: 'string', default: '' },
			{
				displayName: 'Span ID',
				name: 'spanId',
				type: 'string',
				default: '',
				description: 'Provide your own span ID; leave empty to auto-generate',
			},
			{
				displayName: 'Span Type',
				name: 'spanType',
				type: 'options',
				options: [
					{ name: 'Agent', value: 'agent' },
					{ name: 'General', value: 'general' },
					{ name: 'Guardrail', value: 'guardrail' },
					{ name: 'LLM', value: 'llm' },
					{ name: 'Tool', value: 'tool' },
				],
				default: 'general',
				description: 'Categorize the work performed within the span',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				typeOptions: { multipleValues: true },
				default: [],
				description: 'Tag the span for easier filtering in Opik',
			},
			{
				displayName: 'Total Estimated Cost',
				name: 'totalEstimatedCost',
				type: 'number',
				default: 0,
				description: 'Cost associated with the span',
			},
			{
				displayName: 'Usage Entries',
				name: 'spanUsageAssignments',
				type: 'assignmentCollection',
				default: {},
				description: 'Token counts or other usage metrics',
			},
		],
	},
	{
		displayName: 'Tags',
		name: 'spanTags',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		description: 'Add searchable tags to the span',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'tags',
			},
		},
	},
	{
		displayName: 'LLM Usage',
		name: 'llmUsage',
		type: 'collection',
		default: {},
		placeholder: 'Add token counts',
		description: 'Capture prompt/completion token counts for LLM calls',
		displayOptions: {
			show: showSpan,
		},
		options: [
			{
				displayName: 'Prompt Tokens',
				name: 'promptTokens',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				routing: {
					send: {
						type: 'body',
						property: 'usage.prompt_tokens',
					},
				},
			},
			{
				displayName: 'Completion Tokens',
				name: 'completionTokens',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				routing: {
					send: {
						type: 'body',
						property: 'usage.completion_tokens',
					},
				},
			},
		],
	},
];
