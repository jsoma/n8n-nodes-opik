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
							start_time: '={{$now.toISO()}}',
							end_time: '={{$now.toISO()}}',
						},
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
		displayName: 'Span Name',
		name: 'spanName',
		type: 'string',
		required: true,
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
		displayName: 'Span Type',
		name: 'spanType',
		type: 'options',
		options: [
			{ name: 'General', value: 'general' },
			{ name: 'LLM', value: 'llm' },
			{ name: 'Tool', value: 'tool' },
			{ name: 'Agent', value: 'agent' },
		],
		default: 'general',
		description: 'Categorize the work performed within the span',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'type',
			},
		},
	},
	{
		displayName: 'Parent Span ID',
		name: 'parentSpanId',
		type: 'string',
		default: '',
		description: 'Attach to a parent span to build a hierarchy',
		displayOptions: {
			show: showSpan,
		},
		routing: {
			send: {
				type: 'body',
				property: 'parent_span_id',
			},
		},
	},
	{
		displayName: 'Use JSON Input',
		name: 'spanInputUseJson',
		type: 'boolean',
		default: false,
		description: 'Whether to enter the payload as raw JSON instead of key/value pairs',
		displayOptions: {
			show: showSpan,
		},
	},
	{
		displayName: 'Input Key/Value Pairs',
		name: 'spanInputAssignments',
		type: 'assignmentCollection',
		default: {},
		displayOptions: {
			show: {
				...showSpan,
				spanInputUseJson: [false],
			},
		},
	},
	{
		displayName: 'Input (JSON)',
		name: 'spanInputJson',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				...showSpan,
				spanInputUseJson: [true],
			},
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
					'={{$parameter.spanInputUseJson ? (() => { const data = $parameter.spanInputJson || {}; return Object.keys(data).length ? data : undefined; })() : (() => { const assignments = $parameter.spanInputAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Output Mode',
		name: 'spanOutputMode',
		type: 'options',
		default: 'assignment',
		options: [
			{ name: 'Key/Value (Drag & Drop)', value: 'assignment' },
			{ name: 'JSON', value: 'json' },
		],
		displayOptions: {
			show: showSpan,
		},
	},
	{
		displayName: 'Use JSON Output',
		name: 'spanOutputUseJson',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showSpan,
		},
		description: 'Whether to enter span output as raw JSON instead of key/value pairs',
	},
	{
		displayName: 'Output Key/Value Pairs',
		name: 'spanOutputAssignments',
		type: 'assignmentCollection',
		default: {},
		displayOptions: {
			show: {
				...showSpan,
				spanOutputUseJson: [false],
			},
		},
	},
	{
		displayName: 'Output (JSON)',
		name: 'spanOutputJson',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				...showSpan,
				spanOutputUseJson: [true],
			},
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
					'={{$parameter.spanOutputUseJson ? (() => { const data = $parameter.spanOutputJson || {}; return Object.keys(data).length ? data : undefined; })() : (() => { const assignments = $parameter.spanOutputAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Use JSON Metadata',
		name: 'spanMetadataUseJson',
		type: 'boolean',
		default: false,
		description: 'Whether to enter metadata as raw JSON instead of key/value pairs',
		displayOptions: {
			show: showSpan,
		},
	},
	{
		displayName: 'Metadata Key/Value Pairs',
		name: 'spanMetadataAssignments',
		type: 'assignmentCollection',
		default: {},
		displayOptions: {
			show: {
				...showSpan,
				spanMetadataUseJson: [false],
			},
		},
	},
	{
		displayName: 'Metadata (JSON)',
		name: 'spanMetadataJson',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				...showSpan,
				spanMetadataUseJson: [true],
			},
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
					'={{$parameter.spanMetadataUseJson ? (() => { const data = $parameter.spanMetadataJson || {}; return Object.keys(data).length ? data : undefined; })() : (() => { const assignments = $parameter.spanMetadataAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
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
