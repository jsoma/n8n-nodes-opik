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
		displayName: 'Input',
		name: 'spanInputGroup',
		type: 'collection',
		placeholder: 'Configure input data',
		default: {},
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: showSpan,
		},
	options: [
		{
			displayName: 'Input Mode',
			name: 'spanInputMode',
			type: 'options',
			default: 'manual',
			options: [
				{ name: 'Manual Mapping (Drag & Drop)', value: 'manual' },
				{ name: 'JSON', value: 'json' },
			],
		},
		{
			displayName: 'Input Key/Value Pairs',
			name: 'spanInputAssignments',
			type: 'assignmentCollection',
			default: {},
			displayOptions: {
				show: {
					'options.spanInputMode': ['manual'],
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
					'options.spanInputMode': ['json'],
				},
			},
		},
	],
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
					'={{$parameter.spanInputMode === "json" ? (() => { const data = $parameter.spanInputJson || {}; return Object.keys(data).length ? data : undefined; })() : (() => { const assignments = $parameter.spanInputAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Output Mode',
		name: 'spanOutputMode',
		type: 'options',
		default: 'manual',
		options: [
			{ name: 'Manual Mapping (Drag & Drop)', value: 'manual' },
			{ name: 'JSON', value: 'json' },
		],
		displayOptions: {
			show: showSpan,
		},
	},
	{
		displayName: 'Output Key/Value Pairs',
		name: 'spanOutputAssignments',
		type: 'assignmentCollection',
		default: {},
		displayOptions: {
			show: {
				...showSpan,
				spanOutputMode: ['manual'],
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
				spanOutputMode: ['json'],
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
					'={{$parameter.spanOutputMode === "json" ? (() => { const data = $parameter.spanOutputJson || {}; return Object.keys(data).length ? data : undefined; })() : (() => { const assignments = $parameter.spanOutputAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Metadata',
		name: 'spanMetadataGroup',
		type: 'collection',
		placeholder: 'Configure metadata',
		default: {},
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: showSpan,
		},
		options: [
			{
				displayName: 'Metadata Mode',
				name: 'spanMetadataMode',
				type: 'options',
				default: 'manual',
				options: [
					{ name: 'Manual Mapping (Drag & Drop)', value: 'manual' },
					{ name: 'JSON', value: 'json' },
				],
			},
			{
				displayName: 'Metadata Key/Value Pairs',
				name: 'spanMetadataAssignments',
				type: 'assignmentCollection',
				default: {},
				displayOptions: {
					show: {
						'options.spanMetadataMode': ['manual'],
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
						'options.spanMetadataMode': ['json'],
					},
				},
			},
		],
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
					'={{$parameter.spanMetadataMode === "json" ? (() => { const data = $parameter.spanMetadataJson || {}; return Object.keys(data).length ? data : undefined; })() : (() => { const assignments = $parameter.spanMetadataAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
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
