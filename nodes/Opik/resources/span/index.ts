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
								project_name: '={{$parameter.projectName}}',
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
