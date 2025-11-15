import type { INodeProperties } from 'n8n-workflow';

const showTrace = {
	resource: ['trace'],
};

const showStartTrace = {
	...showTrace,
	operation: ['start'],
};

const showEndTrace = {
	...showTrace,
	operation: ['end'],
};

export const traceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showTrace,
		},
		options: [
			{
				name: 'Start Trace',
				value: 'start',
				action: 'Start a trace',
				description: 'Create a new Opik trace to capture workflow execution',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/private/traces',
						returnFullResponse: true,
						body: {
							start_time: '={{$now.toISO()}}',
							name: "={{$parameter.options?.traceName || `Trace ${$now.toFormat('yyyy-LL-dd HH:mm:ss')}`}}",
							project_name: '={{$parameter.options?.projectName || undefined}}',
							thread_id: '={{$parameter.options?.threadId || undefined}}',
							end_time: '={{$parameter.options?.autoEndTrace ? $now.toISO() : undefined}}',
						},
					},
					output: {
						postReceive: [
							{
								type: 'setKeyValue',
								properties: {
									traceId:
										'={{$response.headers?.location ? $response.headers.location.split("/").pop() : undefined}}',
									traceName:
										"={{$parameter.options?.traceName || `Trace ${$now.toFormat('yyyy-LL-dd HH:mm:ss')}`}}",
									projectName: '={{$parameter.options?.projectName || "(workspace default)"}}',
									threadId: '={{$parameter.options?.threadId || undefined}}',
									traceUrl: '={{$response.headers?.location || undefined}}',
									status: '={{$parameter.options?.autoEndTrace ? "ended" : "started"}}',
									autoEnded: '={{$parameter.options?.autoEndTrace === true}}',
								},
							},
						],
					},
				},
			},
			{
				name: 'End Trace',
				value: 'end',
				action: 'End a trace',
				description: 'Complete an existing Opik trace with output details',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/v1/private/traces/{{$parameter.traceId}}',
						body: {
							end_time: '={{$now.toISO()}}',
						},
					},
				},
			},
		],
		default: 'start',
	},
	{
		displayName: 'Input',
		name: 'traceInputGroup',
		type: 'collection',
		placeholder: 'Configure input data',
		default: {},
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: showStartTrace,
		},
	options: [
		{
			displayName: 'Input Mode',
			name: 'traceInputMode',
				type: 'options',
				default: 'manual',
				options: [
					{
						name: 'Manual Mapping (Drag & Drop)',
						value: 'manual',
					},
					{
						name: 'JSON',
						value: 'json',
					},
				],
		},
		{
			displayName: 'Input Key/Value Pairs',
			name: 'traceInputAssignments',
			type: 'assignmentCollection',
			default: {},
			displayOptions: {
				show: {
					'options.traceInputMode': ['manual'],
				},
			},
		},
		{
			displayName: 'Input (JSON)',
			name: 'traceInputJson',
			type: 'json',
			default: '{}',
			displayOptions: {
				show: {
					'options.traceInputMode': ['json'],
				},
			},
		},
	],
	},
	{
		displayName: 'Resolved Input',
		name: 'traceInput',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: showStartTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'input',
				value:
					'={{$parameter.traceInputMode === "json" ? (() => { const data = $parameter.traceInputJson || {}; return Object.keys(data).length ? data : undefined; })() : (() => { const assignments = $parameter.traceInputAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Metadata',
		name: 'traceMetadataGroup',
		type: 'collection',
		placeholder: 'Configure metadata',
		default: {},
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: showStartTrace,
		},
	options: [
		{
			displayName: 'Metadata Mode',
			name: 'traceMetadataMode',
			type: 'options',
			default: 'manual',
			options: [
				{
					name: 'Manual Mapping (Drag & Drop)',
					value: 'manual',
				},
				{
					name: 'JSON',
					value: 'json',
				},
			],
		},
		{
			displayName: 'Metadata Key/Value Pairs',
			name: 'traceMetadataAssignments',
			type: 'assignmentCollection',
			default: {},
			displayOptions: {
				show: {
					'options.traceMetadataMode': ['manual'],
				},
			},
		},
		{
			displayName: 'Metadata (JSON)',
			name: 'traceMetadataJson',
			type: 'json',
			default: '{}',
			displayOptions: {
				show: {
					'options.traceMetadataMode': ['json'],
				},
			},
		},
	],
	},
	{
		displayName: 'Resolved Metadata',
		name: 'traceMetadata',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: showStartTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'metadata',
				value:
					'={{$parameter.traceMetadataMode === "json" ? (() => { const data = $parameter.traceMetadataJson || {}; return Object.keys(data).length ? data : undefined; })() : (() => { const assignments = $parameter.traceMetadataAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {
			autoEndTrace: false,
		},
		displayOptions: {
			show: showStartTrace,
		},
		options: [
			{
				displayName: 'Trace Name',
				name: 'traceName',
				type: 'string',
				default: '',
				description:
					'Override the auto-generated trace label (defaults to a timestamp if left empty)',
			},
			{
				displayName: 'Project Name or ID',
				name: 'projectName',
				type: 'options',
				required: true,
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
			},
			{
				displayName: 'Thread ID',
				name: 'threadId',
				type: 'string',
				default: '',
				description: 'Use the same thread ID to group related traces',
			},
			{
				displayName: 'Auto End Trace',
				name: 'autoEndTrace',
				type: 'boolean',
				default: false,
				description: 'Whether to immediately mark the trace as completed after creation',
			},
		],
	},
	{
		displayName: 'Tags',
		name: 'traceTags',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		description: 'Tag the trace for easier filtering in Opik',
		displayOptions: {
			show: showStartTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'tags',
			},
		},
	},
	{
		displayName: 'Trace ID',
		name: 'traceId',
		type: 'string',
		required: true,
		default: '',
		description: 'Unique identifier returned by the Start Trace operation',
		displayOptions: {
			show: showEndTrace,
		},
	},
	{
		displayName: 'Output',
		name: 'traceOutput',
		type: 'json',
		default: '{}',
		description: 'Final output of the workflow run (JSON). Leave empty to skip.',
		displayOptions: {
			show: showEndTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'output',
				value:
					'={{Object.keys($parameter.traceOutput || {}).length ? $parameter.traceOutput : undefined}}',
			},
		},
	},
	{
		displayName: 'Additional Metadata',
		name: 'traceEndMetadata',
		type: 'json',
		default: '{}',
		description: 'Metadata updates to attach when completing the trace',
		displayOptions: {
			show: showEndTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'metadata',
				value:
					'={{Object.keys($parameter.traceEndMetadata || {}).length ? $parameter.traceEndMetadata : undefined}}',
			},
		},
	},
	{
		displayName: 'Error Message',
		name: 'traceError',
		type: 'string',
		default: '',
		description: 'Text description of any failure that occurred',
		displayOptions: {
			show: showEndTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'error',
			},
		},
	},
];
